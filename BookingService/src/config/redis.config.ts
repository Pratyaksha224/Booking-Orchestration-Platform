import IORedis, { Redis } from "ioredis";
import Redlock from "redlock";

import { serverConfig } from ".";
import logger from "../config/logger.config";

export function connectToRedis() {
    let connection: Redis;
    return () => {
        if (!connection) {
            connection = new IORedis(serverConfig.REDIS_SERVER_URL, {
                maxRetriesPerRequest: null
            });
            connection.on('connect', () => logger.info("Connected to Redis"));
            connection.on('error', (err) => logger.error("Redis connection error", { error: err.message }));
        }
        return connection;
    }
}

export const getRedisConnObject = connectToRedis();

export const redLock = new Redlock([getRedisConnObject()], {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200,
    retryJitter: 200,
});