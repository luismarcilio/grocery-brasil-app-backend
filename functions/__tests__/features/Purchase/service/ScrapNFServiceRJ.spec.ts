import { promisify } from "util";
import { readFile } from "fs";
import { ScrapNFProvider } from "../../../../src/features/Purchase/provider/ScrapNFProvider";
import { ScrapNFServiceRJ } from "../../../../src/features/Purchase/provider/ScrapNFServiceRJ";
import { Purchase } from "../../../../src/model/Purchase";

const htmlFile =
  "__tests__/features/Purchase/service/fixtures/valid_nf_from_rj.xhtml";
const readFilePromise = promisify(readFile);

describe("ScrapNFServiceRJ", () => {
  it("should ScrapNFServiceRJ", async () => {
    const sut: ScrapNFProvider = ScrapNFServiceRJ.instance();
    const html = await readFilePromise(htmlFile);
    const purchase: Purchase = sut.scrap(html.toString());
    expect(purchase).toBeDefined();
    if (purchase === undefined) {
      return;
    }

    expect(purchase.fiscalNote.accessKey).toBe(
      "33200561585865044442650060001312301776030906"
    );
    expect(purchase.fiscalNote.number).toBe("131230");
    expect(purchase.fiscalNote.series).toBe("6");
    expect(purchase.fiscalNote.company).toStrictEqual({
      name: "RAIADROGASIL S.A.",
      taxIdentification: "61.585.865/0444-42",
      address: {
        rawAddress:
          "AVENIDA NOSSA SENHORA DE COPACABANA,734 COPACABANA, CEP: 22050-001",
      },
    });

    const totalValue = purchase.purchaseItemList
      .map((p) => p.totalValue)
      .reduce((v1, v2) => v1 + v2, 0);
    expect(totalValue).toBeCloseTo(113.28);

    const totalDiscount = purchase.purchaseItemList
    .map(p => p.discount)
    .reduce((v1,v2) => v1+v2,0);
    expect(totalDiscount).toBeCloseTo(13.94);
  });
});
