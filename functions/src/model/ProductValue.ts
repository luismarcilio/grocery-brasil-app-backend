import { Company } from "./Company";
import { Product } from "./Product";

export type ProductValue = {
  company: Company;
  product: Product;
  date: Date;
  value: number;
}
