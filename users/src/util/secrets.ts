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
  logger.debug("No config environment variables found. Default OS-provided environment variables apply");
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const JWT_SECRET = process.env.JWT_SECRET;
export const LOGGING_CRED = process.env.LOGGING_CRED;
export const GOOGLE_CRED = {
  id: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_CLIENT_SECRET
};
export const FACEBOOK_CRED = {
  id: process.env.FACEBOOK_ID,
  secret: process.env.FACEBOOK_SECRET
};

// this file is different on every environment, but has the same name
export const FIRESTORE_CREDENTIALS = require("./tripdizer-service-account.json");

if (!FIRESTORE_CREDENTIALS || !FIRESTORE_CREDENTIALS.project_id) {
  logger.error("Set Firestore config environment variable.");
  process.exit(1);
}
