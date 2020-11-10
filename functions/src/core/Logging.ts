/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

import { LoggerWinstonFactory } from "../features/Logging/LoggerWinstonFactory";
import { Logging } from "../features/Logging/Logging";

//Log
export const logger: Logging = new LoggerWinstonFactory(
  winston.createLogger,
  new LoggingWinston()
).getLogger();

export enum loggerLevel {
  DEBUG,
  INFO,
  ERROR,
}

export function withLog(level: loggerLevel) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const targetMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const logData = {
        method: propertyKey,
        args,
      };
      switch (level) {
        case loggerLevel.DEBUG:
          logger.debug(logData);
          break;
        case loggerLevel.INFO:
          logger.info(logData);
          break;
        case loggerLevel.ERROR:
          logger.error(logData);
          break;
      }
      return targetMethod.apply(this, args);
    };
  };
}
