import { Request, Response } from "express";
import { default as UserDao } from "../data-access/temp-user";
import { TempUser } from "../models/temp-user";

export const updatePhone = (req: Request, res: Response) => {
  const user = req.user as TempUser;
  UserDao.update(user.uuid, { "profile.phone": req.body.phone }, (err, raw) => {
    if (err) {
      res.sendStatus(500).json(err);
    }
    res.json(raw);
  });
};
