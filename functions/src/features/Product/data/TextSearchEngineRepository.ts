import { Product } from "../../../model/Product";

export interface TextSearchEngineRepository {
  uploadProduct: (documentId: string, product: Product) => Promise<Product>;
}
