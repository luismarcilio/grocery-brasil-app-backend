import { Purchase, PurchaseResume } from "../model/Purchase";
import admin = require("firebase-admin");
import { logger } from "../logger";


export class PurchaseRepositoryError extends Error { }

export abstract class PurchaseRepository {
    abstract async setFullPurchase(_: { purchase: Purchase, userDocId: string, purchaseDocId: string }): Promise<void>;
    abstract async setResumePurchase(_: { purchaseResume: PurchaseResume, userDocId: string, purchaseDocId: string }): Promise<void>;
    abstract async updatePurchase(_: { purchase: Purchase, userDocId: string, purchaseDocId: string }): Promise<void>;
    abstract async deletePurchaseById(docId: string): Promise<void>;
    abstract async getResumedPurchasesByUserId(userId: string): Promise<Purchase[]>;
    abstract async getPurchasesByUserIdAndPurchaseId(userId: string, PurchaseId: string): Promise<Purchase[]>;
    abstract async getPurchaseById(purchaseDocId: string): Promise<Purchase>;
}

export class FirebasePurchaseRepository extends PurchaseRepository {
    private static _instance: FirebasePurchaseRepository;
    private _db: FirebaseFirestore.Firestore | undefined;
    private constructor() {
        super();
        this._db = admin.firestore()
    }
    public static getInstance(): FirebasePurchaseRepository {
        if (!this._instance) {
            this._instance = new FirebasePurchaseRepository();
        }
        return this._instance;
    }


    async setFullPurchase(_: { purchase: Purchase, userDocId: string, purchaseDocId: string }): Promise<void> {
        console.log('setFullPurchase 1')
        const userDocRef = this._db?.collection('COMPRAS').doc(_.userDocId);
        await userDocRef?.set({ userDocId: _.userDocId });
        const dbNfDoc = this._db?.collection('COMPRAS').doc(_.userDocId).collection('COMPLETA').doc(_.purchaseDocId);
        console.log('setFullPurchase 2')
        const writeResult = await dbNfDoc?.set(_.purchase);
        console.log('setFullPurchase 3')
        logger.info('saveNfFull(nf: Purchase)', writeResult);
    }


    async setResumePurchase(_: { purchaseResume: PurchaseResume, userDocId: string, purchaseDocId: string }): Promise<void> {
        const dbNfDoc = this._db?.collection('COMPRAS').doc(_.userDocId).collection('RESUMIDA').doc(_.purchaseDocId);
        const writeResult = await dbNfDoc?.set(_.purchaseResume);
        logger.info('saveNfResume(nf: Purchase)', JSON.stringify(writeResult));
    }


    async updatePurchase(_: { purchase: Purchase, userDocId: string, purchaseDocId: string }): Promise<void> {
        const dbNfDoc = this._db?.collection('COMPRAS').doc(_.userDocId).collection('COMPLETA').doc(_.purchaseDocId);
        const writeResult = await dbNfDoc?.update(_.purchase);
        logger.info('saveNfFull(nf: Purchase)', writeResult);
    }
    deletePurchaseById(docId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getResumedPurchasesByUserId(userId: string): Promise<Purchase[]> {
        throw new Error("Method not implemented.");
    }
    getPurchasesByUserIdAndPurchaseId(userId: string, PurchaseId: string): Promise<Purchase[]> {
        throw new Error("Method not implemented.");
    }
    async getPurchaseById(purchaseDocId: string): Promise<Purchase> {
        const dbNfDoc = await this._db?.collectionGroup('COMPLETA').where('fiscalNote.accessKey', '==', purchaseDocId).get();
        if (!dbNfDoc?.docs?.length || dbNfDoc.docs.length === 0) {
            throw new PurchaseRepositoryError(`getPurchaseById(${purchaseDocId}): Not Found`);
        }
        if (dbNfDoc.docs.length > 1) {
            throw new PurchaseRepositoryError(`getPurchaseById(${purchaseDocId}): Too many rows`);
        }
        const purchase: Purchase = <Purchase>dbNfDoc.docs[0].data();
        return purchase;
    }

}