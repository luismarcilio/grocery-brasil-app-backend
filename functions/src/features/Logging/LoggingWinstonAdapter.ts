/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logging } from "./Logging";
import { Logger } from "winston";

export class LoggingWinstonAdapter implements Logging {
  private readonly winstonLogger: Logger;

  constructor(winstonLogger: Logger) {
    this.winstonLogger = winstonLogger;
  }

  debug(message: any): void {
    this.winstonLogger.debug(message);
  }
  info(message: any): void {
    this.winstonLogger.info(message);
  }
  error(message: any): void {
    this.winstonLogger.error(message);
  }
}
