import { Product } from "../../../model/Product";

export interface ProductNormalizationRepository {
  normalizeProduct: (product: Product) => Promise<Product>;
}
