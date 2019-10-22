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
import { default as TempUserDao } from "../data-access/temp-user";
import { default as UserDao } from "../data-access/user";
import { TempUser } from "../models/temp-user";
import { User } from "../models/user";
import { UserClaims } from "../models/user-claims";
import { JWT_SECRET } from "../util/secrets";
import { SuccessResponse, ErrorResponse } from "../models/response";

const GoogleTokenStrategy = passportGoogleToken.Strategy;
const FacebookTokenStrategy = passportFacebookToken;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export const encodeToken = (user: User) =>
  jwt.sign({ ...new UserClaims(user) }, JWT_SECRET, { expiresIn: "30d" });

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.email);
});

passport.deserializeUser((email: string, done) => {
  UserDao.get(email)
    .then((user: any) => {
      done(null, user);
    })
    .catch((err: any) => {
      done(err, null);
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
      TempUserDao.addOrUpdateFromGoogle(
        profile,
        accessToken,
        (err: any, user: TempUser) => {
          if (err) {
            return done(err);
          }
          user.token = encodeToken(user);
          done(err, user);
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
      UserDao.addOrUpdateFromFacebook(profile, accessToken).then(
        (res: SuccessResponse<User> | ErrorResponse) => {
          if (res.success) {
            const user = (res as SuccessResponse<User>).data;
            user.token = encodeToken(user);
            done(null, user);
          } else {
            done(res, null);
          }
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
    UserDao.get(jwtPayload.email)
      .then((user: any) => {
        done(null, user);
      })
      .catch((err: any) => {
        done(err, null);
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
  if (req.user && (req.user as TempUser).uuid) next();
  else res.sendStatus(401);
};
