import { Logging } from "../../../src/features/Logging/Logging";
import { LoggingWinstonAdapter } from "../../../src/features/Logging/LoggingWinstonAdapter";
import { Logger } from "winston";

describe("LoggingWinstonAdapter", () => {
  const info = jest.fn();
  const error = jest.fn();
  const debug = jest.fn();
  const winstonLogger: Logger = ({ info, error, debug } as unknown) as Logger;
  const sut: Logging = new LoggingWinstonAdapter(winstonLogger);
  const message = { someProperty: "someValue" };

  it("should debug", () => {
    sut.debug(message);
    expect(debug).toHaveBeenCalledWith(message);
  });

  it("should info", () => {
    sut.info(message);
    expect(info).toHaveBeenCalledWith(message);
  });

  it("should error", () => {
    sut.error(message);
    expect(error).toHaveBeenCalledWith(message);
  });
});
