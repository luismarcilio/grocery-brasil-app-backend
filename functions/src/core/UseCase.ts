/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Failure } from './Failure'

export interface UseCase<T> {
  execute: (p: Param) => Promise<T|Failure>
}

class Param {}
