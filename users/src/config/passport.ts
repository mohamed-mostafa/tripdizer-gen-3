import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import passportFacebookToken, {
  Profile as FacebookProfile
} from "passport-facebook-token";
import passportGoogleToken, {
  Profile as GoogleProfile
} from "passport-google-token";
import passportJwt, { StrategyOptions } from "passport-jwt";
import { User } from "../models/user";
import { UserClaims } from "../models/user-claims";
import { User as userSchema } from "../schemas/user";
import { JWT_SECRET } from "../util/secrets";

const GoogleTokenStrategy = passportGoogleToken.Strategy;
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
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: any
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
          user.google = profile.id;
          user.tokens = user.tokens.filter(t => t.provider !== "google");
          user.tokens.push({ provider: "google", accessToken });
          user.profile.firstName = profile.name.givenName;
          user.profile.lastName = profile.name.familyName;
          user.profile.picture = profile._json.picture;
          user.lastLoginProvider = "google";
          user.save((err: Error) => {
            user.token = encodeToken(user);
            done(err, user);
          });
        }
      );
    }
  )
);

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

export const getAuthenticatedUser = (req: Request, res: Response) => {
  const user = req.user as User;
  res.json({
    ...user.profile,
    email: user.email,
    token: user.token,
    provider: user.lastLoginProvider
  });
};

export const fromAuthHeaderAsBearerTokenToAccessTokenHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const OAuth2AuthorizationField = "Authorization";
  req.headers = req.headers || {};
  const hdrValue = (
    req.headers[OAuth2AuthorizationField] ||
    req.headers[OAuth2AuthorizationField.toLowerCase()]
  ).toString();

  const matches = hdrValue.match(/Bearer\s+(\S+)/);

  req.headers["access_token"] = matches && matches[1];
  next();
};

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
