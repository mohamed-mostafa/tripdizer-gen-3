import dotenv from "dotenv";
import fs from "fs";
import logger from "./logger";
import "./tripdizer-service-account-key.json";
import "./tripdizer-service-account.json";

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
export const PROJECT_NAME = process.env.PROJECT_NAME;
export const FIRESTORE_CREDENTIALS =
  ENVIRONMENT === "production"
    ? require("./tripdizer-service-account-key.json")
    : require("./tripdizer-service-account.json");

if (!PROJECT_NAME || !FIRESTORE_CREDENTIALS) {
  logger.error("Set Firestone config environment variable.");
  process.exit(1);
}
