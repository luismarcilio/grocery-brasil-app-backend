import { PurchaseRepository } from "./PurchaseRepository";
import { Purchase, PurchaseResume } from "../../../model/Purchase";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { withLog, loggerLevel } from "../../../core/Logging";

export class PurchaseRepositoryFirebase implements PurchaseRepository {
  private readonly firestore: FirebaseFirestore.Firestore;
  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
  }
  @withLog(loggerLevel.DEBUG)
  async savePurchase(purchase: Purchase): Promise<boolean> {
    const userId = purchase.user?.userId;
    if (!userId) {
      throw new PurchaseException({
        messageId: MessageIds.INVALID_ARGUMENT,
        message: "undefined userId",
      });
    }
    const purchaseId = purchase.fiscalNote.accessKey;
    if (!purchaseId) {
      throw new PurchaseException({
        messageId: MessageIds.INVALID_ARGUMENT,
        message: "undefined purchaseId",
      });
    }
    try {
      const userDocRef = this.firestore.collection("COMPRAS").doc(userId);
      await userDocRef.set({ userDocId: userId });
      const dbNfDoc = this.firestore
        .collection("COMPRAS")
        .doc(userId)
        .collection("COMPLETA")
        .doc(purchaseId);

      await dbNfDoc.set(purchase);
      return true;
    } catch (error) {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  }
  @withLog(loggerLevel.DEBUG)
  async savePurchaseResume(purchaseResume: PurchaseResume): Promise<boolean> {
    const userId = purchaseResume.user?.userId;
    if (!userId) {
      throw new PurchaseException({
        messageId: MessageIds.INVALID_ARGUMENT,
        message: "undefined userId",
      });
    }

    try {
      const dbNfDoc = this.firestore
        .collection("COMPRAS")
        .doc(userId)
        .collection("RESUMIDA")
        .doc(purchaseResume.accessKey);
      await dbNfDoc?.set(purchaseResume);
      return Promise.resolve(true);
    } catch (error) {
      throw new PurchaseException({
        messageId: MessageIds.UNEXPECTED,
        message: error,
      });
    }
  }
}
