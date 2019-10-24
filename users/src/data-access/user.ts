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

export default {
  get,
  update,
  addOrUpdate
};
