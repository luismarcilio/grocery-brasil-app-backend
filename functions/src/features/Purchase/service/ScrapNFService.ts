import { HtmlFiscalNote } from "../../../model/HtmlFiscalNote";
import { Purchase } from "../../../model/Purchase";
import { ScrapNfException } from "../../../core/ApplicationException";

export interface ScrapNFService {
  scrapNf: (
    htmlFiscalNote: HtmlFiscalNote
  ) => Promise<Purchase | ScrapNfException>;
}
