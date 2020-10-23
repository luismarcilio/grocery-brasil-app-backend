import { ProductService } from "./ProductService";
import {
  ProductException,
  MessageIds,
} from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";
import { ProductProvider } from "../provider/ProductProvider";
import { ProductPurchase } from "../../../model/Product";

export class ProductServiceImpl implements ProductService {
  private readonly productProvider: ProductProvider;

  constructor(productProvider: ProductProvider) {
    this.productProvider = productProvider;
  }

  saveItemsFromPurchase = async (
    purchase: Purchase
  ): Promise<boolean | ProductException> => {
    try {
      const promises = purchase.purchaseItemList.map(async (purchaseItem) => {
        const docId: string = this.productProvider.getDocId(
          purchaseItem.product
        );
        const existingProduct = await this.productProvider.getProductById(
          docId
        );
        if (!existingProduct) {
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
      return Promise.resolve(this.errorToProductException(error));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private errorToProductException = (error: any): ProductException => {
    if (error.constructor.name === "ProductException") {
      return error;
    }
    return new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: error,
    });
  };
}
