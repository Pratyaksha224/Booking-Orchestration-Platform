
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import { asyncLocalStorage } from "../utils/helpers/request.helpers";

export const attachCorrelationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Re-use the incoming correlationId if present (forwarded from an upstream service/gateway)
    // otherwise generate a fresh one
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    req.headers['x-correlation-id'] = correlationId;

    asyncLocalStorage.run({ correlationId }, () => {
        next();
    });
}