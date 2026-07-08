
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { confirmBookingService, createBookingService } from "../services/booking.service";
import logger from "../config/logger.config";

export const createBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const body = { ...req.body, userId };
        
        const booking = await createBookingService(body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Booking created successfully. Use the idempotency key to confirm.",
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}

export const confirmBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`Confirming booking for idempotency key: ${req.params.idempotencyKey}`);
        const booking = await confirmBookingService(req.params.idempotencyKey);

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Booking confirmed successfully",
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}

import { getBookingById, getUserBookings as getUserBookingsRepo, cancelBooking as cancelBookingRepo } from "../repositories/booking.repository";

export const getBookingByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const booking = await getBookingById(id);
        
        if (!booking) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Booking fetched successfully",
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}

export const getUserBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestUserId = (req as any).userId;
        const requestUserRole = (req as any).userRole;
        const targetUserId = parseInt(req.params.userId);

        if (requestUserId !== targetUserId && requestUserRole !== 'ADMIN') {
            res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Access denied. You can only view your own bookings.",
            });
            return;
        }

        const bookings = await getUserBookingsRepo(targetUserId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "User bookings fetched successfully",
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
}

export const cancelBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const requestUserId = (req as any).userId;
        const requestUserRole = (req as any).userRole;
        
        const existingBooking = await getBookingById(id);
        
        if (!existingBooking) {
            res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }

        if (existingBooking.userId !== requestUserId && requestUserRole !== 'ADMIN') {
            res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Access denied. You can only cancel your own bookings.",
            });
            return;
        }

        const booking = await cancelBookingRepo(id);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}