import { User } from "../../../model/User";

export interface UserDataStore {
  getUserIdFromJWT: (jwt: string) => Promise<string>;
  getUserFromUserId: (userId: string) => Promise<User>;
}
