import { UseCase } from "../../../core/UseCase";
import { Product } from "../../../model/Product";
import { ProductException } from "../../../core/ApplicationException";
import { ProductServiceUploadThumbnail } from "../service/ProductService";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class UploadThumbnailUseCase implements UseCase<Product> {
  private readonly productService: ProductServiceUploadThumbnail;
  constructor(productService: ProductServiceUploadThumbnail) {
    this.productService = productService;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(p: Product): Promise<Product | ProductException> {
    try {
      const updatedProduct = await this.productService.uploadThumbnail(p);
      return updatedProduct;
    } catch (error) {
      return errorToApplicationException(error, ProductException);
    }
  }
}
