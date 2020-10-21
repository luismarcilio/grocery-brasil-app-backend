import { Purchase, PurchaseResume } from "../../../model/Purchase";

export interface PurchaseProvider {
  save: (purchase: Purchase) => Promise<boolean>;
  saveResume: (purchaseResume: PurchaseResume) => Promise<boolean>;
}
