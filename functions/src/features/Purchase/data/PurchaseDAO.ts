import { Purchase, PurchaseResume } from "../../../model/Purchase";

export interface PurchaseDAO {
  savePurchase: (purchase: Purchase) => Promise<boolean>;
  savePurchaseResume: (purchaseResume: PurchaseResume) => Promise<boolean>;
}
