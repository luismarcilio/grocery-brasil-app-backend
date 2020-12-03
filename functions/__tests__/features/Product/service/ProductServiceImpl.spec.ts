import { ThumbnailFacade } from "../../../../src/features/Product/provider/ThumbnailFacade";

import { ProductService } from "../../../../src/features/Product/service/ProductService";
import { ProductProvider } from "../../../../src/features/Product/provider/ProductProvider";
import { purchase } from "../../Purchase/fixtures/purchases";
import { ProductServiceImpl } from "../../../../src/features/Product/service/ProductServiceImpl";
import { ProductPurchase } from "../../../../src/model/Product";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { product } from "../fixture/product";

describe("ProductService implementation", () => {
  const save = jest.fn();
  const saveNf = jest.fn();
  const getProductById = jest.fn();
  const getDocId = jest.fn();
  const updateProduct = jest.fn();
  const normalizeProduct = jest.fn();
  const uploadToSearchEngine = jest.fn();

  const productProviderStub: ProductProvider = {
    save,
    saveNf,
    getProductById,
    getDocId,
    updateProduct,
    normalizeProduct,
    uploadToSearchEngine,
  };

  const uploadThumbnail = jest.fn();
  const thumbnailFacade: ThumbnailFacade = {
    uploadThumbnail,
  };

  const sut: ProductService = new ProductServiceImpl(
    productProviderStub,
    thumbnailFacade
  );

  it("should save each product", async () => {
    jest.resetAllMocks();
    jest.spyOn(productProviderStub, "save").mockResolvedValue();
    jest.spyOn(productProviderStub, "saveNf").mockResolvedValue();
    jest.spyOn(productProviderStub, "getDocId").mockReturnValueOnce("00001");
    jest
      .spyOn(productProviderStub, "getDocId")
      .mockReturnValueOnce("00002-product-2");

    jest.spyOn(productProviderStub, "getProductById").mockRejectedValue(
      new ProductException({
        messageId: MessageIds.NOT_FOUND,
        message: "Product not found",
      })
    );
    await sut.saveItemsFromPurchase(purchase);
    expect(save).toHaveBeenNthCalledWith(1, {
      eanCode: "00001",
      name: "product1",
      ncmCode: "00001",
      unity: { name: "UN" },
    });
    expect(save).toHaveBeenNthCalledWith(2, {
      eanCode: "",
      name: "product/2",
      ncmCode: "00002",
      unity: { name: "UN" },
    });
  });
  it("should check if the product exists before save", async () => {
    jest.resetAllMocks();
    jest.spyOn(productProviderStub, "save").mockResolvedValue();
    jest.spyOn(productProviderStub, "saveNf").mockResolvedValue();

    jest.spyOn(productProviderStub, "getProductById").mockRejectedValue(
      new ProductException({
        messageId: MessageIds.NOT_FOUND,
        message: "Product not found",
      })
    );
    jest
      .spyOn(productProviderStub, "getProductById")
      .mockResolvedValueOnce(purchase.purchaseItemList[0].product);
    jest.spyOn(productProviderStub, "getDocId").mockReturnValueOnce("00001");
    jest
      .spyOn(productProviderStub, "getDocId")
      .mockReturnValueOnce("00002-PRODUCT-2");
    await sut.saveItemsFromPurchase(purchase);

    expect(getProductById).toHaveBeenNthCalledWith(1, "00001");
    expect(getProductById).toHaveBeenNthCalledWith(2, "00002-PRODUCT-2");
    expect(save).toHaveBeenNthCalledWith(1, {
      eanCode: "",
      name: "product/2",
      ncmCode: "00002",
      unity: { name: "UN" },
    });
  });
  it("should save the company, price and date of the purchase", async () => {
    jest.resetAllMocks();
    jest.spyOn(productProviderStub, "save").mockResolvedValue();
    jest.spyOn(productProviderStub, "saveNf").mockResolvedValue();
    jest.spyOn(productProviderStub, "getDocId").mockReturnValueOnce("00001");
    jest
      .spyOn(productProviderStub, "getDocId")
      .mockReturnValueOnce("00002-product-2");

    jest.spyOn(productProviderStub, "getProductById").mockRejectedValue(
      new ProductException({
        messageId: MessageIds.NOT_FOUND,
        message: "Product not found",
      })
    );
    const productPurchase: ProductPurchase[] = [
      {
        accessKey: purchase.fiscalNote.accessKey,
        company: purchase.fiscalNote.company,
        date: purchase.fiscalNote.date,
        unityValue: purchase.purchaseItemList[0].unityValue,
        geohash: "75cm2cx57",
      },
      {
        accessKey: purchase.fiscalNote.accessKey,
        company: purchase.fiscalNote.company,
        date: purchase.fiscalNote.date,
        unityValue: purchase.purchaseItemList[1].unityValue,
        geohash: "75cm2cx57",
      },
    ];
    await sut.saveItemsFromPurchase(purchase);
    expect(saveNf).toHaveBeenNthCalledWith(
      1,
      purchase.purchaseItemList[0].product,
      productPurchase[0]
    );
    expect(saveNf).toHaveBeenNthCalledWith(
      2,
      purchase.purchaseItemList[1].product,
      productPurchase[1]
    );
  });
  it("should return ProductException if an exception occurs", async () => {
    jest.resetAllMocks();
    jest.spyOn(productProviderStub, "save").mockResolvedValue();
    jest.spyOn(productProviderStub, "saveNf").mockRejectedValue("Error");
    jest.spyOn(productProviderStub, "getDocId").mockReturnValue("DocId");

    jest.spyOn(productProviderStub, "getProductById").mockRejectedValue(
      new ProductException({
        messageId: MessageIds.NOT_FOUND,
        message: "Product not found",
      })
    );
    const actual = await sut.saveItemsFromPurchase(purchase);
    expect(actual).toEqual(
      new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
  describe("updateProduct", () => {
    it("should update the product", async () => {
      updateProduct.mockResolvedValue(product);
      const actual = await sut.updateProduct(product);
      expect(actual).toEqual(product);
      expect(updateProduct).toHaveBeenCalledWith(product);
    });
    it("should throw ProductException on error", async () => {
      const someException = new Error("error");
      const expected = new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: (someException as unknown) as string,
      });
      updateProduct.mockRejectedValue(someException);
      await expect(sut.updateProduct(product)).rejects.toEqual(expected);
    });
  });

  describe("normalizeProduct", () => {
    it("should bypass and return same product if product doesn't have ean code", async () => {
      const otherProduct = { ...product };
      delete otherProduct.eanCode;
      const actual = await sut.normalizeProduct(otherProduct);
      expect(actual).toEqual(otherProduct);
      expect(normalizeProduct).not.toHaveBeenCalled();
    });
    it("should normalize product", async () => {
      const normalizedProduct = { ...product };
      normalizedProduct.name = "normalizedName";
      normalizeProduct.mockResolvedValue(normalizedProduct);
      const actual = await sut.normalizeProduct(product);
      expect(actual).toEqual(normalizedProduct);
      expect(normalizeProduct).toHaveBeenCalledWith(product);
    });
    it("should throw ProductException on error", async () => {
      const someException = new Error("error");
      const expected = new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: (someException as unknown) as string,
      });
      normalizeProduct.mockRejectedValue(someException);

      await expect(sut.normalizeProduct(product)).rejects.toEqual(expected);
    });
  });

  describe("uploadThumbnail", () => {
    it("should upload the new thumbnail to the file server", async () => {
      const updatedProduct = { ...product };
      updatedProduct.thumbnail = "updatedThumbnail";
      uploadThumbnail.mockResolvedValue(updatedProduct);
      const actual = await sut.uploadThumbnail(product);
      expect(actual).toEqual(updatedProduct);
      expect(uploadThumbnail).toHaveBeenCalledWith(product);
    });
    it("should throw an exception if an error occurs", async () => {
      const someException = new Error("error");
      const expected = new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: (someException as unknown) as string,
      });
      uploadThumbnail.mockRejectedValue(someException);

      await expect(sut.uploadThumbnail(product)).rejects.toEqual(expected);
    });
  });

  describe("uploadToSearchEngine", () => {
    it("should upload text search engine", async () => {
      const expected = { ...product };
      uploadToSearchEngine.mockResolvedValue(expected);
      const actual = await sut.uploadToSearchEngine(product);
      expect(actual).toEqual(expected);
      expect(uploadToSearchEngine).toHaveBeenCalledWith(product);
    });
    it("should throw an exception if an error occurs", async () => {
      const someException = new Error("error");
      const expected = new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: (someException as unknown) as string,
      });
      uploadToSearchEngine.mockRejectedValue(someException);

      await expect(sut.uploadToSearchEngine(product)).rejects.toEqual(expected);
    });
  });
});
