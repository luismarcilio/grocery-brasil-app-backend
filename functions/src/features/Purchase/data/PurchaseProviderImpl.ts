import { PurchaseProvider } from "../provider/PurchaseProvider";
import { Purchase, PurchaseResume } from "../../../model/Purchase";
import { PurchaseDAO } from "./PurchaseDAO";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";

export class PurchaseProviderImpl implements PurchaseProvider {
  private readonly purchaseDAO: PurchaseDAO;
  constructor(purchaseDAO: PurchaseDAO) {
    this.purchaseDAO = purchaseDAO;
  }

  save = async (purchase: Purchase): Promise<boolean> => {
    try {
      return await this.purchaseDAO.savePurchase(purchase);
    } catch (error) {
      console.log("PurchaseException thrown");
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  };
  saveResume = async (purchaseResume: PurchaseResume): Promise<boolean> => {
    try {
      return await this.purchaseDAO.savePurchaseResume(purchaseResume);
    } catch (error) {
      console.log("PurchaseException thrown");
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  };
}
