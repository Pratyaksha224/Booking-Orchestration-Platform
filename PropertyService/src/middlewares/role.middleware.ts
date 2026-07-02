import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors/app.error";

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = (req as any).userRole;

            if (!userRole) {
                throw new UnauthorizedError("Role not specified. Access denied.");
            }

            if (!allowedRoles.includes(userRole)) {
                throw new UnauthorizedError(`Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
