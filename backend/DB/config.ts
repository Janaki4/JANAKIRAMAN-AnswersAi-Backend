import dotenv, { config } from "dotenv";
import { Sequelize, Options } from "sequelize"

config()
const sequelize = new Sequelize(
  "ai" || process.env.DB_DATABASE_NAME,
  "postgres" || process.env.DB_USERNAME,
  "020300" || process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres",
  logging: false,
  pool: {
    max: +(process.env.DB_POOL_MAX || 5),
    min: +(process.env.DB_POOL_MIN || 0),
    acquire: +(process.env.DB_POOL_ACQUIRE || 30000),
    idle: +(process.env.DB_POOL_IDLE || 10000)
  }
});

export default sequelize

