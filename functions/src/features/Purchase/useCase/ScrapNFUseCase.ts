import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";
import { HtmlFiscalNote } from "../../../model/HtmlFiscalNote";
import { ScrapNFService } from "../service/ScrapNFService";
import { ScrapNfException } from "../../../core/ApplicationException";
import { withLog, loggerLevel } from "../../../core/Logging";

export class ScrapNFUseCase implements UseCase<Purchase> {
  private readonly scrapNFService: ScrapNFService;
  constructor(scrapNFService: ScrapNFService) {
    this.scrapNFService = scrapNFService;
  }

  @withLog(loggerLevel.DEBUG)
  execute(
    htmlFiscalNote: HtmlFiscalNote
  ): Promise<Purchase | ScrapNfException> {
    return this.scrapNFService.scrapNf(htmlFiscalNote);
  }
}
