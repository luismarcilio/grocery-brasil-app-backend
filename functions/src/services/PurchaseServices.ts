import { PurchaseRepository } from "../repository/PurchaseRepository";
import { Purchase, PurchaseResume } from "../model/Purchase";
import { ProductServices, ProductServicesImplementation } from "./ProductServices";
import { ProductPurchase } from "../model/Product";
import { FirebaseProductRepository } from '../repository/ProductsRepository';

export class PurchaseServicesException extends Error { }

export abstract class PurchaseServices {
    protected _repository: PurchaseRepository
    protected constructor(_repository: PurchaseRepository) {
        this._repository = _repository;
    }

    abstract async savePurchase(purchase: Purchase): Promise<void>
    abstract async updatePurchaseThumbnails(purchase: Purchase): Promise<void>
    abstract async getPurchaseById(purchaseDocId: string): Promise<Purchase>;
}

export class PurchaseServicesImplementation extends PurchaseServices {

    private static instance: PurchaseServicesImplementation;

    private constructor(_repository: PurchaseRepository) {
        super(_repository);
    }

    public static getInstance(_repository: PurchaseRepository) {
        if (!this.instance) {
            this.instance = new PurchaseServicesImplementation(_repository)
        }
        return this.instance;
    }

    async savePurchase(purchase: Purchase): Promise<void> {
        await this._saveNfFull(purchase);
        await this._saveNfResume(purchase);
        await this._saveNfItems(purchase);


    }
    async updatePurchaseThumbnails(purchase: Purchase): Promise<void> {
        const { userDocId, purchaseDocId } = this._getIdsFromPurchase(purchase);
        if (!userDocId) {
            throw new PurchaseServicesException(`userDocId is undefinned: ${JSON.stringify(purchase)}`);
        }
        if (!purchaseDocId) {
            throw new PurchaseServicesException(`purchaseDocId is undefinned: ${JSON.stringify(purchase)}`);
        }
        await this._repository?.updatePurchase({ purchase, userDocId, purchaseDocId });

    }
    async getPurchaseById(purchaseDocId: string): Promise<Purchase> {
        return await this._repository.getPurchaseById(purchaseDocId);
    }

    private async _saveNfItems(purchase: Purchase) {
        const productServices: ProductServices = ProductServicesImplementation.getInstance(FirebaseProductRepository.getInstance());
        const returnStatuses: Promise<void>[] = [];
        const { purchaseDocId } = this._getIdsFromPurchase(purchase);
        if (!purchaseDocId) {
            throw new PurchaseServicesException(`purchaseDocId is undefinned: ${JSON.stringify(purchase)}`);
        }

        purchase.purchaseItemList.forEach(item => {
            returnStatuses.push(productServices.saveProduct(item.product));
            const productPurchase: ProductPurchase = {
                company: purchase.fiscalNote.company,
                date: purchase.fiscalNote.date,
                unityValue: item.unityValue
            };
            returnStatuses.push(productServices.saveProductPurchase({ product: item.product, productPurchase, purchaseDocId }));
        });
        await Promise.all(returnStatuses);
    }

    private _getIdsFromPurchase(purchase: Purchase): { userDocId: string | undefined, purchaseDocId: string | undefined } {

        const userDocId = purchase.user?.userId;
        const purchaseDocId = purchase.fiscalNote.accessKey;

        return { userDocId, purchaseDocId };

    }
    private async _saveNfFull(purchase: Purchase) {
        console.log('_saveNfFull');
        const { userDocId, purchaseDocId } = this._getIdsFromPurchase(purchase);
        if (!userDocId) {
            throw new PurchaseServicesException(`userDocId is undefinned: ${JSON.stringify(purchase)}`);
        }
        if (!purchaseDocId) {
            throw new PurchaseServicesException(`purchaseDocId is undefinned: ${JSON.stringify(purchase)}`);
        }
        console.log('before setFullPurchase');

        await this._repository?.setFullPurchase({ purchase, userDocId, purchaseDocId });
        console.log('after setFullPurchase');

    }

    private async _saveNfResume(purchase: Purchase) {
        console.log('_saveNfResume');
        const { userDocId, purchaseDocId } = this._getIdsFromPurchase(purchase);
        if (!userDocId) {
            throw new PurchaseServicesException(`userDocId is undefinned: ${JSON.stringify(purchase)}`);
        }
        if (!purchaseDocId) {
            throw new PurchaseServicesException(`purchaseDocId is undefinned: ${JSON.stringify(purchase)}`);
        }
        const purchaseResume: PurchaseResume = {
            company: purchase.fiscalNote.company,
            totalAmount: purchase.totalAmount,
            date: purchase.fiscalNote.date
        }
        await this._repository?.setResumePurchase({ purchaseResume, userDocId, purchaseDocId });

    }




}