import express from "express";
import passport from "passport";
import middlewares from "./config/middlewares";
import mongoose from "./config/mongoose";
import { isAuthenticated, requestTokenValidator } from "./config/passport";
import * as userCtrl from "./controllers/user";

const app = express();

mongoose();
middlewares(app);

app.get("/", isAuthenticated, userCtrl.getUserInfo);

app.head("/validate-token", isAuthenticated, (req: any, res: any) =>
  res.sendStatus(200)
);

app.get(
  "/auth/facebook/token",
  passport.authenticate("facebook-token"),
  userCtrl.getUserInfo,
  requestTokenValidator
);

export default app;
