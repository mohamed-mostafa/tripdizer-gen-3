import express from "express";
import passport from "passport";
import middlewares from "./config/middlewares";
import mongoose from "./config/mongoose";
import {
  fromAuthHeaderAsBearerTokenToAccessTokenHeader,
  getAuthenticatedUser,
  isAuthenticated,
  requestTokenValidator
} from "./config/passport";
import { updatePhone } from "./controllers/user";

const app = express();

mongoose();
middlewares(app);

var router = express.Router();

router.get(
  "/auth/google",
  fromAuthHeaderAsBearerTokenToAccessTokenHeader,
  passport.authenticate("google-token"),
  getAuthenticatedUser,
  requestTokenValidator
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook-token"),
  getAuthenticatedUser,
  requestTokenValidator
);

router.use(passport.authenticate("jwt", { session: false }));
router.use(isAuthenticated);

// Authenticated endpoints
router.get("/info", getAuthenticatedUser);
router.put("/phone", updatePhone);

app.use("/users", router);

export default app;
