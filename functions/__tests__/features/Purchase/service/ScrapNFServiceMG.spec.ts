import { promisify } from "util";
import { readFile } from "fs";
import { ScrapNFProvider } from "../../../../src/features/Purchase/provider/ScrapNFProvider";
import { ScrapNFServiceMG } from "../../../../src/features/Purchase/provider/ScrapNFServiceMG";
import { Purchase } from "../../../../src/model/Purchase";

const htmlFile =
  "__tests__/features/Purchase/service/fixtures/valid_nf_from_mg.xhtml";
const readFilePromise = promisify(readFile);

describe("ScrapNFServiceMG",  () => {
  it("should ScrapNFServiceMG", async () => {
    const sut: ScrapNFProvider = ScrapNFServiceMG.instance();
    const html = await readFilePromise(htmlFile);
    const purchase: Purchase = sut.scrap(html.toString());
    expect(purchase).toBeDefined();
    if (purchase === undefined) {
      return;
    }
    expect(purchase.fiscalNote.accessKey).toBe(
      "31200819867464000128650170000243111100316095"
    );
    expect(purchase.fiscalNote.number).toBe("24311");
    expect(purchase.fiscalNote.series).toBe("17");
    expect(purchase.fiscalNote.company).toStrictEqual({
      name: "LS GUARATO LTDA",
      taxIdentification: "19.867.464/0001-28",
      address: {
        rawAddress:
          " R. NOVO HORIZONTE, 948 SAO SEBASTIAO UBERABA, MG , CEP: 38060480",
      },
    });

    const totalValue = purchase.purchaseItemList
      .map((p) => p.totalValue)
      .reduce((v1, v2) => v1 + v2, 0);
    expect(totalValue).toBeCloseTo(460.37);
  });
});
