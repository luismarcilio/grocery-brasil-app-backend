import { Failure } from './Failure'

export interface UseCase<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (p: any) => Promise<T | Failure>
}
