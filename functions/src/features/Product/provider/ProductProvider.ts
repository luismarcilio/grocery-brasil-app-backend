import { Product, ProductPurchase } from "../../../model/Product";

export interface ProductProvider {
  save: (product: Product) => Promise<void>;
  saveNf: (product: Product, productPurchase: ProductPurchase) => Promise<void>;
  getProductById: (docId: string) => Promise<Product>;
  getDocId: (product: Product) => string;
}
