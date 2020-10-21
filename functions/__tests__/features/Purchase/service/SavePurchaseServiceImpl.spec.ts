/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseProvider } from "../../../../src/features/Purchase/provider/PurchaseProvider";
import { Purchase, PurchaseResume } from "../../../../src/model/Purchase";
import { PurchaseService } from "../../../../src/features/Purchase/service/PurchaseService";
import { PurchaseServiceImpl } from "../../../../src/features/Purchase/service/PurchaseServiceImpl";
import { ProductService } from "../../../../src/features/Product/service/ProductService";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { PurchaseException } from "../../../../src/core/ApplicationException";

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

class PurchaseProviderStub implements PurchaseProvider {
  save = (): Promise<boolean> => {
    return Promise.resolve(true);
  };
  saveResume = (): Promise<boolean> => {
    return Promise.resolve(true);
  };
}

class ProductServiceStub implements ProductService {
  saveItemsFromPurchase = (): Promise<boolean | ProductException> => {
    return Promise.resolve(true);
  };
}

describe("save purchase service", () => {
  const purchaseProviderStub: PurchaseProvider = new PurchaseProviderStub();
  const productServiceStub: ProductService = new ProductServiceStub();
  const sut: PurchaseService = new PurchaseServiceImpl(
    purchaseProviderStub,
    productServiceStub
  );
  it("should save the whole purchase", async () => {
    const purchaseProviderStubSpy = jest.spyOn(purchaseProviderStub, "save");

    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(purchaseProviderStubSpy).toHaveBeenCalledWith(purchase);
  });
  it("should save resumed purchase", async () => {
    const purchaseProviderStubSpy = jest.spyOn(
      purchaseProviderStub,
      "saveResume"
    );

    const actual = await sut.save(purchase);
    const purchaseResume: PurchaseResume = {
      company: {
        name: "iuoi",
        taxIdentification: "9879",
        address: {
          rawAddress: "kjhkj",
        },
      },
      date: purchase.fiscalNote.date,
      totalAmount: 10.5,
    };
    expect(actual).toEqual(true);
    expect(purchaseProviderStubSpy).toHaveBeenCalledWith(purchaseResume);
  });

  it("should save individual products", async () => {
    const productServiceStubSpy = jest.spyOn(
      productServiceStub,
      "saveItemsFromPurchase"
    );

    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(productServiceStubSpy).toHaveBeenCalledWith(purchase);
  });

  it("should return PurchaseException if an exception is thrown", async () => {
    const productServiceStubSpy = jest
      .spyOn(productServiceStub, "saveItemsFromPurchase")
      .mockImplementationOnce((_) => {
        throw "Error";
      });

    const actual = await sut.save(purchase);
    expect(actual).toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
    expect(productServiceStubSpy).toHaveBeenCalledWith(purchase);
  });
});
