/* eslint-disable no-unused-vars */
import { User } from '../../../model/User';
import { Failure } from '../../../core/Failure';

export interface UserRepository {
  createuser: (user: User) => Promise<User | Failure>
}
