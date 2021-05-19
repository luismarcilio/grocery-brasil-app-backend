import { ScrapNFProvider } from "./ScrapNFProvider";
import { Purchase } from "../../../model/Purchase";
// import { PurchaseItem } from "../../../model/PurchaseItem";
import { FiscalNote } from "../../../model/FiscalNote";
import cheerio = require("cheerio");
import { getDocId, parseDate2 } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";
import { PurchaseItem } from "../../../model/PurchaseItem";

interface SpHtmlData {
  cfe: string;
  emitente: string;
  produtos: string;
}

export class ScrapNFServiceSP implements ScrapNFProvider {
  private static instanceOfScrapNFProvider: ScrapNFProvider | undefined;

  private constructor() {
    null;
  }
  static instance(): ScrapNFProvider {
    if (!ScrapNFServiceSP.instanceOfScrapNFProvider) {
      ScrapNFServiceSP.instanceOfScrapNFProvider = new ScrapNFServiceSP();
    }
    return ScrapNFServiceSP.instanceOfScrapNFProvider;
  }
  @withLog(loggerLevel.DEBUG)
  scrap(html: string): Purchase {
    const spHtmlData: SpHtmlData = JSON.parse(html);
    const cfe$ = cheerio.load(spHtmlData.cfe);
    const emitente$ = cheerio.load(spHtmlData.emitente);
    const produtos$ = cheerio.load(spHtmlData.produtos);
    const stringDate = cfe$("#conteudo_lblDataEmissao").text();

    const fiscalNote: FiscalNote = {
      accessKey: cfe$("#conteudo_lblChaveAcesso").text(),
      number: cfe$("#conteudo_lblCfeNumero").text(),
      series: "",
      company: {
        name: emitente$("#conteudo_lblEmitenteDadosNome").text(),
        taxIdentification: emitente$(
          "#conteudo_lblEmitenteDadosEmitenteCnpj"
        ).text(),
        address: {
          rawAddress:
            emitente$("#conteudo_lblEmitenteDadosEndereco")
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, " ")
              .replace(/\b0{1,}/g, "") +
            ", " +
            emitente$("#conteudo_lblEmitenteDadosBairro")
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, " ") +
            ", CEP: " +
            emitente$("#conteudo_lblEmitenteDadosCep")
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, " "),
        },
      },
      date: parseDate2(stringDate),
    };

    const totalAmount: number = +cfe$("#conteudo_lblCfeValorTotal")
      .text()
      .replace(",", ".");

    const purchase: Purchase = {
      fiscalNote,
      totalAmount,
      purchaseItemList: [],
      totalDiscount: 0
    };

    produtos$("#conteudo_grvProdutosServicos > tbody > tr").each(
      (_, element: cheerio.Element) => {
        const header = cheerio(element).find("tr > th");
        if (header.length) {
          return;
        }
        const eanCode = +cheerio(element)
          .find("tr > td:nth-child(8)")
          .text()
          .trim();
        const ncmCode = +cheerio(element)
          .find("tr > td:nth-child(9)")
          .text()
          .replace(/[\n\t]/g, "")
          .trim();
        const purchaseItem: PurchaseItem = {
          product: {
            productId: "",
            name: cheerio(element)
              .find("tr > td:nth-child(2)")
              .text()
              .trim()
              .replace(/[\n\t]/g, ""),
            eanCode: isNaN(eanCode) ? "" : eanCode.toString(),
            ncmCode: isNaN(ncmCode) ? "" : ncmCode.toString(),
            unity: {
              name: cheerio(element)
                .find("tr > td:nth-child(4)")
                .text()
                .trim()
                .replace(/[\n\t]/g, ""),
            },
          },
          unity: {
            name: cheerio(element)
              .find("tr > td:nth-child(4)")
              .text()
              .trim()
              .replace(/[\n\t]/g, ""),
          },
          totalValue: +cheerio(element)
            .find("tr > td:nth-child(5)")
            .text()
            .replace(",", "."),
          units: +cheerio(element)
            .find("tr > td:nth-child(3)")
            .text()
            .replace(/[\n\t]/g, "")
            .trim()
            .replace(",", "."),
          unityValue: +cheerio(element)
            .find("tr > td:nth-child(12)")
            .text()
            .replace(",", "."),
          discount: 0
        };
        purchaseItem.product.productId = getDocId(purchaseItem.product);
        purchase.purchaseItemList.push(purchaseItem);
      }
    );

    return purchase;
  }
}
