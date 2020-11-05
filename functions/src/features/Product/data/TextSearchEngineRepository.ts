import { Product } from "../../../model/Product";

export interface TextSearchEngineRepository {
  uploadProduct: (product: Product) => Promise<Product>;
}
