import { db } from "../config/database";
import { ErrorResponse, SuccessResponse } from "../models/response";
import { User } from "../models/user";

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
    .catch(e => new ErrorResponse(`Error on getting user "${email}"`, e));

const addOrUpdate = (
  user: User
): Promise<SuccessResponse<User> | ErrorResponse> =>
  users
    .doc(user.email)
    .set(user)
    .then(() => new SuccessResponse<User>(user))
    .catch(
      e =>
        new ErrorResponse(`Error on adding or updating user "${user.email}`, e)
    );

const update = (
  email: string,
  user: User
): Promise<SuccessResponse<User> | ErrorResponse> =>
  users
    .doc(email)
    .set({ profile: user }, { merge: true })
    .then(() => new SuccessResponse<User>(user))
    .catch(e => new ErrorResponse(`Error on updating user "${user.email}`, e));

export default {
  get,
  update,
  addOrUpdate
};
