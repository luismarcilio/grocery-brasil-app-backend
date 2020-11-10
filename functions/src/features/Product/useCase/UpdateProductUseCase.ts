import { Product } from "../../../model/Product";
import { UseCase } from "../../../core/UseCase";
import { ProductException } from "../../../core/ApplicationException";
import { ProductServiceUpdateProduct } from "../service/ProductService";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class UpdateProductUseCase implements UseCase<Product> {
  private readonly productService: ProductServiceUpdateProduct;
  constructor(productService: ProductServiceUpdateProduct) {
    this.productService = productService;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(p: Product): Promise<Product | ProductException> {
    try {
      const updatedProduct = await this.productService.updateProduct(p);
      return updatedProduct;
    } catch (error) {
      return errorToApplicationException(error, ProductException);
    }
  }
}
