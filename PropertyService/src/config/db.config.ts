import { dbConfig } from "./index";
import dotenv from 'dotenv'

dotenv.config();

const config = {
  development: {
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    dialect: "mysql"
  }
}

module.exports = config;
