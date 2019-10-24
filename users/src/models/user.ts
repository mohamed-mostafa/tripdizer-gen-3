import { AuthToken } from "./auth-token";
import { UserProfile } from "./user-profile";

export type User = {
  uuid?: string;
  email: string;

  profile: UserProfile;

  facebook?: string;
  google?: string;
  lastLoginProvider?: string;

  tokens: AuthToken[];
  token?: string;
};
