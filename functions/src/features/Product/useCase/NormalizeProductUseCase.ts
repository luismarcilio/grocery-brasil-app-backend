import { Product } from "../../../model/Product";
import { UseCase } from "../../../core/UseCase";
import { ProductException } from "../../../core/ApplicationException";
import { ProductService } from "../service/ProductService";
import { errorToApplicationException } from "../../../core/utils";

export class NormalizeProductUseCase implements UseCase<Product> {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  execute = async (p: Product): Promise<Product | ProductException> => {
    try {
      const normProduct = await this.productService.normalizeProduct(p);
      const updatedProduct = await this.productService.updateProduct(
        normProduct
      );
      return updatedProduct;
    } catch (error) {
      return errorToApplicationException(error, ProductException);
    }
  };
}
