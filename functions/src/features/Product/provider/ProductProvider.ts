import { Product, ProductPurchase } from "../../../model/Product";

export interface ProductProviderUploadSearchEngine {
  uploadToSearchEngine: (product: Product) => Promise<Product>;
}

export interface ProductProviderUpdateProduct {
  updateProduct: (product: Product) => Promise<Product>;
}

export interface ProductProviderNormalizeProduct {
  normalizeProduct: (product: Product) => Promise<Product>;
}

export interface ProductProvider
  extends ProductProviderUploadSearchEngine,
    ProductProviderUpdateProduct,
    ProductProviderNormalizeProduct {
  save: (product: Product) => Promise<void>;
  saveNf: (product: Product, productPurchase: ProductPurchase) => Promise<void>;
  getProductById: (docId: string) => Promise<Product|null>;
  getDocId: (product: Product) => string;
}
