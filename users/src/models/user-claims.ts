import { User } from "./user";

export class UserClaims {
  uuid: string;
  email: string;
  google: string;
  facebook: string;

  constructor(user: User) {
    this.uuid = user.uuid;
    this.email = user.email;
    this.google = user.google;
    this.facebook = user.facebook;
  }
}
