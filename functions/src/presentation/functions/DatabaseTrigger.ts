export interface DatabaseTrigger<T> {
  call: (input: T) => Promise<T | null>;
}
