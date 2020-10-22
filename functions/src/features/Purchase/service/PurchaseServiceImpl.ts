import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { Purchase, PurchaseResume } from "../../../model/Purchase";
import { PurchaseService } from "./PurchaseService";
import { ProductService } from "../../Product/service/ProductService";
import { PurchaseProvider } from "../provider/PurchaseProvider";

export class PurchaseServiceImpl implements PurchaseService {
  purchaseProvider: PurchaseProvider;
  productService: ProductService;

  constructor(
    purchaseProvider: PurchaseProvider,
    productService: ProductService
  ) {
    this.productService = productService;
    this.purchaseProvider = purchaseProvider;
  }

  save = async (purchase: Purchase): Promise<boolean | PurchaseException> => {
    try {
      if (
        (await this.saveFull(purchase)) &&
        (await this.saveResume(purchase)) &&
        (await this.saveItems(purchase))
      ) {
        return true;
      }
      return false;
    } catch (error) {
      if (error.constructor.name === "PurchaseException") {
        return error;
      }
      return new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  };

  private saveFull = async (purchase: Purchase): Promise<boolean> => {
    const result = await this.purchaseProvider.save(purchase);
    return result;
  };

  private saveResume = async (purchase: Purchase): Promise<boolean> => {
    const purchaseResume: PurchaseResume = {
      user: purchase.user,
      accessKey: purchase.fiscalNote.accessKey,
      company: purchase.fiscalNote.company,
      totalAmount: purchase.totalAmount,
      date: purchase.fiscalNote.date,
    };
    const result = await this.purchaseProvider.saveResume(purchaseResume);
    return result;
  };

  private saveItems = async (purchase: Purchase): Promise<boolean> => {
    const result = await this.productService.saveItemsFromPurchase(purchase);
    if (typeof result !== "boolean") {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: result.message,
      });
    }
    return result;
  };
}
