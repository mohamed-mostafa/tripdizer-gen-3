import mongoose from "mongoose";
import { AuthToken } from "./auth-token";

export type TempUser = mongoose.Document & {
  uuid: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;

  facebook: string;
  twitter: string;
  google: string;
  tokens: AuthToken[];

  profile: {
    firstName: string;
    lastName: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
    phone: string;
  };

  lastLoginProvider?: string;
  token?: string;

  gravatar: (size: number) => string;
};
