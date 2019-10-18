import express from "express";
import passport from "passport";
import middlewares from "./config/middlewares";
import mongoose from "./config/mongoose";
import { isAuthenticated, requestTokenValidator } from "./config/passport";
import * as userCtrl from "./controllers/user";

const app = express();

mongoose();
middlewares(app);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook-token"),
  userCtrl.getUserInfo,
  requestTokenValidator
);

app.use(passport.authenticate("jwt", { session: false }));
app.use(isAuthenticated);

app.get("/auth", userCtrl.getUserInfo);

export default app;
