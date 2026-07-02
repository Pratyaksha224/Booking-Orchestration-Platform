import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../utils/errors/app.error";
import { serverConfig } from "../config";
import logger from "../config/logger.config";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authentication required. Missing Bearer token.");
        }

        const token = authHeader.split(" ")[1];
        
        try {
            const decoded = jwt.verify(token, serverConfig.JWT_SECRET) as { userId: number, role: 'GUEST' | 'HOST' | 'ADMIN' };
            (req as any).userId = decoded.userId;
            (req as any).userRole = decoded.role;
            next();
        } catch (jwtError) {
            logger.error("JWT verification failed", { error: jwtError });
            throw new UnauthorizedError("Invalid or expired token");
        }
    } catch (error) {
        next(error);
    }
};
