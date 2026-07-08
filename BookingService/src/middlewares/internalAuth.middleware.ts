import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors/app.error";

export const internalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];

        if (!userId) {
            throw new UnauthorizedError("Internal authentication failed. Missing x-user-id.");
        }

        (req as any).userId = parseInt(userId as string);
        (req as any).userRole = userRole;

        next();
    } catch (error) {
        next(error);
    }
};
