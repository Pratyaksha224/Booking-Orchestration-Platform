import express from 'express';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import { attachCorrelationMiddleware } from './middlewares/correlation.middleware';
import { genericErrorHandler } from './middlewares/error.middleware';
import { serverConfig } from './config';

import apiRouter from './routers';
import logger from './config/logger.config';
import pingRouter from './routers/v1/ping.router';

const app: Express = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Attach correlationId to all requests (reads incoming x-correlation-id or generates a new one)
app.use(attachCorrelationMiddleware);

// Registering all the routers
app.use('/ping', pingRouter);
app.use('/api', apiRouter);

// Swagger Documentation
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Service is healthy",
        data: {
            service: "UserService",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }
    });
});

// Error handling middleware (must be last)
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
    logger.info(`UserService running on port ${serverConfig.PORT}`);
    logger.info("Press Ctrl+C to stop the server");
});