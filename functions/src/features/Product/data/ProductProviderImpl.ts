import { ProductProvider } from "../provider/ProductProvider";
import { Product, ProductPurchase } from "../../../model/Product";
import { ProductRepository } from "./ProductRepository";
import { errorToApplicationException } from "../../../core/utils";
import { ProductException } from "../../../core/ApplicationException";

export class ProductProviderImpl implements ProductProvider {
  private readonly productRepository: ProductRepository;
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  save = async (product: Product): Promise<void> => {
    try {
      const productId = this.getDocId(product);
      await this.productRepository.save(productId, product);
      return;
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  };
  saveNf = async (
    product: Product,
    productPurchase: ProductPurchase
  ): Promise<void> => {
    try {
      const productId = this.getDocId(product);
      const purchaseId = productPurchase.accessKey;
      await this.productRepository.saveNf(
        productId,
        purchaseId,
        productPurchase
      );
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  };
  getProductById = async (docId: string): Promise<Product> => {
    try {
      return await this.productRepository.getProductById(docId);
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  };
  getDocId = (product: Product): string => {
    const normalizedItemName = product.name.replace(/[^a-zA-Z0-9]+/g, "-");
    const productDocId = !product.eanCode
      ? product.ncmCode + "-" + normalizedItemName
      : product.eanCode;
    return productDocId;
  };
}
