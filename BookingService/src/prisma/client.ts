import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { databaseConfig } from "../config";

const adapter = new PrismaMariaDb(databaseConfig.DATABASE_URL);
const prismaClient = new PrismaClient({ adapter });
export default prismaClient;
