import { ProductException } from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";
import { Product } from "../../../model/Product";

export interface ProductService {
  saveItemsFromPurchase: (
    purchase: Purchase
  ) => Promise<boolean | ProductException>;

  normalizeProduct: (product: Product) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;

  uploadThumbnail: (product: Product) => Promise<Product>;
}
