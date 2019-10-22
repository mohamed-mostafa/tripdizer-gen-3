import { Profile as FacebookProfile } from "passport-facebook-token";
import { db } from "../config/database";
import { User } from "../models/user";
import uuid = require("uuid");
import { SuccessResponse, ErrorResponse } from "../models/response";

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

    const u = (res as SuccessResponse<User>).data;
    const existingUser: User = { ...(u || { uuid: uuid() }), ...user };

    existingUser.tokens = u.tokens
      .filter(t => !existingUser.tokens.some(ut => ut.provider === t.provider))
      .concat(existingUser.tokens);
    return addOrUpdate(existingUser).then(
      (res: SuccessResponse<User> | ErrorResponse) => {
        if (!res.success) return res;

        return new SuccessResponse<User>(existingUser);
      }
    );
  });
};

export default {
  get,
  addOrUpdateFromFacebook
};
