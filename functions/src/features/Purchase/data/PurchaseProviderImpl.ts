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

  async save(purchase: Purchase): Promise<boolean> {
    try {
      return await this.purchaseRepository.savePurchase(purchase);
    } catch (error) {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  }
  async saveResume(purchaseResume: PurchaseResume): Promise<boolean> {
    try {
      return await this.purchaseRepository.savePurchaseResume(purchaseResume);
    } catch (error) {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  }
}
