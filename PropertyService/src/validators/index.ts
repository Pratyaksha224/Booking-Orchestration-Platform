import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import logger from "../config/logger.config";

export const validateRequestBody = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating request body");
            await schema.parseAsync(req.body);
            logger.info("Request body is valid");
            next();
        } catch (error) {
            logger.error("Invalid request body", { error });
            res.status(400).json({ 
                message: "Invalid request body",
                success: false,
                error: error
            });
        }
    }
}

export const validateQueryParams = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info("Validating query params");
            await schema.parseAsync(req.query);
            logger.info("Query params are valid");
            next();
        } catch (error) {
            logger.error("Invalid query params", { error });
            res.status(400).json({ 
                message: "Invalid query params",
                success: false,
                error: error
            });
        }
    }
}
