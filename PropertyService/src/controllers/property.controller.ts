import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createPropertyService, getPropertiesService, getPropertyByIdService } from "../services/property.service";
import logger from "../config/logger.config";

export const createPropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const body = { ...req.body, hostId: userId };
        
        const result = await createPropertyService(body);
        logger.info(`Property created successfully`, { propertyId: result.id });
        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Property created successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getPropertiesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getPropertiesService();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Properties retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getPropertyByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const propertyId = parseInt(req.params.id as string);
        const result = await getPropertyByIdService(propertyId);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Property retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
