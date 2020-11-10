/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logging {
  debug(message: any): void;
  info(message: any): void;
  error(message: any): void;
}
