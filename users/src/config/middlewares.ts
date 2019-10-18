import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Express } from "express";
import lusca from "lusca";
import passport from "passport";

export default (app: Express) => {
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(lusca.xframe("SAMEORIGIN"));
  app.use(lusca.xssProtection(true));
};
