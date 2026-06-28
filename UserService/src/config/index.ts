// Contains all the Basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    JWT_SECRET: string,
    JWT_EXPIRY: string,
    BCRYPT_SALT_ROUNDS: number
}

type DBConfig = {
    DB_HOST: string,
    DB_USER: string,
    DB_PASSWORD: string,
    DB_NAME: string
}

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().optional().default("3000").transform(Number),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRY: z.string().optional().default("24h"),
    BCRYPT_SALT_ROUNDS: z.string().optional().default("10").transform(Number),
    DB_HOST: z.string().optional().default("localhost"),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_NAME: z.string().min(1)
});

export function loadEnv() {
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
    JWT_SECRET: env.JWT_SECRET,
    JWT_EXPIRY: env.JWT_EXPIRY,
    BCRYPT_SALT_ROUNDS: env.BCRYPT_SALT_ROUNDS
}

export const dbConfig: DBConfig = {
    DB_HOST: env.DB_HOST,
    DB_USER: env.DB_USER,
    DB_PASSWORD: env.DB_PASSWORD,
    DB_NAME: env.DB_NAME
}