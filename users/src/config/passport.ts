import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import passportFacebookToken, {
  Profile as FacebookProfile
} from "passport-facebook-token";
import passportJwt, { StrategyOptions } from "passport-jwt";
import { User } from "../models/user";
import { UserClaims } from "../models/user-claims";
import { User as userSchema } from "../schemas/user";
import { JWT_SECRET } from "../util/secrets";

const FacebookTokenStrategy = passportFacebookToken;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export const encodeToken = (user: User) =>
  jwt.sign({ ...new UserClaims(user) }, JWT_SECRET, { expiresIn: "30d" });

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.uuid);
});

passport.deserializeUser((uuid, done) => {
  userSchema.findOne({ uuid: uuid }, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: FacebookProfile,
      done
    ) => {
      userSchema.findOne(
        { email: profile._json.email },
        (err, existingUser) => {
          if (err) {
            return done(err);
          }
          let user: User = new userSchema();
          if (existingUser) {
            user = existingUser;
          }
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens = user.tokens.filter(t => t.provider !== "facebook");
          user.tokens.push({ provider: "facebook", accessToken });
          user.profile.firstName = profile.name.givenName;
          user.profile.lastName = profile.name.familyName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.profile.location = profile._json.location
            ? profile._json.location.name
            : "";
          user.lastLoginProvider = "facebook";
          user.save((err: Error) => {
            user.token = encodeToken(user);
            done(err, user);
          });
        }
      );
    }
  )
);

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  ignoreExpiration: true
};
passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    userSchema.findOne({ uuid: jwtPayload.uuid }, (err, user) => {
      done(err, user);
    });
  })
);

export const requestTokenValidator = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error) res.sendStatus(401);
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && (req.user as User).uuid) next();
  else res.sendStatus(401);
};
