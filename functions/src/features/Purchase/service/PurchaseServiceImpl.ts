import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { Purchase, PurchaseResume } from "../../../model/Purchase";
import { PurchaseService } from "./PurchaseService";
import { ProductService } from "../../Product/service/ProductService";
import { PurchaseProvider } from "../provider/PurchaseProvider";
import { withLog, loggerLevel } from "../../../core/Logging";
import { AddressProvider } from "../../Address/provider/AddressProvider";

export class PurchaseServiceImpl implements PurchaseService {
  purchaseProvider: PurchaseProvider;
  productService: ProductService;
  addressProvider: AddressProvider;

  constructor(
    purchaseProvider: PurchaseProvider,
    productService: ProductService,
    addressProvider: AddressProvider
  ) {
    this.productService = productService;
    this.purchaseProvider = purchaseProvider;
    this.addressProvider = addressProvider;
  }

  @withLog(loggerLevel.DEBUG)
  async save(purchase: Purchase): Promise<boolean | PurchaseException> {
    try {
      const fullAddress = await this.addressProvider.getAddressFromRawAddress(
        purchase.fiscalNote.company.address.rawAddress
      );
      purchase.fiscalNote.company.address = fullAddress;
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
  }

  @withLog(loggerLevel.DEBUG)
  private async saveFull(purchase: Purchase): Promise<boolean> {
    const fullAddress = await this.purchaseProvider.save(purchase);
    return fullAddress;
  }

  private async saveResume(purchase: Purchase): Promise<boolean> {
    const purchaseResume: PurchaseResume = {
      user: purchase.user,
      accessKey: purchase.fiscalNote.accessKey,
      company: purchase.fiscalNote.company,
      totalAmount: purchase.totalAmount,
      date: purchase.fiscalNote.date,
    };
    const fullAddress = await this.purchaseProvider.saveResume(purchaseResume);
    return fullAddress;
  }

  @withLog(loggerLevel.DEBUG)
  private async saveItems(purchase: Purchase): Promise<boolean> {
    const fullAddress = await this.productService.saveItemsFromPurchase(
      purchase
    );
    if (typeof fullAddress !== "boolean") {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: fullAddress.message,
      });
    }
    return fullAddress;
  }
}
