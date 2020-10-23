import { ProductProvider } from "../provider/ProductProvider";
import { Product, ProductPurchase } from "../../../model/Product";
import { ProductRepository } from "./ProductRepository";
import { errorToProductException } from "../productUtils";

export class ProductProviderImpl implements ProductProvider {
  private readonly productRepository: ProductRepository;
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  save = async (product: Product): Promise<void> => {
    try {
      const productId = this.getDocId(product);
      return await this.productRepository.save(productId, product);
    } catch (error) {
      return Promise.reject(errorToProductException(error));
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
        product,
        purchaseId,
        productPurchase
      );
    } catch (error) {
      return Promise.reject(errorToProductException(error));
    }
  };
  getProductById = async (docId: string): Promise<Product> => {
    try {
      return await this.productRepository.getProductById(docId);
    } catch (error) {
      return Promise.reject(errorToProductException(error));
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
