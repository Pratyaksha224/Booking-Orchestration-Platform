import Redis from "ioredis";

import { serverConfig } from "./index";

export function connectToRedis() {
    try {

        let connection: Redis;
        const redisConfig = {
            port: serverConfig.REDIS_PORT,
            host: serverConfig.REDIS_HOST,
            maxRetriesPerRequest: null
        }

        return () => {
            if(!connection) {
                connection = new Redis(redisConfig);
            }
            return connection;
        }

    } catch (error) {
        console.error("Error connecting to Redis:", error);
        throw error;
    }
}

export const getRedisConnObject = connectToRedis();