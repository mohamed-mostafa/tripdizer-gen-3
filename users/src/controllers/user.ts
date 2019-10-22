import { Request, Response } from "express";
import { default as UserDao } from "../data-access/user";
import { ErrorResponse, SuccessResponse } from "../models/response";
import { User } from "../models/user";

export const update = (req: Request, res: Response) => {
  const user = req.user as User;
  UserDao.update(user.email, req.body).then(
    (resp: SuccessResponse<User> | ErrorResponse) => {
      if (!resp.success) res.sendStatus(500).json(resp);
      res.json(resp);
    }
  );
};
