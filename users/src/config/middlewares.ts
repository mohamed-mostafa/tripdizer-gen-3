import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Express } from "express";
import fs from "fs";
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

  app.get("/users/log", (req, res) => {
    if (req.headers.authorization) {
      const cred = Buffer.from(
        req.headers.authorization.split(" ")[1],
        "base64"
      ).toString();
      if (cred === "logUser:P@ssw0rd") {
        fs.readFile("debug.log", (err, data) => {
          if (err) res.send(err);
          else res.send(data);
        });
      } else {
        res.sendStatus(401);
      }
    }
  });
};
