import { UseCase } from "../../../core/UseCase";
import { Product } from "../../../model/Product";
import { ProductException } from "../../../core/ApplicationException";
import { ProductServiceUploadSearchEngine } from "../service/ProductService";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class UploadToTextSearchEngineUseCase implements UseCase<Product> {
  private readonly productService: ProductServiceUploadSearchEngine;

  constructor(productService: ProductServiceUploadSearchEngine) {
    this.productService = productService;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(p: Product): Promise<Product | ProductException> {
    try {
      return await this.productService.uploadToSearchEngine(p);
    } catch (error) {
      return errorToApplicationException(error, ProductException);
    }
  }
}
