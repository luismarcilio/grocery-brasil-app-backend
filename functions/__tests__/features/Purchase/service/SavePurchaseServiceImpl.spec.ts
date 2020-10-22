/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseProvider } from "../../../../src/features/Purchase/provider/PurchaseProvider";
import { PurchaseService } from "../../../../src/features/Purchase/service/PurchaseService";
import { PurchaseServiceImpl } from "../../../../src/features/Purchase/service/PurchaseServiceImpl";
import { ProductService } from "../../../../src/features/Product/service/ProductService";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { PurchaseException } from "../../../../src/core/ApplicationException";
import { resume, purchase } from "../fixtures/purchases";

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
    expect(actual).toEqual(true);
    expect(purchaseProviderStubSpy).toHaveBeenCalledWith(resume);
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
