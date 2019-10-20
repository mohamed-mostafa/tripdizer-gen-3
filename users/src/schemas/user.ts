import crypto from "crypto";
import mongoose from "mongoose";
import uuid from "uuid/v4";
import { TempUser as UserModel } from "../models/temp-user";

const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, unique: true, default: uuid() },
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
      firstName: String,
      lastName: String,
      gender: String,
      location: String,
      website: String,
      picture: String,
      phone: { type: String, default: "" }
    },

    lastLoginProvider: String
  },
  { timestamps: true }
);

userSchema.methods.gravatar = function(size: number = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto
    .createHash("md5")
    .update(this.email)
    .digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserModel>("User", userSchema);
