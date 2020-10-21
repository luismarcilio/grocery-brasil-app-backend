import { ProductException } from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";

export interface ProductService {
  saveItemsFromPurchase: (
    purchase: Purchase
  ) => Promise<boolean | ProductException>;
}
