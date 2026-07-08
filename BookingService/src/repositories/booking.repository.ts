import { Prisma, IdempotencyKey } from "../prisma/generated/prisma/client";

import prismaClient from "../prisma/client";
import { validate as isValidUUID } from "uuid";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";


export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prismaClient.booking.create({
        data: bookingInput
    });
    return booking;
}

export async function createIdempotencyKey(key: string, bookingId?: number) {
    const idempotencyKey = await prismaClient.idempotencyKey.create({
        data: {
            IdemKey: key,
            booking: {
                connect: {
                    id: bookingId
                }
            }
        }
    })
    return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(key: string, tx: Prisma.TransactionClient) {
    
    if (!isValidUUID(key)) {
        throw new BadRequestError("Invalid idempotency key");
    }

    const idempotencyKey : Array<IdempotencyKey> = await tx.$queryRaw `
        SELECT * FROM IdempotencyKey WHERE idemKey = ${key} FOR UPDATE;
    `
    
    if(!idempotencyKey || idempotencyKey.length === 0) {
        throw new NotFoundError("Idempotency key not found");
    }

    return idempotencyKey[0];
}

export async function getBookingById(id: number) {
    const booking = await prismaClient.booking.findUnique({
        where: {
            id
        }
    })
    return booking;
}

export async function changeBookingStatus(bookingId: number, status: Prisma.EnumBookingStatusFieldUpdateOperationsInput) {
    const booking = await prismaClient.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status
        }
    })
    return booking;
}

export async function confirmBooking(bookingId: number, tx: Prisma.TransactionClient) {
    const booking = await tx.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    })
    return booking;
}

export async function cancelBooking(bookingId: number) {
    const booking = await prismaClient.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CANCELLED"
        }
    })
    return booking;
}

export async function getUserBookings(userId: number) {
    const bookings = await prismaClient.booking.findMany({
        where: { userId }
    });
    return bookings;
}

export async function getOverlappingBookings(propertyId: number, checkInDate: Date, checkOutDate: Date) {
    const overlappingBookings = await prismaClient.booking.findMany({
        where: {
            propertyId,
            status: "CONFIRMED",
            OR: [
                {
                    checkInDate: {
                        lt: checkOutDate,
                    },
                    checkOutDate: {
                        gt: checkInDate,
                    }
                }
            ]
        }
    });
    return overlappingBookings;
}

export async function finalizeIdempotencyKey(tx: Prisma.TransactionClient, key: string) {
    const idempotencyKey = await tx.idempotencyKey.update({
        where: {
            IdemKey: key
        },
        data: {
            finalized: true
        }
    })
    return idempotencyKey;
}