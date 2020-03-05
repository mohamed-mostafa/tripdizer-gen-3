import { AuthToken } from "./auth-token";
import { UserProfile } from "./user-profile";

export type User = {
  uuid?: string;
  email: string;

  profile: UserProfile;

  facebook?: string;
  google?: string;
  lastLoginProvider?: string;
  birthday?: Date;
  phone?: string;
  location?: string;
  tokens: AuthToken[];
  token?: string;
};
