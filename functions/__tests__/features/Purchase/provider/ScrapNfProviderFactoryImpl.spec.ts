/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScrapNFProvider } from "../../../../src/features/Purchase/provider/ScrapNFProvider";
import { ScrapNfProviderFactory } from "../../../../src/features/Purchase/provider/ScrapNfProviderFactory";
import { ScrapNfProviderFactoryImpl } from "../../../../src/features/Purchase/provider/ScrapNfProviderFactoryImpl";
import { ScrapNfException } from "../../../../src/core/ApplicationException";
import { Purchase } from "../../../../src/model/Purchase";

const sample: Purchase = {
  fiscalNote: {
    date: new Date(),
    accessKey: "lsdfaslkjfls",
    number: "87687",
    series: "98",
    company: {
      name: "iuoi",
      taxIdentification: "9879",
      address: {
        rawAddress: "kjhkj",
      },
    },
  },
  totalAmount: 10.5,
  purchaseItemList: [],
};

class ScrapProviderMG implements ScrapNFProvider {
  static instance = () => {
    return new ScrapProviderMG();
  };
  scrap = (html: string) => {
    return sample;
  };
}

class ScrapProviderRJ implements ScrapNFProvider {
  static instance = () => {
    return new ScrapProviderRJ();
  };
  scrap = (html: string) => {
    return sample;
  };
}

describe("ScrapNfProviderFactoryImpl", () => {
  const providerConfiguration = [
    {
      uf: "MG",
      scrapNfProvider: ScrapProviderMG.instance(),
    },
    {
      uf: "RJ",
      scrapNfProvider: ScrapProviderRJ.instance(),
    },
  ];

  it("should return the configured provider for each UF ", () => {
    const sut: ScrapNfProviderFactory = new ScrapNfProviderFactoryImpl(
      providerConfiguration
    );
    const actual = sut.get("MG");
    expect(actual).toBeInstanceOf(ScrapProviderMG);
  });

  it("should return an error if UF isnt't configured ", () => {
    const sut: ScrapNfProviderFactory = new ScrapNfProviderFactoryImpl(
      providerConfiguration
    );
    expect(() => sut.get("AC")).toThrow(ScrapNfException);
  });
});
