import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";
import { Failure } from "../../../core/Failure";
import { HtmlFiscalNote } from "../../../model/HtmlFiscalNote";
import { ScrapNFService } from "../service/ScrapNFService";



export class ScrapNFUseCase implements UseCase<Purchase> {
    
    scrapNFService: ScrapNFService;
    constructor(scrapNFService: ScrapNFService){
        this.scrapNFService = scrapNFService;
    }

    execute = (htmlFiscalNote: HtmlFiscalNote): Promise<Purchase | Failure> => {
        return this.scrapNFService.scrapNf(htmlFiscalNote);
    }
}
