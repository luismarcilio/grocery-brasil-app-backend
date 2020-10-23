import { Product, ProductPurchase } from "../../../model/Product";

export interface ProductProvider {
  save: (product: Product) => Promise<boolean>;
  saveNf: (
    product: Product,
    productPurchase: ProductPurchase
  ) => Promise<boolean>;
  getProductById: (docId: string) => Promise<Product | undefined>;
  getDocId: (product: Product) => string;
}
