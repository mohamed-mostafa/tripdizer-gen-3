import uuid from "uuid";
import { default as UserDao } from "../data-access/user";
import { ErrorResponse, SuccessResponse } from "../models/response";
import { User } from "../models/user";

const addOrUpdateFromSocial = (
  user: User
): Promise<SuccessResponse<User> | ErrorResponse> => {
  return UserDao.get(user.email).then(
    (res: SuccessResponse<User> | ErrorResponse) => {
      if (!res.success) return res;

      const existingUser = (res as SuccessResponse<User>).data || {
        uuid: uuid(),
        tokens: [] as any[]
      };
      const newUser: User = { ...existingUser, ...user };

      newUser.tokens = existingUser.tokens
        .filter(t => !newUser.tokens.some(ut => ut.provider === t.provider))
        .concat(newUser.tokens);
      return UserDao.addOrUpdate(newUser).then(
        (res: SuccessResponse<User> | ErrorResponse) => {
          if (!res.success) return res;

          return new SuccessResponse<User>(newUser);
        }
      );
    }
  );
};

export default {
  get: UserDao.get,
  addOrUpdateFromSocial
};
