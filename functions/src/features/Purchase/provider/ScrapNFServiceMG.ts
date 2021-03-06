import { ScrapNFProvider } from "./ScrapNFProvider";
import { Purchase } from "../../../model/Purchase";
import { PurchaseItem } from "../../../model/PurchaseItem";
import { FiscalNote } from "../../../model/FiscalNote";
import cheerio = require("cheerio");
import { getDocId, parseDate } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class ScrapNFServiceMG implements ScrapNFProvider {
  private static instanceOfScrapNFProvider: ScrapNFProvider | undefined;

  private constructor() {
    null;
  }
  static instance(): ScrapNFProvider {
    if (!ScrapNFServiceMG.instanceOfScrapNFProvider) {
      ScrapNFServiceMG.instanceOfScrapNFProvider = new ScrapNFServiceMG();
    }
    return ScrapNFServiceMG.instanceOfScrapNFProvider;
  }
  @withLog(loggerLevel.DEBUG)
  scrap(html: string): Purchase {
    const $ = cheerio.load(html);
    const stringDate = $(
      "div.ui-tabs-panel.ui-widget-content.ui-corner-bottom > table:nth-child(2) > tbody > tr > td:nth-child(4)"
    )
      .text()
      .split(" ")[0];

    const fiscalNote: FiscalNote = {
      accessKey: $("#formPrincipal\\:j_idt97_content > h5")
        .text()
        .replace(/\D/g, ""),
      number: $(
        "#formPrincipal\\:j_idt102\\:j_idt103 > table:nth-child(2) > tbody > tr > td:nth-child(3)"
      ).text(),
      series: $(
        "#formPrincipal\\:j_idt102\\:j_idt103 > table:nth-child(2) > tbody > tr > td:nth-child(2)"
      ).text(),
      company: {
        name: $(
          "#formPrincipal\\:j_idt102\\:j_idt103 > div:nth-child(7) > table > tbody > tr > td:nth-child(2)"
        ).text(),
        taxIdentification: $(
          "#formPrincipal\\:j_idt102\\:j_idt103 > div:nth-child(7) > table > tbody > tr > td:nth-child(1)"
        ).text(),
        address: {
          rawAddress:
            $(
              "#formPrincipal\\:j_idt102\\:j_idt394 > div > table:nth-child(5) > tbody > tr"
            )
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, " ") +
            ", CEP: " +
            $(
              "#formPrincipal\\:j_idt102\\:j_idt394 > div > table:nth-child(7) > tbody > tr > td:nth-child(2)"
            )
              .text()
              .replace(/[\n\t]/g, " ")
              .replace(/\s{2,}/g, " "),
        },
      },
      date: parseDate(stringDate),
    };

    const totalAmount: number = +$(
      "#formPrincipal\\:j_idt102\\:j_idt103 > table:nth-child(5) > tbody > tr > td:nth-child(1)"
    )
      .text()
      .replace("R$ ", "")
      .replace(",", ".");

    const totalDiscount: number = +$(
      "#formPrincipal\\:j_idt102\\:j_idt2445 > div > table:nth-child(9) > tbody > tr > td:nth-child(3)"
    )
      .text()
      .replace("R$ ", "")
      .replace(",", ".");
    const purchase: Purchase = {
      fiscalNote,
      totalAmount,
      purchaseItemList: [],
      totalDiscount,
    };
    $("#accordion1 > div").each((_, element: cheerio.Element) => {
      const eanCode = +$(element)
        .find(
          "div.panel-body.collapse  > table:nth-child(13) > tbody > tr > td:nth-child(1)"
        )
        .text();
      const ncmCode = +$(element)
        .find(
          "div.panel-body.collapse  > table:nth-child(1) > tbody > tr > td:nth-child(2)"
        )
        .text();
      const purchaseItem: PurchaseItem = {
        product: {
          productId: "",
          name: $(element)
            .find("div.panel-heading.panel-collapse > h4 > div > div.col-md-4")
            .text()
            .replace(/[\n\t]/g, ""),
          eanCode: isNaN(eanCode) ? "" : eanCode.toString(),
          ncmCode: isNaN(ncmCode) ? "" : ncmCode.toString(),
          unity: {
            name: $(element)
              .find(
                "div.panel-heading.panel-collapse > h4 > div > div.col-sm-3"
              )
              .text()
              .replace(/[\n\t]/g, ""),
          },
        },
        unity: {
          name: $(element)
            .find("div.panel-heading.panel-collapse > h4 > div > div.col-sm-3")
            .text()
            .replace(/[\n\t]/g, ""),
        },
        totalValue: +$(element)
          .find("div.panel-heading.panel-collapse > h4 > div > div.col-md-2")
          .text()
          .replace("R$ ", "")
          .replace(",", "."),
        units: +$(element)
          .find(
            "div.panel-heading.panel-collapse > h4 > div > div:nth-child(4)"
          )
          .text(),
        unityValue: +$(element)
          .find(
            "div.panel-body.collapse  > table:nth-child(15) > tbody > tr > td:nth-child(1)"
          )
          .text()
          .replace("R$ ", "")
          .replace(",", "."),
        discount: +$(element)
          .find(
            "div.panel-body.collapse  > table:nth-child(7) > tbody > tr > td:nth-child(1)"
          )
          .text()
          .replace("R$ ", "")
          .replace(",", "."),
      };
      purchaseItem.product.productId = getDocId(purchaseItem.product);
      purchase.purchaseItemList.push(purchaseItem);
    });

    return purchase;
  }
}
