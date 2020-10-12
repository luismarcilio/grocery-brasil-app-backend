import admin = require("firebase-admin");
import { logger } from "../logger";
import { Product, ProductPurchase } from "../model/Product";


export class ProductRepositoryError extends Error { }

export abstract class ProductRepository {
    abstract async setProduct(_: { product: Product, productDocId: string }): Promise<void>;
    abstract async setProductPurchase(_: { productPurchase: ProductPurchase, productDocId: string, purchaseDocId: string }): Promise<void>;
    abstract async updateProduct(_: { product: Product, productDocId: string }): Promise<void>;
    abstract async productExists(productId: string): Promise<boolean | undefined>;
    abstract async getProductById(productId: string): Promise<Product>;
    abstract async getPurchaseIdsForProduct(productId: string): Promise<string[]>

}

export class FirebaseProductRepository extends ProductRepository {
    private static _instance: FirebaseProductRepository;
    private _db: FirebaseFirestore.Firestore | undefined;
    private constructor() {
        super();
        this._db = admin.firestore()
    }
    public static getInstance(): FirebaseProductRepository {
        if (!this._instance) {
            this._instance = new FirebaseProductRepository();
        }
        return this._instance;
    }

    async setProduct(_: { product: Product; productDocId: string; }): Promise<void> {
        const dbNfDoc = this._db?.collection('PRODUTOS').doc(_.productDocId);
        const writeResult = await dbNfDoc?.set(_.product);
        logger.info('setProduct(product: Product)', writeResult);
    }
    async setProductPurchase(_: { productPurchase: ProductPurchase; productDocId: string; purchaseDocId: string; }): Promise<void> {
        const dbNfDoc = this._db?.collection('PRODUTOS').doc(_.productDocId).collection('COMPRAS').doc(_.purchaseDocId);
        const writeResult = await dbNfDoc?.set(_.productPurchase);
        logger.info('setProductPurchase(roductPurchase: ProductPurchase)', writeResult);
    }
    async updateProduct(_: { product: Product; productDocId: string; }): Promise<void> {
        const dbNfDoc = this._db?.collection('PRODUTOS').doc(_.productDocId);
        const writeResult = await dbNfDoc?.update(_.product);
        logger.info('updateProduct(product: Product)', writeResult);
    }
    async productExists(productId: string): Promise<boolean | undefined> {
        const dbDocRef = await this._db?.collection('PRODUTOS').doc(productId).get();
        return dbDocRef?.exists;

    }
    async getProductById(productId: string): Promise<Product> {
        const dbDocRef = await this._db?.collection('PRODUTOS').doc(productId).get();
        if (!dbDocRef?.exists || !dbDocRef.data()) {
            throw new ProductRepositoryError(`Product not found: ${productId}`);
        }
        return <Product>dbDocRef.data();

    }

    async getPurchaseIdsForProduct(productId: string): Promise<string[]> {
        const dbDocRef = await this._db?.collection('PRODUTOS').doc(productId).collection('COMPRAS').get();
        const purchaseIds: string[] = [];
        dbDocRef?.forEach(doc => { purchaseIds.push(doc.id) });
        return purchaseIds;
    }


}