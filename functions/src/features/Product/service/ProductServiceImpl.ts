import { ProductService } from "./ProductService";
import { ProductException } from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";
import { ProductProvider } from "../provider/ProductProvider";
import { ProductPurchase, Product } from "../../../model/Product";
import { errorToApplicationException } from "../../../core/utils";
import { ThumbnailFacade } from "../provider/ThumbnailFacade";
import { withLog, loggerLevel } from "../../../core/Logging";

export class ProductServiceImpl implements ProductService {
  private readonly productProvider: ProductProvider;
  private readonly thumbnailFacade: ThumbnailFacade;

  constructor(
    productProvider: ProductProvider,
    thumbnailFacade: ThumbnailFacade
  ) {
    this.productProvider = productProvider;
    this.thumbnailFacade = thumbnailFacade;
  }
  @withLog(loggerLevel.DEBUG)
  async uploadToSearchEngine(product: Product): Promise<Product> {
    try {
      return await this.productProvider.uploadToSearchEngine(product);
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async uploadThumbnail(product: Product): Promise<Product> {
    try {
      const updatedProduct = await this.thumbnailFacade.uploadThumbnail(
        product
      );
      return updatedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async normalizeProduct(product: Product): Promise<Product> {
    if (!product.eanCode) {
      return Promise.resolve(product);
    }

    try {
      const normalizedProduct = await this.productProvider.normalizeProduct(
        product
      );
      return normalizedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async updateProduct(product: Product): Promise<Product> {
    try {
      const updatedProduct = await this.productProvider.updateProduct(product);
      return updatedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }

  @withLog(loggerLevel.DEBUG)
  async saveItemsFromPurchase(
    purchase: Purchase
  ): Promise<boolean | ProductException> {
    try {
      const promises = purchase.purchaseItemList.map(async (purchaseItem) => {
        const docId: string = this.productProvider.getDocId(
          purchaseItem.product
        );
        try {
          await this.productProvider.getProductById(docId);
        } catch (error) {
          await this.productProvider.save(purchaseItem.product);
        }
        const productPurchase: ProductPurchase = {
          accessKey: purchase.fiscalNote.accessKey,
          company: purchase.fiscalNote.company,
          unityValue: purchaseItem.unityValue,
          date: purchase.fiscalNote.date,
        };
        await this.productProvider.saveNf(
          purchaseItem.product,
          productPurchase
        );
      });
      await Promise.all(promises);
      return true;
    } catch (error) {
      return Promise.resolve(
        errorToApplicationException(error, ProductException)
      );
    }
  }
}
