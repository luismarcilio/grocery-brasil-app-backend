import { HtmlFiscalNote } from "../../../../src/model/HtmlFiscalNote";
import { Purchase } from "../../../../src/model/Purchase";
import { ScrapNFUseCase } from "../../../../src/features/Purchase/useCase/ScrapNFUseCase"
import { ScrapNFService } from "../../../../src/features/Purchase/service/ScrapNFService";

describe('scrap NF html', () => {

    const sample: Purchase = {
        'fiscalNote': {
            date: new Date(),
            accessKey: "lsdfaslkjfls", 
            number: '87687',
            series: '98',
            company: {
                name: 'iuoi',
                taxIdentification: '9879',
                address: {
                    rawAddress: 'kjhkj'
                }
            }
        },
        totalAmount: 10.5,
        totalDiscount: 3,
        purchaseItemList: []
    };

    const scrapNfService: ScrapNFService = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        scrapNf(htmlFiscalNote: HtmlFiscalNote){
            return Promise.resolve(sample);
        }
    }
    it('should scrap nf HTML and return a Purchase object', async () => {        
        const htmlFiscalNote: HtmlFiscalNote = {html: 'html', uf: 'MG'};
        const expected: Purchase = {...sample};
        const sut = new ScrapNFUseCase(scrapNfService)
        const actual = await sut.execute(htmlFiscalNote);
        expect(actual).toEqual(expected);

        
    });
    
});