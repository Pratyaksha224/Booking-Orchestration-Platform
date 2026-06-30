import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getProfileService, loginService, registerService } from "../services/auth.service";
import logger from "../config/logger.config";

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await registerService(req.body);
        logger.info(`New user registered`, { email: result.email, userId: result.id });
        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await loginService(req.body);
        logger.info(`User logged in`, { email: result.user.email, userId: result.user.id });
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const profileHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // userId is attached by auth middleware
        const userId = (req as any).userId;
        const result = await getProfileService(userId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Profile retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id as string);
        const result = await getProfileService(userId);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: "User retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
