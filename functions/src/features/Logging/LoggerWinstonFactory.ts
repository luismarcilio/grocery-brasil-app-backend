import { LoggerFactory } from "./LoggerFactory";
import { Logging } from "./Logging";
import { LoggingWinston } from "@google-cloud/logging-winston";
import * as winston from "winston";
import { LoggingWinstonAdapter } from "./LoggingWinstonAdapter";

export class LoggerWinstonFactory implements LoggerFactory {
  private readonly createLogger: (
    options?: winston.LoggerOptions
  ) => winston.Logger;
  private readonly gcpTransport: LoggingWinston;

  constructor(
    createLogger: (options?: winston.LoggerOptions) => winston.Logger,
    gcpTransport: LoggingWinston
  ) {
    this.createLogger = createLogger;
    this.gcpTransport = gcpTransport;
  }

  getLogger(): Logging {
    const options: winston.LoggerOptions = {
      level: !process.env.LOGGING_LEVEL ? "debug" : process.env.LOGGING_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports:
        process.env.NODE_ENV === "test"
          ? [new winston.transports.Console()]
          : [new winston.transports.Console(), this.gcpTransport],
    };
    const winstonLogger = this.createLogger(options);
    return new LoggingWinstonAdapter(winstonLogger);
  }
}
