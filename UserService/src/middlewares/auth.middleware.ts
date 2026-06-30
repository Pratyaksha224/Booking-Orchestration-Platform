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
        if (!token) {
            throw new UnauthorizedError("Authentication required. Missing Bearer token.");
        }
        
        if (!serverConfig.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }
        
        try {
            // Force strict cast to avoid TS issues
            const secret: string = String(serverConfig.JWT_SECRET);
            const decoded = jwt.verify(token, secret) as any;
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
