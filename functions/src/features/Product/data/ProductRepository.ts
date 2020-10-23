import { Product, ProductPurchase } from "../../../model/Product";

export interface ProductRepository {
  save: (productId: string, product: Product) => Promise<void>;
  saveNf: (
    productId: string,
    product: Product,
    nfId: string,
    productPurchase: ProductPurchase
  ) => Promise<void>;
  getProductById: (productId: string) => Promise<Product>;
}
