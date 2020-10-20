/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScrapNFServiceImpl } from "../../../../src/features/Purchase/service/ScrapNFServiceImpl";
import { Purchase } from "../../../../src/model/Purchase";
import {
  ScrapNfException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("ScrapNFServiceImpl", () => {
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

  it("should call parser and return success if all ok", async () => {
    class ScrapNfProviderStub {
      scrap = (html: string): Purchase => {
        return sample;
      };
    }

    class ScrapNfProviderFactoryStub {
      get = (nf: string): ScrapNfProviderStub => {
        return new ScrapNfProviderStub();
      };
    }
    const scrapNfProviderFactoryStub: ScrapNfProviderFactoryStub = new ScrapNfProviderFactoryStub();
    const sut = new ScrapNFServiceImpl(scrapNfProviderFactoryStub);
    const actual = await sut.scrapNf({ html: "html", uf: "MG" });
    expect(actual).toEqual(sample);
  });

  it("should call parser and return exception if an error occurs", async () => {
    class ScrapNfProviderStub {
      scrap = (html: string): Purchase => {
        throw new ScrapNfException({
          messageId: MessageIds.UNEXPECTED,
          message: "erro",
        });
      };
    }

    class ScrapNfProviderFactoryStub {
      get = (nf: string): ScrapNfProviderStub => {
        return new ScrapNfProviderStub();
      };
    }
    const scrapNfProviderFactoryStub: ScrapNfProviderFactoryStub = new ScrapNfProviderFactoryStub();
    const sut = new ScrapNFServiceImpl(scrapNfProviderFactoryStub);
    const actual = await sut.scrapNf({ html: "html", uf: "MG" });
    console.log(actual);
    expect(actual).toEqual(
      new ScrapNfException({
        messageId: MessageIds.UNEXPECTED,
        message: "erro",
      })
    );
  });
});
