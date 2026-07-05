import { NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { asyncLocalStorage } from '../utils/helpers/request.helpers';

export const attachCorrelationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Re-use the incoming correlationId if present (forwarded from an upstream service/gateway)
    // otherwise generate a fresh one
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidV4();

    req.headers['x-correlation-id'] = correlationId;

    asyncLocalStorage.run({ correlationId }, () => {
        next();
    });
}