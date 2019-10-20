import dotenv from "dotenv";
import fs from "fs";
import logger from "./logger";

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else if (fs.existsSync("../users/.env")) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: "../users/.env" });
} else if (fs.existsSync(".env.dev")) {
  logger.debug("Using .env.dev file to supply config environment variables");
  dotenv.config({ path: ".env.dev" });
} else if (fs.existsSync("../users/.env.dev")) {
  logger.debug("Using .env.dev file to supply config environment variables");
  dotenv.config({ path: "../users/.env.dev" });
} else {
  logger.debug("No config environment variables found");
  process.exit(1);
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const PROJECT_NAME = process.env.PROJECT_NAME;
export const KEY_FILE_NAME = process.env.KEY_FILE_NAME;

if (!MONGODB_URI) {
  logger.error(
    "No mongo connection string. Set MONGODB_URI environment variable."
  );
  process.exit(1);
}

if (!PROJECT_NAME || !KEY_FILE_NAME) {
  logger.error("Set Firestone config environment variable.");
  process.exit(1);
}
