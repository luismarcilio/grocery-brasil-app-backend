import { Controller } from "../../../../src/presentation/express/controllers/Controller";
import { GetWebViewScrapDataController } from "../../../../src/presentation/express/controllers/GetWebViewScrapDataController";
import { GetWebViewScrapDataUseCase } from "../../../../src/features/Purchase/useCase/GetWebViewScrapDataUseCase";
import { HttpRequest, HttpResponse } from "../../../../src/core/HttpProtocol";
import { purchase } from "../../../features/Purchase/fixtures/purchases";
import { WebViewScrapData } from "../../../../src/features/Purchase/model/WebViewScrapData";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("GetWebViewScrapDataController", () => {
  const execute = jest.fn();
  const getWebViewScrapDataUseCase: GetWebViewScrapDataUseCase = ({
    execute,
  } as unknown) as GetWebViewScrapDataUseCase;

  const sut: Controller = new GetWebViewScrapDataController(
    getWebViewScrapDataUseCase
  );
  it("should return GetWebViewScrapData", async () => {
    const httpRequest: HttpRequest = {
      params: { url: "someUrl" },
      body: { user: purchase.user },
    };
    const result: WebViewScrapData = {
      initialUrl: "someUrl",
      uf: "MG",
      accessKey: "120371029847013",
      javascriptFunctions: "someJavaScript",
    };
    const expected: HttpResponse = {
      status: 200,
      body: result,
    };

    execute.mockResolvedValue(result);
    const actual = await sut.handle(httpRequest);
    expect(actual).toEqual(expected);
    expect(execute).toHaveBeenCalledWith(httpRequest.params.url);
  });

  it("should return 400 if it returns error NOT_FOUND", async () => {
    const exception = new PurchaseException({
      messageId: MessageIds.NOT_FOUND,
      message: "ErrorMessage",
    });
    const httpRequest: HttpRequest = {
      params: { url: "someUrl" },
      body: { user: purchase.user },
    };

    const expected: HttpResponse = {
      status: 400,
      body: exception.message,
    };
    execute.mockResolvedValue(exception);

    const actual = await sut.handle(httpRequest);
    expect(actual).toEqual(expected);
  });

  it("should return status 500 if some exception occurs", async () => {
    const exception = new PurchaseException({
      messageId: MessageIds.UNEXPECTED,
      message: "unexpected error",
    });
    const httpRequest: HttpRequest = {
      params: { url: "someUrl" },
      body: { user: purchase.user },
    };

    const expected: HttpResponse = {
      status: 500,
      body: exception.message,
    };
    execute.mockResolvedValue(exception);

    const actual = await sut.handle(httpRequest);
    expect(actual).toEqual(expected);
  });
});
