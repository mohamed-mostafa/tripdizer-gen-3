import { Profile as FacebookProfile } from "passport-facebook-token";
import { Profile as GoogleProfile } from "passport-google-token";
import { TempUser } from "../models/temp-user";
import { User as userSchema } from "../schemas/user";

const findByUUID = (
  uuid: string,
  callback: (err: any, res: TempUser) => void
) => {
  userSchema.findOne({ uuid }, callback);
};

const findByEmail = (
  email: string,
  callback: (err: any, res: TempUser) => void
) => {
  userSchema.findOne({ email }, callback);
};

const addOrUpdateFromGoogle = (
  profile: GoogleProfile,
  accessToken: string,
  callback: any
) => {
  findByEmail(profile._json.email, (err, existingUser) => {
    if (err) {
      callback(err);
    }
    let user: TempUser = new userSchema();
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
      callback(err, user);
    });
  });
};

const addOrUpdateFromFacebook = (
  profile: FacebookProfile,
  accessToken: string,
  callback: any
) => {
  findByEmail(profile._json.email, (err, existingUser) => {
    if (err) {
      callback(err);
    }
    let user: TempUser = new userSchema();
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
      callback(err, user);
    });
  });
};

const update = (
  uuid: string,
  data: object,
  callback: (err: any, raw: any) => void
) => {
  userSchema.updateOne({ uuid }, data, callback);
};

export default {
  findByUUID,
  findByEmail,
  addOrUpdateFromGoogle,
  addOrUpdateFromFacebook,
  update
};
