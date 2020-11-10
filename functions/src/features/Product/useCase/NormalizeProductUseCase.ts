import { Product } from "../../../model/Product";
import { UseCase } from "../../../core/UseCase";
import { ProductException } from "../../../core/ApplicationException";
import { ProductServiceNormalizeProduct } from "../service/ProductService";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class NormalizeProductUseCase implements UseCase<Product> {
  private readonly productService: ProductServiceNormalizeProduct;
  constructor(productService: ProductServiceNormalizeProduct) {
    this.productService = productService;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(p: Product): Promise<Product | ProductException> {
    try {
      const normProduct = await this.productService.normalizeProduct(p);
      return normProduct;
    } catch (error) {
      return errorToApplicationException(error, ProductException);
    }
  }
}
