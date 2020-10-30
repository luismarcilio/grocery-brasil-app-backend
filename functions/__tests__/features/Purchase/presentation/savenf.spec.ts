import { UseCase } from "../../../../src/core/UseCase";
import { Purchase } from "../../../../src/model/Purchase";
import { HttpRequest, HttpResponse } from "../../../../src/core/HttpProtocol";
import { purchase } from "../fixtures/purchases";
import {
  MessageIds,
  ScrapNfException,
} from "../../../../src/core/ApplicationException";
import { SaveNf } from "../../../../src/features/Purchase/presentation/SaveNf";
import { Controller } from "../../../../src/presentation/express/controllers/Controller";
describe("saveNf", () => {
  const scrapNFUseCaseExecute = jest.fn();
  const savePurchaseExecute = jest.fn();
  const scrapNFUseCase: UseCase<Purchase> = {
    execute: scrapNFUseCaseExecute,
  };
  const savePurchaseUseCase: UseCase<boolean> = {
    execute: savePurchaseExecute,
  };
  const sut: Controller = new SaveNf(scrapNFUseCase, savePurchaseUseCase);
  it("should parse and save the NF", async () => {
    jest.clearAllMocks();
    const request: HttpRequest = {
      body: { html: "html", uf: "MG" },
    };
    const scrapNFSpy = jest
      .spyOn(scrapNFUseCase, "execute")
      .mockResolvedValue(purchase);
    const savePurchaseSpy = jest
      .spyOn(savePurchaseUseCase, "execute")
      .mockResolvedValue(true);
    const response: HttpResponse = await sut.handle(request);
    expect(response).toEqual({ status: 200, body: { status: "OK" } });
    expect(scrapNFSpy).toBeCalledWith(request.body);
    expect(savePurchaseSpy).toBeCalledWith(purchase);
  });
  it("should return 400 if body is invalid", async () => {
    jest.clearAllMocks();
    const request: HttpRequest = {
      body: { html: "", uf: "" },
    };
    const response: HttpResponse = await sut.handle(request);
    expect(response).toEqual({
      status: 400,
      body: { status: "Invalid request" },
    });
  });
  it("should return status 400 in case of failure", async () => {
    jest.clearAllMocks();
    const request: HttpRequest = {
      body: { html: "html", uf: "MG" },
    };
    const scrapNFSpy = jest.spyOn(scrapNFUseCase, "execute").mockResolvedValue(
      new ScrapNfException({
        messageId: MessageIds.UNEXPECTED,
        message: "Unexpected",
      })
    );
    const response: HttpResponse = await sut.handle(request);
    expect(response).toEqual({ status: 400, body: { status: "Unexpected" } });
    expect(scrapNFSpy).toBeCalledWith(request.body);
  });
  it("should return status 500 in case of exception", async () => {
    jest.clearAllMocks();
    const request: HttpRequest = {
      body: { html: "html", uf: "MG" },
    };
    const scrapNFSpy = jest
      .spyOn(scrapNFUseCase, "execute")
      .mockRejectedValue("Error");

    const response: HttpResponse = await sut.handle(request);
    expect(response).toEqual({ status: 500, body: { status: "Error" } });
    expect(scrapNFSpy).toBeCalledWith(request.body);
  });
});
