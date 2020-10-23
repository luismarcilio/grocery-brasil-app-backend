/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseRepository } from "../../../../src/features/Purchase/data/PurchaseRepository";
import { PurchaseRepositoryFirebase } from "../../../../src/features/Purchase/data/PurchaseRepositoryFirebase";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { purchase, resume } from "../fixtures/purchases";
import { firestore } from "../../__mock__/mocks";

describe("PurchaseRepositoryFirebase", () => {
  const sut: PurchaseRepository = new PurchaseRepositoryFirebase(firestore);

  it("should save purchase", async () => {
    const set = jest.fn();
    const collection = jest.fn(() => ({ doc: jest.fn() }));
    const doc = jest.fn(() => ({ set, collection }));

    const collectionFromFirestoreSpy = jest
      .spyOn(firestore, "collection")
      .mockReturnValue(({ doc } as unknown) as any);
    const collectionFromDocSpy = jest
      .spyOn(doc(), "collection")
      .mockReturnValue(({ doc } as unknown) as any);

    await sut.savePurchase(purchase);
    expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(1, "COMPRAS");
    expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(2, "COMPRAS");
    expect(collectionFromDocSpy).toHaveBeenCalledWith("COMPLETA");
    expect(set).toHaveBeenNthCalledWith(1, {
      userDocId: "userId",
    });
    expect(set).toHaveBeenNthCalledWith(2, purchase);
  });
  it("should save purchase resume", async () => {
    const set = jest.fn();
    const collection = jest.fn(() => ({ doc: jest.fn() }));
    const doc = jest.fn(() => ({ set, collection }));

    const collectionFromFirestoreSpy = jest
      .spyOn(firestore, "collection")
      .mockReturnValue(({ doc } as unknown) as any);
    const collectionFromDocSpy = jest
      .spyOn(doc(), "collection")
      .mockReturnValue(({ doc } as unknown) as any);

    await sut.savePurchaseResume(resume);
    expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(1, "COMPRAS");
    expect(collectionFromFirestoreSpy).toHaveBeenNthCalledWith(2, "COMPRAS");
    expect(collectionFromDocSpy).toHaveBeenCalledWith("RESUMIDA");
    expect(set).toHaveBeenNthCalledWith(1, resume);
  });
  it("should throw PurchaseException on error on save purchase", async () => {
    jest.spyOn(firestore, "collection").mockImplementation((_) => {
      throw "Error";
    });
    await expect(sut.savePurchase(purchase)).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });

  it("should throw PurchaseException on error on save purchase resume", async () => {
    jest.spyOn(firestore, "collection").mockImplementation((_) => {
      throw "Error";
    });
    await expect(sut.savePurchaseResume(resume)).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
});
