import uuid from "uuid";
import { default as UserDao } from "../data-access/user";
import { ErrorResponse, SuccessResponse } from "../models/response";
import { User } from "../models/user";

const addOrUpdateFromSocial = (
  newUser: User
): Promise<SuccessResponse<User> | ErrorResponse> => {
  return UserDao.get(newUser.email).then(
    (res: SuccessResponse<User> | ErrorResponse) => {
      if (!res.success) return res;
      let user: User = (res as SuccessResponse<User>).data;

      if (res.success && user) {
        const tempUser = { ...user, ...newUser };
        tempUser.profile = { ...user.profile, ...newUser.profile };
        tempUser.tokens = user.tokens
          .filter(t => !newUser.tokens.some(ut => ut.provider === t.provider))
          .concat(newUser.tokens);

        user = tempUser;
      } else {
        user = { uuid: uuid(), ...newUser };
      }

      return UserDao.addOrUpdate(user).then(
        (res: SuccessResponse<User> | ErrorResponse) => {
          if (!res.success) return res;

          return new SuccessResponse<User>((res as SuccessResponse<User>).data);
        }
      );
    }
  );
};

export default {
  get: UserDao.get,
  addOrUpdateFromSocial
};
