import { ProductService } from "../../../../src/features/Product/service/ProductService";
import { UploadThumbnailUseCase } from "../../../../src/features/Product/useCase/UploadThumbnailUseCase";
import { UseCase } from "../../../../src/core/UseCase";
import { Product } from "../../../../src/model/Product";
import { product } from "../fixtures";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("upload thumbnail to file server", () => {
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

  const sut: UseCase<Product> = new UploadThumbnailUseCase(productService);

  it("should upload thumbnail", async () => {
    const updatedProduct = { ...product };
    updatedProduct.thumbnail = "updatedThumbnail";
    uploadThumbnail.mockResolvedValue(updatedProduct);
    const actual = await sut.execute(product);
    expect(actual).toEqual(updatedProduct);
    expect(uploadThumbnail).toHaveBeenCalledWith(product);
  });

  it("should return ProductException if an exception occurs", async () => {
    const someException = new Error("error");
    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    uploadThumbnail.mockRejectedValue(someException);
    const actual = await sut.execute(product);
    expect(actual).toEqual(expected);
  });
});
