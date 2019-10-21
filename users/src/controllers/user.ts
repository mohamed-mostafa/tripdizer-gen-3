import { Request, Response } from "express";
import { default as UserDao } from "../data-access/user";
import { User } from "../models/user";

export const updatePhone = (req: Request, res: Response) => {
  const user = req.user as User;
  UserDao.update(user.uuid, { "profile.phone": req.body.phone }, (err, raw) => {
    if (err) {
      res.sendStatus(500).json(err);
    }
    res.json(raw);
  });
};
