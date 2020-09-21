import { Product } from "./Product";
import { Unity } from "./Unity";

export type PurchaseItem = {
  product: Product;
  unity: Unity;
  unityValue: number;
  units: number;
  totalValue: number;
}
