/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseProvider } from "../../../../src/features/Purchase/provider/PurchaseProvider";
import { PurchaseService } from "../../../../src/features/Purchase/service/PurchaseService";
import { PurchaseServiceImpl } from "../../../../src/features/Purchase/service/PurchaseServiceImpl";
import { ProductService } from "../../../../src/features/Product/service/ProductService";
import { MessageIds } from "../../../../src/core/ApplicationException";
import { PurchaseException } from "../../../../src/core/ApplicationException";
import { resume, purchase } from "../fixtures/purchases";

describe("save purchase service", () => {
  const save = jest.fn();
  const saveResume = jest.fn();
  const saveItemsFromPurchase = jest.fn();
  const normalizeProduct = jest.fn();
  const updateProduct = jest.fn();
  const uploadThumbnail = jest.fn();
  const uploadToSearchEngine = jest.fn();

  const purchaseProviderStub: PurchaseProvider = {
    save,
    saveResume,
  };
  const productServiceStub: ProductService = {
    saveItemsFromPurchase,
    normalizeProduct,
    updateProduct,
    uploadThumbnail,
    uploadToSearchEngine,
  };

  const sut: PurchaseService = new PurchaseServiceImpl(
    purchaseProviderStub,
    productServiceStub
  );
  it("should save the whole purchase", async () => {
    save.mockResolvedValue(true);
    saveResume.mockResolvedValue(true);
    saveItemsFromPurchase.mockResolvedValue(true);
    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(save).toHaveBeenCalledWith(purchase);
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
