/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Failure } from './Failure'

export interface UseCase<T> {
  execute: (p: unknown) => Promise<T | Failure>
}
