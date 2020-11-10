import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";
import { HtmlFiscalNote } from "../../../model/HtmlFiscalNote";
import { ScrapNFService } from "../service/ScrapNFService";
import { ScrapNfException } from "../../../core/ApplicationException";

export class ScrapNFUseCase implements UseCase<Purchase> {
  private readonly scrapNFService: ScrapNFService;
  constructor(scrapNFService: ScrapNFService) {
    this.scrapNFService = scrapNFService;
  }

  execute(
    htmlFiscalNote: HtmlFiscalNote
  ): Promise<Purchase | ScrapNfException> {
    return this.scrapNFService.scrapNf(htmlFiscalNote);
  }
}
