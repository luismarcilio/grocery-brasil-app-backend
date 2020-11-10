import { ScrapNFService } from "./ScrapNFService";
import { HtmlFiscalNote } from "../../../model/HtmlFiscalNote";
import { Purchase } from "../../../model/Purchase";
import {
  ScrapNfException,
  MessageIds,
} from "../../../core/ApplicationException";
import { ScrapNfProviderFactory } from "../provider/ScrapNfProviderFactory";

export class ScrapNFServiceImpl implements ScrapNFService {
  private readonly scrapNfProviderFactory: ScrapNfProviderFactory;

  constructor(scrapNfProviderFactory: ScrapNfProviderFactory) {
    this.scrapNfProviderFactory = scrapNfProviderFactory;
  }

  scrapNf(
    htmlFiscalNote: HtmlFiscalNote
  ): Promise<Purchase | ScrapNfException> {
    try {
      const scrapNfProvider = this.scrapNfProviderFactory.get(
        htmlFiscalNote.uf
      );
      const purchase: Purchase = scrapNfProvider.scrap(htmlFiscalNote.html);
      return Promise.resolve(purchase);
    } catch (error) {
      if (error.constructor.name === "ScrapNfException") {
        return Promise.resolve(<ScrapNfException>error);
      }
      const exception: ScrapNfException = new ScrapNfException({
        messageId: MessageIds.UNEXPECTED,
        message: JSON.stringify(error),
      });
      return Promise.resolve(exception);
    }
  }
}
