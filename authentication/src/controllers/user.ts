import { Request, Response } from "express";
import { User } from "../models/user";

export const getUserInfo = (req: Request, res: Response) => {
  const user = req.user as User;
  res.json({
    ...user.profile,
    email: user.email,
    token: user.token,
    provider: user.lastLoginProvider
  });
};
