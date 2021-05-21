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
      "CFe35210403640467003614590009420500176134696826"
    );
    expect(purchase.fiscalNote.number).toBe("017613");
    expect(purchase.fiscalNote.series).toBe("");
    expect(purchase.fiscalNote.company).toStrictEqual({
      name: "SUPERMERCADOS JAU SERVE LTDA",
      taxIdentification: "03.640.467/0036-14",
      address: {
        rawAddress:
          "AVENIDA SAO CARLOS, 3200, VILA COSTA DO SOL, CEP: 13566-330",
      },
    });
    expect(new Date(2021, 3, 8)).toStrictEqual(purchase.fiscalNote.date);
    expect({
      product: {
        eanCode: "7897195981374",
        name: "LIFE LARANJA 900ml",
        ncmCode: "20091200",
        productId: "7897195981374",
        unity: {
          name: "UN",
        },
      },
      totalValue: 16.98,
      units: 2,
      unity: {
        name: "UN",
      },
      unityValue: 8.49,
      discount: 1,
    }).toStrictEqual(purchase.purchaseItemList[0]);
    expect(7).toEqual(purchase.purchaseItemList.length);
    const totalValue = purchase.purchaseItemList
      .map((p) => p.totalValue)
      .reduce((v1, v2) => v1 + v2, 0);
    expect(totalValue).toBeCloseTo(83.49);

    expect(purchase.totalDiscount).toBe(14.35);

    const totalDiscount = purchase.purchaseItemList
      .map((p) => p.discount)
      .reduce((v1, v2) => v1 + v2, 0);
    expect(totalDiscount).toBeCloseTo(15.35);
  });
});
