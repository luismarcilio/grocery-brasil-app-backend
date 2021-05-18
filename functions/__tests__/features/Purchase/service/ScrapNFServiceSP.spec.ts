import { promisify } from "util";
import { readFile } from "fs";
import { ScrapNFProvider } from "../../../../src/features/Purchase/provider/ScrapNFProvider";
import { ScrapNFServiceSP } from "../../../../src/features/Purchase/provider/ScrapNFServiceSP";
import { Purchase } from "../../../../src/model/Purchase";

const htmlFile =
  "__tests__/features/Purchase/service/fixtures/valid_nf_from_sp.json";
const readFilePromise = promisify(readFile);

describe("ScrapNFServiceSP", () => {
  it("should ScrapNFServiceSP", async () => {
    const sut: ScrapNFProvider = ScrapNFServiceSP.instance();
    const html = await readFilePromise(htmlFile);
    const purchase: Purchase = sut.scrap(html.toString());
    expect(purchase).toBeDefined();
    if (purchase === undefined) {
      return;
    }

    expect(purchase.fiscalNote.accessKey).toBe(
      "CFe35210509060964011720590007833501406811251697"
    );
    expect(purchase.fiscalNote.number).toBe("140681");
    expect(purchase.fiscalNote.series).toBe("");
    expect(purchase.fiscalNote.company).toStrictEqual({
      name: "PIMENTA VERDE ALIMENTOS LTDA",
      taxIdentification: "09.060.964/0117-20",
      address: {
        rawAddress:
          "RODOVIA PRESIDENTE DUTRA, S/N, PIRATINGUY, CEP: 12580-000",
      },
    });

    const totalValue = purchase.purchaseItemList
      .map((p) => p.totalValue)
      .reduce((v1, v2) => v1 + v2, 0);
    expect(totalValue).toBeCloseTo(66.02);
  });
});
