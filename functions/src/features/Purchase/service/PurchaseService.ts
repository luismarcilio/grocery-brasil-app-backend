import { PurchaseException } from "../../../core/ApplicationException";
import { Purchase } from "../../../model/Purchase";

export interface PurchaseService {
  save: (purchase: Purchase) => Promise<boolean | PurchaseException>;
}
