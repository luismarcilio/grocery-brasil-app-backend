/* eslint-disable @typescript-eslint/return-await */
import { UseCase } from '../../../core/UseCase'
import { User } from '../../../model/User'
import { Failure } from '../../../core/Failure'
import { UserRepository } from '../repository/UserRepository'

export class CreateUser implements UseCase<User> {
  repository: UserRepository

  constructor (repository: UserRepository) {
    this.repository = repository
  }

  execute =  async (user: User): Promise<User|Failure> => {
    return this.repository.createuser(user)
  }
}
