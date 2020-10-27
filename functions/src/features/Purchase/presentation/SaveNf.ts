import { Controller } from "../../../protocol/Controller";
import { HttpRequest, HttpResponse } from "../../../protocol/HttpProtocol";
import {
  ScrapNfException,
  PurchaseException,
} from "../../../core/ApplicationException";
import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";

export class SaveNf implements Controller {
  private readonly scrapNFUseCase: UseCase<Purchase>;
  private readonly savePurchaseUseCase: UseCase<boolean>;

  constructor(
    scrapNFUseCase: UseCase<Purchase>,
    savePurchaseUseCase: UseCase<boolean>
  ) {
    this.savePurchaseUseCase = savePurchaseUseCase;
    this.scrapNFUseCase = scrapNFUseCase;
  }

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const body = request.body;
      if (!body?.html?.length || !body?.uf?.length) {
        return { status: 400, body: { status: "Invalid request" } };
      }
      const scrapResult = await this.scrapNFUseCase.execute(body);

      if (scrapResult instanceof ScrapNfException) {
        return {
          status: 400,
          body: { status: scrapResult.message },
        };
      }

      const savePurchaseResult = await this.savePurchaseUseCase.execute(
        scrapResult
      );
      if (savePurchaseResult instanceof PurchaseException) {
        return {
          status: 400,
          body: { status: savePurchaseResult.message },
        };
      }
      return { status: 200, body: { status: "OK" } };
    } catch (error) {
      return Promise.resolve({ status: 500, body: { status: error } });
    }
  };
}
