/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductRepository } from "../../../../src/features/Product/data/ProductRepository";
import { ProductRepositoryFirebase } from "../../../../src/features/Product/data/ProductRepositoryFirebase";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { ProductPurchase } from "../../../../src/model/Product";
import { purchase } from "../../Purchase/fixtures/purchases";
import { product } from "../fixture/product";

describe("ProductRepositoryImpl", () => {
  const exists = true;
  const data = jest.fn();
  const docSnapshot = {
    exists,
    data,
  };
  const get = jest.fn(() => {
    docSnapshot;
  });

  const collection = jest.fn(() => ({ doc: jest.fn() }));
  const set = jest.fn();
  const doc = jest.fn(() => ({ get, set, collection }));
  const firestore: FirebaseFirestore.Firestore = ({
    collection,
  } as unknown) as FirebaseFirestore.Firestore;

  const sut: ProductRepository = new ProductRepositoryFirebase(firestore);

  const unexpected = new PurchaseException({
    messageId: MessageIds.UNEXPECTED,
    message: "Error",
  });

  describe("save", () => {
    it("should save the product", async () => {
      jest.clearAllMocks();
      const collectionFromFirestoreSpy = jest
        .spyOn(firestore, "collection")
        .mockReturnValue(({ doc } as unknown) as any);
      await sut.save("productId", product);
      expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(1, "PRODUTOS");
      expect(doc).toBeCalledWith("productId");
      expect(set).toBeCalledWith(product);
    });

    it("should fail on exception", async () => {
      jest.clearAllMocks();
      jest.spyOn(firestore, "collection").mockImplementation((_) => {
        throw "Error";
      });
      await expect(sut.save("productId", product)).rejects.toEqual(unexpected);
    });
  });
  describe("saveNF", () => {
    const productPurchase: ProductPurchase = {
      accessKey: purchase.fiscalNote.accessKey,
      company: purchase.fiscalNote.company,
      date: purchase.fiscalNote.date,
      unityValue: purchase.purchaseItemList[0].unityValue,
      discount: purchase.purchaseItemList[0].discount
    };
    it("should save the product purchase information", async () => {
      jest.clearAllMocks();
      const collectionFromFirestoreSpy = jest
        .spyOn(firestore, "collection")
        .mockReturnValue(({ doc } as unknown) as any);
      await sut.saveNf("productId", "nfId", productPurchase);
      expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(1, "PRODUTOS");
      expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(2, "COMPRAS");
      expect(doc).toBeCalledWith("nfId");
      expect(set).toBeCalledWith(productPurchase);
    });
    it("should fail on exception", async () => {
      jest.clearAllMocks();
      jest.spyOn(firestore, "collection").mockImplementation((_) => {
        throw "Error";
      });
      await expect(
        sut.saveNf("productId", "nfId", productPurchase)
      ).rejects.toEqual(unexpected);
    });
  });
  describe("getProductById", () => {
    it("should find the product", async () => {
      jest.clearAllMocks();
      jest
        .spyOn(firestore, "collection")
        .mockReturnValue(({ doc } as unknown) as any);
      jest.spyOn(doc(), "get").mockReturnValue((docSnapshot as unknown) as any);
      jest.spyOn(docSnapshot, "data").mockReturnValue(product);
      const actual = await sut.getProductById("productId");
      expect(actual).toEqual(product);
    });
    it("should return null if not present", async () => {
      jest.clearAllMocks();
      const documentSnapshotNotFound = { ...docSnapshot };
      documentSnapshotNotFound.exists = false;
      jest
        .spyOn(firestore, "collection")
        .mockReturnValue(({ doc } as unknown) as any);
      jest
        .spyOn(doc(), "get")
        .mockReturnValue((documentSnapshotNotFound as unknown) as any);
      jest.spyOn(documentSnapshotNotFound, "data").mockReturnValue(product);
      const actual = await sut.getProductById("productId");
      expect(actual).toBeNull;

    });
    it("should fail with unexpected on error", async () => {
      jest.clearAllMocks();
      jest.spyOn(firestore, "collection").mockImplementation((_) => {
        throw "Error";
      });
      await expect(sut.getProductById("productId")).rejects.toEqual(unexpected);
    });
  });
});
