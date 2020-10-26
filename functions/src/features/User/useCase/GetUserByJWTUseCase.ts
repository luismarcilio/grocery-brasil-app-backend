/* eslint-disable @typescript-eslint/return-await */
import { UseCase } from "../../../core/UseCase";
import { User } from "../../../model/User";
import { UserRepository } from "../repository/UserRepository";
import { UserException } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class GetUserByJWTUseCase implements UseCase<User> {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  execute = async (jwt: string): Promise<User | UserException> => {
    try {
      return this.repository.validateJWT(jwt);
    } catch (error) {
      return errorToApplicationException(error, UserException);
    }
  };
}
