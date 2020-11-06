import { DatabaseTrigger } from "./DatabaseTrigger";
import { Product } from "../../model/Product";
import { NormalizeProductUseCase } from "../../features/Product/useCase/NormalizeProductUseCase";
import { UploadThumbnailUseCase } from "../../features/Product/useCase/UploadThumbnailUseCase";
import { ProductException } from "../../core/ApplicationException";
import { errorToApplicationException } from "../../core/utils";
export class NormalizeProductAndUploadThumbnailTrigger
  implements DatabaseTrigger<Product> {
  private readonly normalizeProductUseCase: NormalizeProductUseCase;
  private readonly uploadThumbnailUseCase: UploadThumbnailUseCase;

  constructor(
    normalizeProductUseCase: NormalizeProductUseCase,
    uploadThumbnailUseCase: UploadThumbnailUseCase
  ) {
    this.normalizeProductUseCase = normalizeProductUseCase;
    this.uploadThumbnailUseCase = uploadThumbnailUseCase;
  }

  call = async (input: Product): Promise<Product | null> => {
    try {
      if (!input) {
        return Promise.resolve(null);
      }
      if (input.normalized) {
        return Promise.resolve(null);
      }
      const result = await this.normalizeProductUseCase.execute(input);
      if (result instanceof ProductException) {
        throw result;
      }
      if (!result.thumbnail) {
        return Promise.resolve(null);
      }
      const normalizedProduct = <Product>result;
      const thumbnailUploaded = await this.uploadThumbnailUseCase.execute(
        normalizedProduct
      );
      if (thumbnailUploaded instanceof ProductException) {
        throw result;
      }

      thumbnailUploaded.normalized = true;
      return thumbnailUploaded;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  };
}
