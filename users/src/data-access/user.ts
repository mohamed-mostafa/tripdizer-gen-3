import { Profile as FacebookProfile } from "passport-facebook-token";
import { Profile as GoogleProfile } from "passport-google-token";
import { db } from "../config/database";
import { ErrorResponse, SuccessResponse } from "../models/response";
import { User } from "../models/user";
import uuid = require("uuid");

const users = db.collection("users");

const get = (email: string): Promise<SuccessResponse<User> | ErrorResponse> =>
  users
    .doc(email)
    .get()
    .then((doc: any) => {
      if (!doc.exists) {
        return new SuccessResponse(null);
      } else {
        return new SuccessResponse<User>(doc.data());
      }
    })
    .catch(err => new ErrorResponse(`Error on getting user "${email}"`));

const addOrUpdate = (
  user: User
): Promise<SuccessResponse<User> | ErrorResponse> =>
  users
    .doc(user.email)
    .set(user)
    .then(() => new SuccessResponse<User>(user))
    .catch(
      () => new ErrorResponse(`Error on adding or updating user "${user.email}`)
    );

const update = (
  email: string,
  user: User
): Promise<SuccessResponse<User> | ErrorResponse> =>
  users
    .doc(email)
    .set({ profile: user }, { merge: true })
    .then(() => new SuccessResponse<User>(user))
    .catch(() => new ErrorResponse(`Error on updating user "${user.email}`));

const addOrUpdateFromGoogle = (
  profile: GoogleProfile,
  accessToken: string
): Promise<SuccessResponse<User> | ErrorResponse> => {
  const user: User = {
    email: profile._json.email,
    google: profile.id,
    tokens: [{ provider: "google", accessToken }],
    profile: {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture: profile._json.picture
    },
    lastLoginProvider: "google"
  };
  return get(user.email).then((res: SuccessResponse<User> | ErrorResponse) => {
    if (!res.success) return res;

    const existingUser = (res as SuccessResponse<User>).data || {
      uuid: uuid(),
      tokens: [] as any[]
    };
    const newUser: User = { ...existingUser, ...user };

    newUser.tokens = existingUser.tokens
      .filter(t => !newUser.tokens.some(ut => ut.provider === t.provider))
      .concat(newUser.tokens);
    return addOrUpdate(newUser).then(
      (res: SuccessResponse<User> | ErrorResponse) => {
        if (!res.success) return res;

        return new SuccessResponse<User>(newUser);
      }
    );
  });
};

const addOrUpdateFromFacebook = (
  profile: FacebookProfile,
  accessToken: string
): Promise<SuccessResponse<User> | ErrorResponse> => {
  const user: User = {
    email: profile._json.email,
    facebook: profile.id,
    tokens: [{ provider: "facebook", accessToken }],
    profile: {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture: `https://graph.facebook.com/${profile.id}/picture?type=large`
    },
    lastLoginProvider: "facebook"
  };
  return get(user.email).then((res: SuccessResponse<User> | ErrorResponse) => {
    if (!res.success) return res;

    const existingUser = (res as SuccessResponse<User>).data || {
      uuid: uuid(),
      tokens: [] as any[]
    };
    const newUser: User = { ...existingUser, ...user };

    newUser.tokens = existingUser.tokens
      .filter(t => !newUser.tokens.some(ut => ut.provider === t.provider))
      .concat(newUser.tokens);
    return addOrUpdate(newUser).then(
      (res: SuccessResponse<User> | ErrorResponse) => {
        if (!res.success) return res;

        return new SuccessResponse<User>(newUser);
      }
    );
  });
};

export default {
  get,
  update,
  addOrUpdateFromGoogle,
  addOrUpdateFromFacebook
};
