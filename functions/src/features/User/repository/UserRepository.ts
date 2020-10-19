/* eslint-disable no-unused-vars */
import { User } from '../../../model/User';
import { Failure } from '../../../core/Failure';

export interface UserRepository {
  createUser: (user: User) => Promise<User | Failure>
  updateUser: (user: User) => Promise<User| Failure > 
}
