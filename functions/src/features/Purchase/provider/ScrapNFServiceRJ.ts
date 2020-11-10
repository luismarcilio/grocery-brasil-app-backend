import { ScrapNFProvider } from "./ScrapNFProvider";
import { Purchase } from "../../../model/Purchase";
import { PurchaseItem } from "../../../model/PurchaseItem";
import { FiscalNote } from "../../../model/FiscalNote";
import cheerio = require("cheerio");
import { parseDate } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class ScrapNFServiceRJ implements ScrapNFProvider {
  private static instanceOfScrapNFProvider: ScrapNFProvider | undefined;

  private constructor() {
    null;
  }
  static instance(): ScrapNFProvider {
    if (!ScrapNFServiceRJ.instanceOfScrapNFProvider) {
      ScrapNFServiceRJ.instanceOfScrapNFProvider = new ScrapNFServiceRJ();
    }
    return ScrapNFServiceRJ.instanceOfScrapNFProvider;
  }
  @withLog(loggerLevel.DEBUG)
  scrap(html: string): Purchase {
    const $ = cheerio.load(html);
    const stringDate = $(
      "#NFe > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(4) > span"
    )
      .text()
      .split(" ")[0];

    const fiscalNote: FiscalNote = {
      accessKey: $(
        "#containerSis > div.GeralXslt > fieldset > table > tbody > tr > td:nth-child(1) > span"
      )
        .text()
        .replace(/\D/g, ""),
      number: $(
        "#NFe > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(3) > span"
      ).text(),
      series: $(
        "#NFe > fieldset:nth-child(1) > table > tbody > tr > td:nth-child(2) > span"
      ).text(),
      company: {
        name: $(
          "#NFe > fieldset:nth-child(2) > table > tbody > tr > td.col-2 > span"
        ).text(),
        taxIdentification: $(
          "#NFe > fieldset:nth-child(2) > table > tbody > tr > td:nth-child(1) > span"
        ).text(),
        address: {
          rawAddress:
            $(
              "#Emitente > fieldset > table > tbody > tr:nth-child(2) > td:nth-child(2) > span"
            )
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, "") +
            " " +
            $(
              "#Emitente > fieldset > table > tbody > tr:nth-child(3) > td:nth-child(1) > span"
            )
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, "") +
            ", CEP: " +
            $(
              "#Emitente > fieldset > table > tbody > tr:nth-child(3) > td:nth-child(2) > span"
            )
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, ""),
        },
      },
      date: parseDate(stringDate),
    };

    const totalAmount: number = +$(
      "#Totais > fieldset > fieldset > table > tbody > tr:nth-child(3) > td:nth-child(4) > span"
    )
      .text()
      .replace(",", ".");

    const purchase: Purchase = {
      fiscalNote,
      totalAmount,
      purchaseItemList: [],
    };

    let purchaseItem: PurchaseItem;
    $("#Prod > fieldset > div > table").each((_, element: cheerio.Element) => {
      if ($(element).attr("class") === "toggle box") {
        purchaseItem = {
          product: {
            name: "",
            eanCode: "",
            ncmCode: "",
            unity: {
              name: "",
            },
          },
          unity: {
            name: "",
          },
          unityValue: 0,
          units: 0,
          totalValue: 0,
        };

        purchaseItem.product.name = $(element)
          .find("tbody > tr > td.fixo-prod-serv-descricao > span")
          .text();
        purchaseItem.product.unity.name = $(element)
          .find("tbody > tr > td.fixo-prod-serv-uc > span")
          .text();
        purchaseItem.unity.name = $(element)
          .find("tbody > tr > td.fixo-prod-serv-uc > span")
          .text();
        purchaseItem.unityValue = +$(element)
          .find("tbody > tr > td.fixo-prod-serv-vb > span")
          .text()
          .replace(",", ".");
        purchaseItem.totalValue = +$(element)
          .find("tbody > tr > td.fixo-prod-serv-vb > span")
          .text()
          .replace(",", ".");
      }
      if ($(element).attr("class") === "toggable box") {
        const eanCode = +$(element)
          .find(
            "tbody > tr > td > table:nth-child(3) > tbody > tr.col-3 > td:nth-child(1) > span"
          )
          .text();
        const ncmCode = +$(element)
          .find(
            "tbody > tr > td > table:nth-child(1) > tbody > tr.col-4 > td:nth-child(2) > span"
          )
          .text();
        purchaseItem.product.eanCode = isNaN(eanCode) ? "" : eanCode.toString();
        purchaseItem.product.ncmCode = isNaN(ncmCode) ? "" : ncmCode.toString();
        purchaseItem.units = +$(element)
          .find(
            "tbody > tr > td > table:nth-child(3) > tbody > tr.col-3 > td:nth-child(3) > span"
          )
          .text()
          .replace(",", ".");
        purchase.purchaseItemList.push(purchaseItem);
      }
    });

    return purchase;
  }
}
