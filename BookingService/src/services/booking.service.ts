import prismaClient from "../prisma/client";

import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { CreateBookingDTO } from "../dto/booking.dto";

import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock, getOverlappingBookings } from "../repositories/booking.repository";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import { redLock } from "../config/redis.config";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { getPropertyDetails } from "./property.client";
import { getUserDetails } from "./user.client";
import { addEmailToQueue } from "../producers/email.producer";
import { getCorrelationId } from "../utils/helpers/request.helpers";

export async function createBookingService(createBookingDto: CreateBookingDTO) {
    
    // Calculate nights
    const checkIn = new Date(createBookingDto.checkInDate);
    const checkOut = new Date(createBookingDto.checkOutDate);
    
    if (checkIn.getTime() >= checkOut.getTime()) {
        throw new BadRequestError("Check-out date must be after check-in date");
    }
    
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Validate Property
    const property = await getPropertyDetails(createBookingDto.propertyId);
    
    if (!property.isActive) {
        throw new BadRequestError("Property is currently inactive and cannot be booked");
    }
    if (createBookingDto.totalGuests > property.maxGuests) {
        throw new BadRequestError(`Property can only accommodate up to ${property.maxGuests} guests`);
    }

    // Check for overlapping bookings before locking
    const overlappingBookings = await getOverlappingBookings(createBookingDto.propertyId, checkIn, checkOut);
    if (overlappingBookings.length > 0) {
        throw new BadRequestError("Property is already booked for the selected dates");
    }

    const ttl = serverConfig.LOCK_TTL; 
    // More granular lock resource: property:${propertyId}:${checkInDate}:${checkOutDate}
    const bookingResource = `property:${createBookingDto.propertyId}:${createBookingDto.checkInDate}:${createBookingDto.checkOutDate}`;

    logger.info(`Acquiring lock for resource: ${bookingResource}`, { ttl });

    try {
        await redLock.acquire([bookingResource], ttl);
        
        // Re-check for overlapping bookings after acquiring lock to prevent race conditions
        const finalOverlappingCheck = await getOverlappingBookings(createBookingDto.propertyId, checkIn, checkOut);
        if (finalOverlappingCheck.length > 0) {
             throw new BadRequestError("Property was just booked for the selected dates");
        }

        const booking = await createBooking({
            userId: createBookingDto.userId,
            propertyId: createBookingDto.propertyId,
            totalGuests: createBookingDto.totalGuests,
            bookingAmount: createBookingDto.bookingAmount,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfNights: numberOfNights
        });

        const idempotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idempotencyKey, booking.id);

        logger.info(`Booking created successfully`, { bookingId: booking.id, idempotencyKey });

        return {
            bookingId: booking.id,
            idempotencyKey,  
        };

    } catch (error) {
        logger.error("Lock acquisition or booking creation failed", { error });
        throw new InternalServerError("Failed to create booking. Please try again.");
    }

}

export async function confirmBookingService(idempotencyKey: string) {

    const booking = await prismaClient.$transaction(async (tx) => {
        const idempotencyKeyData = await getIdempotencyKeyWithLock(idempotencyKey, tx);
    
        if (!idempotencyKeyData) {
            throw new NotFoundError("Idempotency key not found");
        }

        if (idempotencyKeyData.bookingId == null) {
            throw new BadRequestError("Idempotency key is not associated with any booking");
        }
        
        if (idempotencyKeyData.finalized) {
            throw new BadRequestError("Booking already finalized");
        }

        const booking = await confirmBooking(idempotencyKeyData.bookingId, tx);
        await finalizeIdempotencyKey(tx, idempotencyKey);

        logger.info(`Booking confirmed successfully`, { bookingId: booking.id });

        return booking; 
    });

    try {
        const user = await getUserDetails(booking.userId);
        const property = await getPropertyDetails(booking.propertyId);
        
        await addEmailToQueue({
            to: user.email,
            subject: "Your Booking is Confirmed!",
            templateId: "booking_confirmation",
            params: {
                userName: user.firstName,
                propertyName: property.name,
                checkIn: booking.checkInDate.toISOString().split('T')[0],
                checkOut: booking.checkOutDate.toISOString().split('T')[0],
                bookingAmount: booking.bookingAmount
            },
            correlationId: getCorrelationId() as string
        });
    } catch (err) {
        logger.error("Failed to enqueue booking confirmation email", { error: err });
    }

    return booking;
}