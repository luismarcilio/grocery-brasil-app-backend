import { GetSecretUseCase } from "../../../../src/features/Secrets/useCase/GetSecretUseCase";
import { Controller } from "../../../../src/presentation/controllers/Controller";
import { GetSecretController } from "../../../../src/presentation/controllers/GetSecretController";
import { HttpRequest, HttpResponse } from "../../../../src/core/HttpProtocol";
import {
  SecretException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
describe("GetSecretController", () => {
  const execute = jest.fn();
  const getSecretUseCase: GetSecretUseCase = ({
    execute,
  } as unknown) as GetSecretUseCase;

  const sut: Controller = new GetSecretController(getSecretUseCase);

  it("should return the secret value", async () => {
    const secretName = "SOME_SECRET_NAME";
    const secretValue = "SOME_SECRET_VALUE";
    const httpRequest: HttpRequest = {
      params: { secret: secretName },
    };
    const expected: HttpResponse = {
      status: 200,
      body: { secretValue },
    };
    execute.mockResolvedValue(secretValue);
    const actual: HttpResponse = await sut.handle(httpRequest);
    expect(actual).toEqual(expected);
    expect(execute).toHaveBeenCalledWith(secretName);
  });
  it("should return 404 if the scret is not found", async () => {
    const exception = new SecretException({
      messageId: MessageIds.NOT_FOUND,
      message: "ErrorMessage",
    });

    const secretName = "SOME_SECRET_NAME";
    const httpRequest: HttpRequest = {
      params: { secret: secretName },
    };
    const expected: HttpResponse = {
      status: 404,
      body: exception.message,
    };
    execute.mockResolvedValue(exception);
    const actual: HttpResponse = await sut.handle(httpRequest);
    expect(actual).toEqual(expected);
  });

  it("should return 500 if an exception occurs", async () => {

    const exception = new SecretException({
      messageId: MessageIds.UNEXPECTED,
      message: "ErrorMessage",
    });

    const secretName = "SOME_SECRET_NAME";
    const httpRequest: HttpRequest = {
      params: { secret: secretName },
    };
    const expected: HttpResponse = {
      status: 500,
      body: exception.message,
    };
    execute.mockResolvedValue(exception);
    const actual: HttpResponse = await sut.handle(httpRequest);
    expect(actual).toEqual(expected);



  });
});
