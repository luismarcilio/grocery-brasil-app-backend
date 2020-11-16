/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseProvider } from "../../../../src/features/Purchase/provider/PurchaseProvider";
import { PurchaseService } from "../../../../src/features/Purchase/service/PurchaseService";
import { PurchaseServiceImpl } from "../../../../src/features/Purchase/service/PurchaseServiceImpl";
import { ProductService } from "../../../../src/features/Product/service/ProductService";
import { MessageIds } from "../../../../src/core/ApplicationException";
import { PurchaseException } from "../../../../src/core/ApplicationException";
import { purchase } from "../fixtures/purchases";
import { someAddress } from "../../Address/fixtures/fixtures";
import { PurchaseResume } from "../../../../src/model/Purchase";
import { AddressProvider } from "../../../../src/features/Address/provider/AddressProvider";

describe("save purchase service", () => {
  const save = jest.fn();
  const saveResume = jest.fn();
  const saveItemsFromPurchase = jest.fn();
  const normalizeProduct = jest.fn();
  const updateProduct = jest.fn();
  const uploadThumbnail = jest.fn();
  const uploadToSearchEngine = jest.fn();
  const getAddressFromRawAddress = jest.fn();

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

  const addressProvider: AddressProvider = {
    getAddressFromRawAddress,
  };

  const sut: PurchaseService = new PurchaseServiceImpl(
    purchaseProviderStub,
    productServiceStub,
    addressProvider
  );
  it("should save the whole purchase", async () => {
    const purchaseWithAddress = { ...purchase };
    purchaseWithAddress.fiscalNote.company.address = someAddress;
    save.mockResolvedValue(true);
    saveResume.mockResolvedValue(true);
    saveItemsFromPurchase.mockResolvedValue(true);
    getAddressFromRawAddress.mockResolvedValue(someAddress);
    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(getAddressFromRawAddress).toHaveBeenCalledWith(
      purchaseWithAddress.fiscalNote.company.address.rawAddress
    );
    expect(save).toHaveBeenCalledWith(purchaseWithAddress);
  });
  it("should save resumed purchase", async () => {
    const purchaseWithAddress = { ...purchase };
    purchaseWithAddress.fiscalNote.company.address = someAddress;
    const resume: PurchaseResume = {
      user: purchaseWithAddress.user,
      accessKey: purchaseWithAddress.fiscalNote.accessKey,
      company: purchaseWithAddress.fiscalNote.company,
      date: purchaseWithAddress.fiscalNote.date,
      totalAmount: purchaseWithAddress.totalAmount,
    };
    getAddressFromRawAddress.mockResolvedValue(someAddress);

    const purchaseProviderStubSpy = jest.spyOn(
      purchaseProviderStub,
      "saveResume"
    );

    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(getAddressFromRawAddress).toHaveBeenCalledWith(
      purchaseWithAddress.fiscalNote.company.address.rawAddress
    );
    expect(purchaseProviderStubSpy).toHaveBeenCalledWith(resume);
  });

  it("should save individual products", async () => {
    const purchaseWithAddress = { ...purchase };
    purchaseWithAddress.fiscalNote.company.address = someAddress;
    getAddressFromRawAddress.mockResolvedValue(someAddress);

    const productServiceStubSpy = jest.spyOn(
      productServiceStub,
      "saveItemsFromPurchase"
    );

    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(getAddressFromRawAddress).toHaveBeenCalledWith(
      purchaseWithAddress.fiscalNote.company.address.rawAddress
    );

    expect(productServiceStubSpy).toHaveBeenCalledWith(purchaseWithAddress);
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
