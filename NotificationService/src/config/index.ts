// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    REDIS_PORT?: number,
    REDIS_HOST?: string,
    MAILER_USER?: string,
    MAILER_PASS?: string,
}

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().optional().default("3004").transform(Number),
    REDIS_PORT: z.string().optional().default("6379").transform(Number),
    REDIS_HOST: z.string().optional().default("localhost"),
    MAILER_USER: z.string().min(1),
    MAILER_PASS: z.string().min(1),
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
    REDIS_PORT: env.REDIS_PORT,
    REDIS_HOST: env.REDIS_HOST,
    MAILER_USER: env.MAILER_USER,
    MAILER_PASS: env.MAILER_PASS,
};