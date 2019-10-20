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

app.get(
  "/auth/google",
  fromAuthHeaderAsBearerTokenToAccessTokenHeader,
  passport.authenticate("google-token"),
  getAuthenticatedUser,
  requestTokenValidator
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook-token"),
  getAuthenticatedUser,
  requestTokenValidator
);

app.use(passport.authenticate("jwt", { session: false }));
app.use(isAuthenticated);

app.get("/info", getAuthenticatedUser);
app.put("/phone", updatePhone);

export default app;
