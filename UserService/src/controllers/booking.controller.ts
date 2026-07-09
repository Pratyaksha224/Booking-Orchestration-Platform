import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
    createBookingProxy,
    confirmBookingProxy,
    getBookingByIdProxy,
    getUserBookingsProxy,
    cancelBookingProxy
} from "../services/bookingProxy.service";
import { getCorrelationId } from "../utils/helpers/request.helpers";

export const createBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("createBookingHandler called!");
        const correlationId = getCorrelationId();
        const userId = (req as any).userId;
        const role = (req as any).userRole;
        
        const result = await createBookingProxy(req.body, userId, correlationId as string, role);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error: any) {
        if (error.response?.data) {
            return res.status(error.response.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.response.data);
        }
        next(error);
    }
}

export const confirmBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const correlationId = getCorrelationId();
        const userId = (req as any).userId;
        const role = (req as any).userRole;
        
        const result = await confirmBookingProxy(req.params.idempotencyKey as string, userId, correlationId as string, role);
        res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        if (error.response?.data) {
            return res.status(error.response.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.response.data);
        }
        next(error);
    }
}

export const getBookingByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const correlationId = getCorrelationId();
        const userId = (req as any).userId;
        const role = (req as any).userRole;
        
        const result = await getBookingByIdProxy(parseInt(req.params.id as string), userId, correlationId as string, role);
        res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        if (error.response?.data) {
            return res.status(error.response.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.response.data);
        }
        next(error);
    }
}

export const getUserBookingsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const correlationId = getCorrelationId();
        const userId = (req as any).userId;
        const role = (req as any).userRole;
        
        const result = await getUserBookingsProxy(parseInt(req.params.userId as string), userId, correlationId as string, role);
        res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        if (error.response?.data) {
            return res.status(error.response.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.response.data);
        }
        next(error);
    }
}

export const cancelBookingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const correlationId = getCorrelationId();
        const userId = (req as any).userId;
        const role = (req as any).userRole;
        
        const result = await cancelBookingProxy(parseInt(req.params.id as string), userId, correlationId as string, role);
        res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        if (error.response?.data) {
            return res.status(error.response.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.response.data);
        }
        next(error);
    }
}
