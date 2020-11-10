import { LoggerFactory } from "../../../src/features/Logging/LoggerFactory";
import { LoggerWinstonFactory } from "../../../src/features/Logging/LoggerWinstonFactory";
import * as winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

describe("LoggerWinstonFactory", () => {
  const createLogger: (
    options?: winston.LoggerOptions
  ) => winston.Logger = jest.fn();
  const gcpTransport: LoggingWinston = ({} as unknown) as LoggingWinston;
  const sut: LoggerFactory = new LoggerWinstonFactory(
    createLogger,
    gcpTransport
  );

  it("should set logging level based on LOGGING_LEVEL environment variable", () => {
    process.env.LOGGING_LEVEL = "expectedLoggingLevel";
    const expectedOptions: winston.LoggerOptions = {
      level: process.env.LOGGING_LEVEL,
      format: winston.format.json(),
      defaultMeta: { service: "user-service" },
      transports: [gcpTransport],
    };
    sut.getLogger();
    expect(createLogger).toHaveBeenCalledWith(expectedOptions);
  });

  it("should default logging level to DEBUG", () => {
    delete process.env.LOGGING_LEVEL;
    const expectedOptions: winston.LoggerOptions = {
      level: "debug",
      format: winston.format.json(),
      defaultMeta: { service: "user-service" },
      transports: [gcpTransport],
    };

    sut.getLogger();
    expect(createLogger).toHaveBeenCalledWith(expectedOptions);
  });
});
