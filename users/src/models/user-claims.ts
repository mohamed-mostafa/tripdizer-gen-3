import { TempUser } from "./temp-user";

export class UserClaims {
  uuid: string;
  email: string;
  google: string;
  facebook: string;
  twitter: string;

  constructor(user: TempUser) {
    this.uuid = user.uuid;
    this.email = user.email;
    this.google = user.google;
    this.facebook = user.facebook;
    this.twitter = user.twitter;
  }
}
