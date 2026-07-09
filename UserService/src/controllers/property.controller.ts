import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { createPropertyProxy, getPropertiesProxy, getPropertyByIdProxy } from "../services/propertyProxy.service";

export const createPropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const userRole = (req as any).userRole;

        const result = await createPropertyProxy({ ...req.body, hostId: userId }, userId, userRole);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error: any) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            next(error);
        }
    }
};

export const getPropertiesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getPropertiesProxy();
        res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            next(error);
        }
    }
};

export const getPropertyByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const propertyId = parseInt(req.params.id as string);
        const result = await getPropertyByIdProxy(propertyId);
        res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            next(error);
        }
    }
};
