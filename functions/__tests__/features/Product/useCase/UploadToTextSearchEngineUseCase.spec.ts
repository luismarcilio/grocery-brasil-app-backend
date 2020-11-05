import { Product } from "../../../../src/model/Product";
import { UseCase } from "../../../../src/core/UseCase";
import { ProductServiceUploadSearchEngine } from "../../../../src/features/Product/service/ProductService";
import { product } from "../fixture/product";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { UploadToTextSearchEngineUseCase } from "../../../../src/features/Product/useCase/UploadToTextSearchEngineUseCase";

describe("UploadToTextSearchEngine", () => {
  const uploadToSearchEngine = jest.fn();
  const productService: ProductServiceUploadSearchEngine = {
    uploadToSearchEngine,
  };
  const sut: UseCase<Product> = new UploadToTextSearchEngineUseCase(
    productService
  );

  it("should upload to text search engine", async () => {
    const expected = { ...product };
    uploadToSearchEngine.mockResolvedValue(expected);

    const actual = await sut.execute(product);
    expect(actual).toEqual(expected);
    expect(uploadToSearchEngine).toHaveBeenCalledWith(product);
  });
  it("should return error if it fails", async () => {
    const someException = new Error("error");
    uploadToSearchEngine.mockRejectedValue(someException);

    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    const actual = await sut.execute(product);
    expect(actual).toEqual(expected);
  });
});
