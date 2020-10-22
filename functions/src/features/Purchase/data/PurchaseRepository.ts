import { Purchase, PurchaseResume } from "../../../model/Purchase";

export interface PurchaseRepository {
  savePurchase: (purchase: Purchase) => Promise<boolean>;
  savePurchaseResume: (purchaseResume: PurchaseResume) => Promise<boolean>;
}
