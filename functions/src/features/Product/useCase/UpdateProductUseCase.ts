import { Product } from "../../../model/Product";
import { UseCase } from "../../../core/UseCase";
import { ProductException } from "../../../core/ApplicationException";
import { ProductService } from "../service/ProductService";
import { errorToApplicationException } from "../../../core/utils";

export class UpdateProductUseCase implements UseCase<Product> {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  execute = async (p: Product): Promise<Product | ProductException> => {
    try {
      const updatedProduct = await this.productService.updateProduct(p);
      return updatedProduct;
    } catch (error) {
      return errorToApplicationException(error, ProductException);
    }
  };
}
