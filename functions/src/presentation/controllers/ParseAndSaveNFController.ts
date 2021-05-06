import { Controller } from "./Controller";
import { SavePurchaseUseCase } from "../../features/Purchase/useCase/SavePurchaseUseCase";
import { ScrapNFUseCase } from "../../features/Purchase/useCase/ScrapNFUseCase";
import { HttpRequest, HttpResponse } from "../../core/HttpProtocol";
import { HtmlFiscalNote } from "../../model/HtmlFiscalNote";
import {
  ScrapNfException,
  PurchaseException,
} from "../../core/ApplicationException";
import { Purchase } from "../../model/Purchase";
import { withLog, loggerLevel, logger } from "../../core/Logging";

export class ParseAndSaveNFController implements Controller {
  private readonly savePurchaseUseCase: SavePurchaseUseCase;
  private readonly scrapNFUseCase: ScrapNFUseCase;

  constructor(
    savePurchaseUseCase: SavePurchaseUseCase,
    scrapNFUseCase: ScrapNFUseCase
  ) {
    this.savePurchaseUseCase = savePurchaseUseCase;
    this.scrapNFUseCase = scrapNFUseCase;
  }

  @withLog(loggerLevel.DEBUG)
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const htmlFiscalNote: HtmlFiscalNote = {
        html: request.body?.html,
        uf: request.params?.state,
      };

      if (!htmlFiscalNote.html || htmlFiscalNote.html.length === 0) {
        const response: HttpResponse = {
          status: 400,
          body: { status: "Bad Request" },
        };
        return Promise.resolve(response);
      }

      const result = await this.scrapNFUseCase.execute(htmlFiscalNote);

      if (result.constructor.name === "ScrapNfException") {
        const response: HttpResponse = {
          status: 400,
          body: { status: (result as ScrapNfException).message },
        };
        return Promise.resolve(response);
      }

      const purchase: Purchase = result as Purchase;
      if (!request.body.user) {
        logger.error("user not found");
        const response: HttpResponse = {
          status: 500,
          body: { status: "user not found" },
        };
        return Promise.resolve(response);
      }
      purchase.user = request.body.user;
      const saveResult = await this.savePurchaseUseCase.execute(purchase);
      if (saveResult.constructor.name === "PurchaseException") {
        logger.error(saveResult);
        const response: HttpResponse = {
          status: 500,
          body: { status: (saveResult as PurchaseException).message },
        };
        return Promise.resolve(response);
      }
      const response: HttpResponse = {
        status: 200,
        body: { status: "SUCCESS" },
      };
      return response;
    } catch (error) {
      logger.error(error);
      const response: HttpResponse = {
        status: 500,
        body: { status: error },
      };
      return Promise.resolve(response);
    }
  }
}
