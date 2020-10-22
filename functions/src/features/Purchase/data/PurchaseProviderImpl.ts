import { PurchaseProvider } from "../provider/PurchaseProvider";
import { Purchase, PurchaseResume } from "../../../model/Purchase";
import { PurchaseRepository } from "./PurchaseRepository";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";

export class PurchaseProviderImpl implements PurchaseProvider {
  private readonly purchaseRepository: PurchaseRepository;
  constructor(purchaseRepository: PurchaseRepository) {
    this.purchaseRepository = purchaseRepository;
  }

  save = async (purchase: Purchase): Promise<boolean> => {
    try {
      return await this.purchaseRepository.savePurchase(purchase);
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
      return await this.purchaseRepository.savePurchaseResume(purchaseResume);
    } catch (error) {
      console.log("PurchaseException thrown");
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  };
}