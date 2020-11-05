import { UseCase } from "../../../../src/core/UseCase";
import { Product } from "../../../../src/model/Product";
import { ProductServiceNormalizeProduct } from "../../../../src/features/Product/service/ProductService";
import { NormalizeProductUseCase } from "../../../../src/features/Product/useCase/NormalizeProductUseCase";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("Normalize product data", () => {
  const normalizeProduct = jest.fn();

  const productService: ProductServiceNormalizeProduct = {
    normalizeProduct,
  };
  const sut: UseCase<Product> = new NormalizeProductUseCase(productService);

  const expected: Product = {
    name: "someNormalizedProduct",
    eanCode: "12038974012",
    ncmCode: "098741",
    unity: { name: "UN" },
  };

  const input: Product = {
    name: "someProduct",
    eanCode: "12038974012",
    ncmCode: "098741",
    unity: { name: "UN" },
  };

  it("should retrieve normalized product", async () => {
    normalizeProduct.mockResolvedValue(expected);
    const actual = await sut.execute(input);
    expect(actual).toEqual(expected);
    expect(normalizeProduct).toHaveBeenCalledWith(input);
  });
  it("should update the product name retrieved", async () => {
    normalizeProduct.mockResolvedValue(expected);
    const actual = await sut.execute(input);
    expect(actual).toEqual(expected);
  });
  it("should return ProductException case of error", async () => {
    const someException = new Error("error");
    const expectedException = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    normalizeProduct.mockRejectedValue(someException);
    const actual = await sut.execute(input);
    expect(actual).toEqual(expectedException);
  });
});
