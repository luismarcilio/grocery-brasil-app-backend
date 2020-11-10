import { ProductProvider } from "../provider/ProductProvider";
import { Product, ProductPurchase } from "../../../model/Product";
import { ProductRepository } from "./ProductRepository";
import { errorToApplicationException } from "../../../core/utils";
import { ProductException } from "../../../core/ApplicationException";
import { ProductNormalizationRepository } from "./ProductNormalizationRepository";
import { TextSearchEngineRepository } from "./TextSearchEngineRepository";
import { withLog, loggerLevel } from "../../../core/Logging";

export class ProductProviderImpl implements ProductProvider {
  private readonly productRepository: ProductRepository;
  private readonly productNormalizationRepository: ProductNormalizationRepository;
  private readonly textSearchEngineRepository: TextSearchEngineRepository;
  constructor(
    productRepository: ProductRepository,
    productNormalizationRepository: ProductNormalizationRepository,
    textSearchEngineRepository: TextSearchEngineRepository
  ) {
    this.productRepository = productRepository;
    this.productNormalizationRepository = productNormalizationRepository;
    this.textSearchEngineRepository = textSearchEngineRepository;
  }
  @withLog(loggerLevel.DEBUG)
  async uploadToSearchEngine(product: Product): Promise<Product> {
    try {
      const productId = this.getDocId(product);
      return await this.textSearchEngineRepository.uploadProduct(
        productId,
        product
      );
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async updateProduct(product: Product): Promise<Product> {
    try {
      const productId = this.getDocId(product);
      await this.productRepository.save(productId, product);
      return product;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async normalizeProduct(product: Product): Promise<Product> {
    try {
      const normalizedProduct = await this.productNormalizationRepository.normalizeProduct(
        product
      );
      return normalizedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }

  async save(product: Product): Promise<void> {
    try {
      const productId = this.getDocId(product);
      await this.productRepository.save(productId, product);
      return;
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  }
  async saveNf(
    product: Product,
    productPurchase: ProductPurchase
  ): Promise<void> {
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
  }
  async getProductById(docId: string): Promise<Product> {
    try {
      return await this.productRepository.getProductById(docId);
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  }
  getDocId(product: Product): string {
    const normalizedItemName = product.name.replace(/[^a-zA-Z0-9]+/g, "-");
    const productDocId = !product.eanCode
      ? product.ncmCode + "-" + normalizedItemName
      : product.eanCode;
    return productDocId;
  }
}
