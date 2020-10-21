/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseProvider } from "../../../../src/features/Purchase/provider/PurchaseProvider";
import { PurchaseDAO } from "../../../../src/features/Purchase/data/PurchaseDAO";
import { PurchaseProviderImpl } from "../../../../src/features/Purchase/data/PurchaseProviderImpl";
import { Purchase, PurchaseResume } from "../../../../src/model/Purchase";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
const purchase: Purchase = {
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
  purchaseItemList: [
    {
      product: {
        eanCode: "00001",
        name: "product1",
        ncmCode: "00001",
        unity: { name: "UN" },
      },
      unity: { name: "UN" },
      unityValue: 11.5,
      units: 1,
      totalValue: 11.5,
    },
    {
      product: {
        eanCode: "00002",
        name: "product2",
        ncmCode: "00002",
        unity: { name: "UN" },
      },
      unity: { name: "UN" },
      unityValue: 12.5,
      units: 1,
      totalValue: 12.5,
    },
  ],
};

const purchaseResume: PurchaseResume = {
  company: purchase.fiscalNote.company,
  date: purchase.fiscalNote.date,
  totalAmount: purchase.totalAmount,
};

class PurchaseDAOStub implements PurchaseDAO {
  savePurchase = (purchase: Purchase): Promise<boolean> =>
    Promise.resolve(true);
  savePurchaseResume = (purchaseResume: PurchaseResume): Promise<boolean> =>
    Promise.resolve(true);
}

describe("Name of the group", () => {
  const purchaseDAOStub: PurchaseDAOStub = new PurchaseDAOStub();
  const sut: PurchaseProvider = new PurchaseProviderImpl(purchaseDAOStub);

  it("should call savePurchase on dao", async () => {
    const savePurchaseSpy = jest.spyOn(purchaseDAOStub, "savePurchase");
    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(savePurchaseSpy).toHaveBeenCalledWith(purchase);
  });

  it("should call savePurchaseResume on dao", async () => {
    const savePurchaseSpy = jest.spyOn(purchaseDAOStub, "savePurchaseResume");
    const actual = await sut.saveResume(purchaseResume);
    expect(actual).toEqual(true);
    expect(savePurchaseSpy).toHaveBeenCalledWith(purchaseResume);
  });
  it("should throw exception if an error occurs on savePurchase", async () => {
    jest.spyOn(purchaseDAOStub, "savePurchase").mockImplementationOnce((_) => {
      throw "Error";
    });
    await expect(sut.save(purchase)).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
  it("should throw exception if an error occurs on savePurchaseResume", async () => {
    jest
      .spyOn(purchaseDAOStub, "savePurchaseResume")
      .mockImplementationOnce((_) => {
        throw "Error";
      });
    await expect(sut.saveResume(purchaseResume)).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
});
