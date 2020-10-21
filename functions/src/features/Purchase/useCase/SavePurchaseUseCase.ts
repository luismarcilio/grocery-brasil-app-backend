import { UseCase } from "../../../core/UseCase";
import { Purchase } from "../../../model/Purchase";
import { PurchaseException } from "../../../core/ApplicationException";
import { PurchaseService } from "../service/PurchaseService";

export class SavePurchaseUseCase implements UseCase<boolean> {
  private readonly purchaseService: PurchaseService;
  constructor(purchaseService: PurchaseService) {
    this.purchaseService = purchaseService;
  }

  execute = (purchase: Purchase): Promise<boolean | PurchaseException> => {
    return this.purchaseService.save(purchase);
  };
}
