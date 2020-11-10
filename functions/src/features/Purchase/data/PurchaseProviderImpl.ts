import { PurchaseProvider } from "../provider/PurchaseProvider";
import { Purchase, PurchaseResume } from "../../../model/Purchase";
import { PurchaseRepository } from "./PurchaseRepository";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { withLog, loggerLevel } from "../../../core/Logging";

export class PurchaseProviderImpl implements PurchaseProvider {
  private readonly purchaseRepository: PurchaseRepository;
  constructor(purchaseRepository: PurchaseRepository) {
    this.purchaseRepository = purchaseRepository;
  }

  @withLog(loggerLevel.DEBUG)
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
  @withLog(loggerLevel.DEBUG)
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
