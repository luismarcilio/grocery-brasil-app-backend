import { UseCase } from "../../../../src/core/UseCase";
import { Product } from "../../../../src/model/Product";
import { ProductService } from "../../../../src/features/Product/service/ProductService";
import { UpdateProductUseCase } from "../../../../src/features/Product/useCase/UpdateProductUseCase";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("Update product data", () => {
  const saveItemsFromPurchase = jest.fn();
  const normalizeProduct = jest.fn();
  const updateProduct = jest.fn();
  const uploadThumbnail = jest.fn();

  const productService: ProductService = {
    saveItemsFromPurchase,
    normalizeProduct,
    updateProduct,
    uploadThumbnail,
  };
  const sut: UseCase<Product> = new UpdateProductUseCase(productService);

  const input: Product = {
    name: "someProduct",
    eanCode: "12038974012",
    ncmCode: "098741",
    unity: { name: "UN" },
  };

  it("should update the product name retrieved", async () => {
    updateProduct.mockResolvedValue(input);
    const actual = await sut.execute(input);
    expect(actual).toEqual(input);
    expect(updateProduct).toHaveBeenCalledWith(input);
  });
  it("should return ProductException case of error", async () => {
    const someException = new Error("error");
    const expectedException = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    updateProduct.mockRejectedValue(someException);

    const actual = await sut.execute(input);
    expect(actual).toEqual(expectedException);
  });
});
