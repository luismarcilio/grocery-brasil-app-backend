import { ProductProvider } from "../provider/ProductProvider";
import { Product, ProductPurchase } from "../../../model/Product";
import { ProductRepository } from "./ProductRepository";
import { errorToApplicationException } from "../../../core/utils";
import { ProductException } from "../../../core/ApplicationException";
import { ProductNormalizationRepository } from "./ProductNormalizationRepository";
import { TextSearchEngineRepository } from "./TextSearchEngineRepository";

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
  uploadToSearchEngine = async (product: Product): Promise<Product> => {
    try {
      return await this.textSearchEngineRepository.uploadProduct(product);
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  };
  updateProduct = async (product: Product): Promise<Product> => {
    try {
      const productId = this.getDocId(product);
      await this.productRepository.save(productId, product);
      return product;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  };
  normalizeProduct = async (product: Product): Promise<Product> => {
    try {
      const normalizedProduct = await this.productNormalizationRepository.normalizeProduct(
        product
      );
      return normalizedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  };

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
