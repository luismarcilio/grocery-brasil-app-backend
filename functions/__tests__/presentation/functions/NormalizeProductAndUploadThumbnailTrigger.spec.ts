import { DatabaseTrigger } from "../../../src/presentation/functions/DatabaseTrigger";
import { Product } from "../../../src/model/Product";
import { product } from "../../features/Product/fixture/product";
import {
  ProductException,
  MessageIds,
} from "../../../src/core/ApplicationException";
import { NormalizeProductUseCase } from "../../../src/features/Product/useCase/NormalizeProductUseCase";
import { UploadThumbnailUseCase } from "../../../src/features/Product/useCase/UploadThumbnailUseCase";
import { NormalizeProductAndUploadThumbnailTrigger } from "../../../src/presentation/functions/NormalizeProductAndUploadThumbnailTrigger";

describe("NormalizeProductAndUploadThumbnailTrigger", () => {
  const executeNormalizeProduct = jest.fn();

  const normalizeProductUseCase: NormalizeProductUseCase = ({
    execute: executeNormalizeProduct,
  } as unknown) as NormalizeProductUseCase;

  const executeUploadThumbnail = jest.fn();

  const uploadThumbnailUseCase: UploadThumbnailUseCase = ({
    execute: executeUploadThumbnail,
  } as unknown) as UploadThumbnailUseCase;

  const sut: DatabaseTrigger<Product> = new NormalizeProductAndUploadThumbnailTrigger(
    normalizeProductUseCase,
    uploadThumbnailUseCase
  );
  beforeEach(() => jest.clearAllMocks());
  it("should check if document is available. return null if not", async () => {
    const someProduct = (undefined as unknown) as Product;
    const actual = await sut.call(someProduct);
    expect(actual).toBeNull();
  });
  it("should check if document is normalized. return null if it is", async () => {
    const someProduct = { ...product };
    someProduct.normalized = true;
    const actual = await sut.call(someProduct);
    expect(actual).toBeNull();
  });
  it("should normalize the product and upload thumbnail", async () => {
    const someProduct = { ...product };
    someProduct.thumbnail = undefined;
    const beforeThumbnailUpload = { ...product };
    beforeThumbnailUpload.thumbnail = "some thumbnail";
    beforeThumbnailUpload.name = "normalized name";
    const afterThumbnailUpload = { ...beforeThumbnailUpload };
    afterThumbnailUpload.thumbnail =
      "https://storage.cloud.google.com/grocery-brasil-app-thumbnails/images.jpeg";

    executeNormalizeProduct.mockResolvedValue(beforeThumbnailUpload);
    executeUploadThumbnail.mockResolvedValue(afterThumbnailUpload);
    const actual = await sut.call(someProduct);
    expect(actual).toEqual(afterThumbnailUpload);
    expect(executeNormalizeProduct).toHaveBeenCalledWith(someProduct);
    expect(executeUploadThumbnail).toHaveBeenCalledWith(beforeThumbnailUpload);
  });
  it("should check if thumbnail url is available", async () => {
    const someProduct = { ...product };
    someProduct.thumbnail = undefined;
    const beforeThumbnailUpload = { ...product };
    beforeThumbnailUpload.thumbnail = undefined;
    executeNormalizeProduct.mockResolvedValue(beforeThumbnailUpload);
    const actual = await sut.call(someProduct);
    expect(actual).toBeNull();
    expect(executeNormalizeProduct).toHaveBeenCalledWith(someProduct);
    expect(executeUploadThumbnail).not.toHaveBeenCalled();
  });

  it("should throw ProductException if an error occurs", async () => {
    const someException = new Error("error");
    const someProduct = { ...product };

    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    executeNormalizeProduct.mockRejectedValue(someException);

    await expect(sut.call(someProduct)).rejects.toEqual(expected);
  });
});
