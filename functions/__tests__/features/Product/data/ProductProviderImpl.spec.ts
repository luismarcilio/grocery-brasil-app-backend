import { ProductProvider } from "../../../../src/features/Product/provider/ProductProvider";
import { ProductRepository } from "../../../../src/features/Product/data/ProductRepository";
import { ProductNormalizationRepository } from "../../../../src/features/Product/data/ProductNormalizationRepository";
import { product } from "../fixtures";
import { purchase } from "../../Purchase/fixtures/purchases";
import { ProductPurchase, Product } from "../../../../src/model/Product";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { ProductProviderImpl } from "../../../../src/features/Product/data/ProductProviderImpl";

describe("ProductProviderImpl", () => {
  const save = jest.fn();
  const saveNf = jest.fn();
  const getProductById = jest.fn();
  const normalizeProduct = jest.fn();
  const productRepository: ProductRepository = {
    save,
    saveNf,
    getProductById,
  };

  const productNormalizationRepository: ProductNormalizationRepository = {
    normalizeProduct,
  };

  const sut: ProductProvider = new ProductProviderImpl(
    productRepository,
    productNormalizationRepository
  );
  describe("ProductProviderImpl.save", () => {
    it("should save a product", async () => {
      jest.spyOn(productRepository, "save").mockResolvedValue();
      await sut.save(product);
      expect(save).toHaveBeenCalledWith<[string, Product]>("eanCode", product);
    });
    it("should throw error on exception", async () => {
      jest.spyOn(productRepository, "save").mockRejectedValue("Error");
      await expect(sut.save(product)).rejects.toEqual(
        new ProductException({
          messageId: MessageIds.UNEXPECTED,
          message: "Error",
        })
      );
    });
  });
  describe("ProductProviderImpl.saveNf", () => {
    const product = purchase.purchaseItemList[1].product;
    const productPurchase: ProductPurchase = {
      accessKey: purchase.fiscalNote.accessKey,
      company: purchase.fiscalNote.company,
      date: purchase.fiscalNote.date,
      unityValue: purchase.purchaseItemList[1].unityValue,
    };
    const productId = "00002-product-2";
    const nfId = productPurchase.accessKey;
    it("should save information on a product purchase ", async () => {
      jest.spyOn(productRepository, "saveNf").mockResolvedValue();
      await sut.saveNf(product, productPurchase);
      expect(saveNf).toHaveBeenCalledWith<[string, string, ProductPurchase]>(
        productId,
        nfId,
        productPurchase
      );
    });
    it("should throw error on exception", async () => {
      jest.spyOn(productRepository, "saveNf").mockRejectedValue("Error");
      await expect(sut.saveNf(product, productPurchase)).rejects.toEqual(
        new ProductException({
          messageId: MessageIds.UNEXPECTED,
          message: "Error",
        })
      );
    });
  });
  describe("ProductProviderImpl.getProductById", () => {
    it("should find a product by id", async () => {
      jest
        .spyOn(productRepository, "getProductById")
        .mockResolvedValue(product);
      const actual = await sut.getProductById("productId");
      expect(actual).toEqual(product);
      expect(getProductById).toHaveBeenCalledWith("productId");
    });
    it("should return not found if product doesn't exist", async () => {
      const exception = new ProductException({
        messageId: MessageIds.NOT_FOUND,
        message: "product not found",
      });
      jest
        .spyOn(productRepository, "getProductById")
        .mockRejectedValue(exception);
      await expect(sut.getProductById("productId")).rejects.toEqual(exception);
    });
    it("should throw error on exception", async () => {
      jest
        .spyOn(productRepository, "getProductById")
        .mockRejectedValue("Error");

      await expect(sut.getProductById("productId")).rejects.toEqual(
        new ProductException({
          messageId: MessageIds.UNEXPECTED,
          message: "Error",
        })
      );
    });
  });
  describe("ProductProviderImpl.getDocId", () => {
    it("should provide the product Id", () => {
      let actual: string;
      actual = sut.getDocId(purchase.purchaseItemList[0].product);
      expect(actual).toEqual("00001");
      actual = sut.getDocId(purchase.purchaseItemList[1].product);
      expect(actual).toEqual("00002-product-2");
    });
  });

  describe("normalize Product", () => {
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

  describe("update product", () => {
    it("should update product", async () => {
      jest.clearAllMocks();

      save.mockResolvedValue(product);
      const actual = await sut.updateProduct(product);
      expect(actual).toEqual(product);
      expect(save).toHaveBeenCalledWith(product.eanCode, product);
    });

    it("should throw ProductException on error", async () => {
      const someException = new Error("error");
      const expected = new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: (someException as unknown) as string,
      });
      save.mockRejectedValue(someException);
      await expect(sut.updateProduct(product)).rejects.toEqual(expected);
    });
  });
});
