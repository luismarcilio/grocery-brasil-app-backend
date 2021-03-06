import { Controller } from "../../../presentation/controllers/Controller";
import { HttpRequest, HttpResponse } from "../../../core/HttpProtocol";
import {
  ScrapNfException,
  PurchaseException,
} from "../../../core/ApplicationException";
import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";
import { withLog, loggerLevel } from "../../../core/Logging";

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

  @withLog(loggerLevel.DEBUG)
  async handle(request: HttpRequest): Promise<HttpResponse> {
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
  }
}
