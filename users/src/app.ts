import express from "express";
import passport from "passport";
import "./config/database";
import middlewares from "./config/middlewares";
import {
  fromAuthHeaderAsBearerTokenToAccessTokenHeader,
  getAuthenticatedUser,
  isAuthenticated,
  requestTokenValidator
} from "./config/passport";
import { update } from "./controllers/user";

const app = express();

middlewares(app);

const router = express.Router();

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
router.put("/", update);

app.use("/users", router);

export default app;
