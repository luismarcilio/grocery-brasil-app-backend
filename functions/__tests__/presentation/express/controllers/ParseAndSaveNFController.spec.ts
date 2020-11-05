/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from "../../../../src/presentation/controllers/Controller";
import { HttpRequest, HttpResponse } from "../../../../src/core/HttpProtocol";
import { purchase } from "../../../features/Purchase/fixtures/purchases";
import { HtmlFiscalNote } from "../../../../src/model/HtmlFiscalNote";
import {
  MessageIds,
  PurchaseException,
} from "../../../../src/core/ApplicationException";
import { ParseAndSaveNFController } from "../../../../src/presentation/controllers/ParseAndSaveNFController";
import { ScrapNFUseCase } from "../../../../src/features/Purchase/useCase/ScrapNFUseCase";
import { SavePurchaseUseCase } from "../../../../src/features/Purchase/useCase/SavePurchaseUseCase";
import { ScrapNfException } from "../../../../src/core/ApplicationException";

describe("ParseAndSaveNFController", () => {
  const savePurchaseUseCaseExecute = jest.fn();
  const scrapNFUseCaseExecute = jest.fn();
  const savePurchaseUseCase: SavePurchaseUseCase = ({
    execute: savePurchaseUseCaseExecute,
  } as unknown) as SavePurchaseUseCase;
  const scrapNFUseCase: ScrapNFUseCase = ({
    execute: scrapNFUseCaseExecute,
  } as unknown) as ScrapNFUseCase;

  const parseAndSaveNFController: Controller = new ParseAndSaveNFController(
    savePurchaseUseCase,
    scrapNFUseCase
  );

  const request: HttpRequest = {
    params: { state: "MG" },
    body: { html: "html", user: purchase.user },
  };

  it("should call scrap NF", async () => {
    scrapNFUseCaseExecute.mockResolvedValue(purchase);
    savePurchaseUseCaseExecute.mockResolvedValue(true);
    const expected: HttpResponse = {
      status: 200,
      body: { status: "SUCCESS" },
    };
    const expectedHtmlFiscalNote: HtmlFiscalNote = {
      html: "html",
      uf: "MG",
    };

    const actual = await parseAndSaveNFController.handle(request);
    expect(actual).toEqual(expected);
    expect(scrapNFUseCaseExecute).toBeCalledWith(expectedHtmlFiscalNote);
    expect(savePurchaseUseCaseExecute).toBeCalledWith(purchase);
  });
  it("should return error 400 if scrap nf fails", async () => {
    const expectedHtmlFiscalNote: HtmlFiscalNote = {
      html: "html",
      uf: "MG",
    };

    scrapNFUseCaseExecute.mockResolvedValue(
      new ScrapNfException({
        messageId: MessageIds.UNEXPECTED,
        message: "error on html",
      })
    );
    const expected: HttpResponse = {
      status: 400,
      body: { status: "error on html" },
    };

    const actual = await parseAndSaveNFController.handle(request);
    expect(actual).toEqual(expected);
    expect(scrapNFUseCaseExecute).toBeCalledWith(expectedHtmlFiscalNote);
  });
  it("should return error 500 if SavePurchaseUseCase fails", async () => {
    scrapNFUseCaseExecute.mockResolvedValue(purchase);
    savePurchaseUseCaseExecute.mockResolvedValue(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "error on the database",
      })
    );
    const expected: HttpResponse = {
      status: 500,
      body: { status: "error on the database" },
    };
    const expectedHtmlFiscalNote: HtmlFiscalNote = {
      html: "html",
      uf: "MG",
    };

    const actual = await parseAndSaveNFController.handle(request);
    expect(actual).toEqual(expected);
    expect(scrapNFUseCaseExecute).toBeCalledWith(expectedHtmlFiscalNote);
    expect(savePurchaseUseCaseExecute).toBeCalledWith(purchase);
  });
  it("should return error 500 if an exception occurs", async () => {
    scrapNFUseCaseExecute.mockImplementation((...args: any) => {
      throw new Error("fail");
    });
    const expected: HttpResponse = {
      status: 500,
      body: { status: new Error("fail") },
    };
    const expectedHtmlFiscalNote: HtmlFiscalNote = {
      html: "html",
      uf: "MG",
    };

    const actual = await parseAndSaveNFController.handle(request);
    expect(actual).toEqual(expected);
    expect(scrapNFUseCaseExecute).toBeCalledWith(expectedHtmlFiscalNote);
  });
  it("should return error 400 if html is null or empty", async () => {
    const thisRequest = { ...request };
    thisRequest.body.html = "";
    const expected: HttpResponse = {
      status: 400,
      body: { status: "Bad Request" },
    };
    const actual = await parseAndSaveNFController.handle(request);
    expect(actual).toEqual(expected);
  });
  it("should throw error 500 if user is not present in the body", async () => {
    jest.clearAllMocks();
    const thisRequest = { ...request };
    thisRequest.body.html = "html";
    delete thisRequest.body.user;
    scrapNFUseCaseExecute.mockResolvedValue(purchase);
    savePurchaseUseCaseExecute.mockResolvedValue(true);
    const expected: HttpResponse = {
      status: 500,
      body: { status: "user not found" },
    };
    const actual = await parseAndSaveNFController.handle(request);
    expect(actual).toEqual(expected);
  });
});
