import { ProductException } from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";
import { Product } from "../../../model/Product";

export interface ProductServiceUploadSearchEngine {
  uploadToSearchEngine: (product: Product) => Promise<Product>;
}

export interface ProductServiceUpdateProduct {
  updateProduct: (product: Product) => Promise<Product>;
}

export interface ProductServiceUploadThumbnail {
  uploadThumbnail: (product: Product) => Promise<Product>;
}

export interface ProductServiceNormalizeProduct {
  normalizeProduct: (product: Product) => Promise<Product>;
}

export interface ProductService
  extends ProductServiceUpdateProduct,
    ProductServiceUploadThumbnail,
    ProductServiceNormalizeProduct,
    ProductServiceUploadSearchEngine {
  saveItemsFromPurchase: (
    purchase: Purchase
  ) => Promise<boolean | ProductException>;
}
