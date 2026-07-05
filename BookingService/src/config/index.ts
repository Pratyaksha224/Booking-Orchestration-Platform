// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    REDIS_SERVER_URL: string,
    LOCK_TTL: number
}

type DatabaseConfig = {
    DATABASE_URL: string
}

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().optional().default("3001").transform(Number),
    REDIS_SERVER_URL: z.string().optional().default("redis://localhost:6379"),
    LOCK_TTL: z.string().optional().default("5000").transform(Number),
    DATABASE_URL: z.string().min(1)
});

function loadEnv() {
    dotenv.config();
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("Environment Validation Failed", parsed.error.format());
        process.exit(1);
    }
}

loadEnv();

const env = envSchema.parse(process.env);

export const serverConfig: ServerConfig = {
    PORT: env.PORT,
    REDIS_SERVER_URL: env.REDIS_SERVER_URL,
    LOCK_TTL: env.LOCK_TTL
};

export const databaseConfig: DatabaseConfig = {
    DATABASE_URL: env.DATABASE_URL
};
