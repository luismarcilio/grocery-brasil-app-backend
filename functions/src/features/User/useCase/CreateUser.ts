/* eslint-disable @typescript-eslint/return-await */
import { UseCase } from "../../../core/UseCase";
import { User } from "../../../model/User";
import { UserRepository } from "../repository/UserRepository";
import { UserException } from "../../../core/ApplicationException";
import { withLog, loggerLevel } from "../../../core/Logging";

export class CreateUser implements UseCase<User> {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(user: User): Promise<User | UserException> {
    return this.repository.createUser(user);
  }
}
