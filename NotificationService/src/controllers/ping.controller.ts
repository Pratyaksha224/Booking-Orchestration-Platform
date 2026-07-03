import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../config/logger.config";

export const pingHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Ping request received");
        res.status(StatusCodes.OK).json({ 
            message: "Pong!",
            success: true
        });
    } catch (error) {
        next(error);
    }
}