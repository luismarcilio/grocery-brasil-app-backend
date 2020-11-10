import { UserRepository } from "../repository/UserRepository";
import { User } from "../../../model/User";
import { UserException } from "../../../core/ApplicationException";
import { UserDataStore } from "./UserDataStore";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class UserRepositoryImpl implements UserRepository {
  private readonly userDataStore: UserDataStore;

  constructor(userDataStore: UserDataStore) {
    this.userDataStore = userDataStore;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUser(user: User): Promise<User | UserException> {
    throw new Error("Unimplemented");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateUser(user: User): Promise<User | UserException> {
    throw new Error("Unimplemented");
  }

  @withLog(loggerLevel.DEBUG)
  async validateJWT(jwt: string): Promise<User | UserException> {
    try {
      const userId = await this.userDataStore.getUserIdFromJWT(jwt);
      const user = await this.userDataStore.getUserFromUserId(userId);
      return user;
    } catch (error) {
      return errorToApplicationException(error, UserException);
    }
  }
}
