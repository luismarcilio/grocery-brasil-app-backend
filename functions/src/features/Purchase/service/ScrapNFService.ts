import { Failure } from "../../../core/Failure";
import { HtmlFiscalNote } from "../../../model/HtmlFiscalNote";
import { Purchase } from "../../../model/Purchase";

export interface ScrapNFService {
  scrapNf: (htmlFiscalNote: HtmlFiscalNote) => Promise<Purchase | Failure>;
}
