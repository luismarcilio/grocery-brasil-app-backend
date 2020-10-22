/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseProvider } from "../../../../src/features/Purchase/provider/PurchaseProvider";
import { PurchaseRepository } from "../../../../src/features/Purchase/data/PurchaseRepository";
import { PurchaseProviderImpl } from "../../../../src/features/Purchase/data/PurchaseProviderImpl";
import { Purchase, PurchaseResume } from "../../../../src/model/Purchase";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { purchase, resume } from "../fixtures/purchases";

class PurchaseRepositoryStub implements PurchaseRepository {
  savePurchase = (purchase: Purchase): Promise<boolean> =>
    Promise.resolve(true);
  savePurchaseResume = (resume: PurchaseResume): Promise<boolean> =>
    Promise.resolve(true);
}

describe("Name of the group", () => {
  const purchaseRepositoryStub: PurchaseRepositoryStub = new PurchaseRepositoryStub();
  const sut: PurchaseProvider = new PurchaseProviderImpl(
    purchaseRepositoryStub
  );

  it("should call savePurchase on dao", async () => {
    const savePurchaseSpy = jest.spyOn(purchaseRepositoryStub, "savePurchase");
    const actual = await sut.save(purchase);
    expect(actual).toEqual(true);
    expect(savePurchaseSpy).toHaveBeenCalledWith(purchase);
  });

  it("should call savePurchaseResume on dao", async () => {
    const savePurchaseSpy = jest.spyOn(
      purchaseRepositoryStub,
      "savePurchaseResume"
    );
    const actual = await sut.saveResume(resume);
    expect(actual).toEqual(true);
    expect(savePurchaseSpy).toHaveBeenCalledWith(resume);
  });
  it("should throw exception if an error occurs on savePurchase", async () => {
    jest
      .spyOn(purchaseRepositoryStub, "savePurchase")
      .mockImplementationOnce((_) => {
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
      .spyOn(purchaseRepositoryStub, "savePurchaseResume")
      .mockImplementationOnce((_) => {
        throw "Error";
      });
    await expect(sut.saveResume(resume)).rejects.toEqual(
      new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
});
