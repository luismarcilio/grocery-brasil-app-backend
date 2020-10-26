/* eslint-disable no-unused-vars */
import { User } from "../../../model/User";
import { UserException } from "../../../core/ApplicationException";

export interface UserRepository {
  createUser: (user: User) => Promise<User | UserException>;
  updateUser: (user: User) => Promise<User | UserException>;
  validateJWT: (jwt: string) => Promise<User | UserException>;
}
