import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";
import { PurchaseException } from "../../../core/ApplicationException";
import { PurchaseService } from "../service/PurchaseService";
import { withLog, loggerLevel } from "../../../core/Logging";

export class SavePurchaseUseCase implements UseCase<boolean> {
  private readonly purchaseService: PurchaseService;
  constructor(purchaseService: PurchaseService) {
    this.purchaseService = purchaseService;
  }

  @withLog(loggerLevel.DEBUG)
  async execute(purchase: Purchase): Promise<boolean | PurchaseException> {
    return this.purchaseService.save(purchase);
  }
}
