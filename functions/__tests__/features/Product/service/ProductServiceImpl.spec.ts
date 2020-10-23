import { ProductService } from "../../../../src/features/Product/service/ProductService";
import { ProductProvider } from "../../../../src/features/Product/provider/ProductProvider";
import { purchase } from "../../Purchase/fixtures/purchases";
import { ProductServiceImpl } from "../../../../src/features/Product/service/ProductServiceImpl";
import { ProductPurchase } from "../../../../src/model/Product";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("ProductService implementation", () => {
  const save = jest.fn();
  const saveNf = jest.fn();
  const getProductById = jest.fn();
  const getDocId = jest.fn();
  const productProviderStub: ProductProvider = {
    save,
    saveNf,
    getProductById,
    getDocId,
  };
  const sut: ProductService = new ProductServiceImpl(productProviderStub);

  it("should save each product", async () => {
    jest.resetAllMocks();
    jest.spyOn(productProviderStub, "save").mockResolvedValue();
    jest.spyOn(productProviderStub, "saveNf").mockResolvedValue();
    jest.spyOn(productProviderStub, "getDocId").mockReturnValueOnce("00001");
    jest
      .spyOn(productProviderStub, "getDocId")
      .mockReturnValueOnce("00002-product-2");

    jest
      .spyOn(productProviderStub, "getProductById")
      .mockRejectedValue(
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

    jest
      .spyOn(productProviderStub, "getProductById")
      .mockRejectedValue(new ProductException({messageId: MessageIds.NOT_FOUND, message: 'Product not found'}));
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

    jest
      .spyOn(productProviderStub, "getProductById")
      .mockRejectedValue(
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
      },
      {
        accessKey: purchase.fiscalNote.accessKey,
        company: purchase.fiscalNote.company,
        date: purchase.fiscalNote.date,
        unityValue: purchase.purchaseItemList[1].unityValue,
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

    jest
      .spyOn(productProviderStub, "getProductById")
      .mockRejectedValue(
        new ProductException({
          messageId: MessageIds.NOT_FOUND,
          message: "Product not found",
        })
      );    const actual = await sut.saveItemsFromPurchase(purchase);
    expect(actual).toEqual(
      new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
});
