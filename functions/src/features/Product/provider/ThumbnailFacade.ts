import { Product } from "../../../model/Product";

export interface ThumbnailFacade {
  uploadThumbnail: (product: Product) => Promise<Product>;
}
