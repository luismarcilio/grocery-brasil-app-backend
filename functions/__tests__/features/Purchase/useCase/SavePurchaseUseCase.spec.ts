import { Purchase } from "../../../../src/model/Purchase";
import { PurchaseException } from "../../../../src/core/ApplicationException";
import { PurchaseService } from "../../../../src/features/Purchase/service/PurchaseService";
import { SavePurchaseUseCase } from "../../../../src/features/Purchase/useCase/SavePurchaseUseCase";

describe("Save purchase", () => {
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
    purchaseItemList: [],
  };

  class PurchaseServiceStub implements PurchaseService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    save = (purchase: Purchase): Promise<boolean | PurchaseException> => {
      return Promise.resolve(true);
    };
  }

  const purchaseServiceStub = new PurchaseServiceStub();
  it("should save purchase", async () => {
    const sut = new SavePurchaseUseCase(purchaseServiceStub);
    const actual = await sut.execute(purchase);
    expect(actual).toEqual(true);
  });
});
