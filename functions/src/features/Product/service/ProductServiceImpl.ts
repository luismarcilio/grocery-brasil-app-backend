import { ProductService } from "./ProductService";
import { ProductException } from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";
import { ProductProvider } from "../provider/ProductProvider";
import { ProductPurchase } from "../../../model/Product";
import { errorToProductException } from "../productUtils";

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
      return Promise.resolve(errorToProductException(error));
    }
  };
}
