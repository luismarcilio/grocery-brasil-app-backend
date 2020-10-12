import { ProductRepository } from "../repository/ProductsRepository";
import { ProductPurchase, Product } from "../model/Product";

export class ProductServicesException extends Error { }

export abstract class ProductServices {
    protected _repository: ProductRepository
    protected constructor(_repository: ProductRepository) {
        this._repository = _repository;
    }
    abstract async saveProduct(product: Product): Promise<void>
    abstract async saveProductPurchase(_: { product: Product, productPurchase: ProductPurchase, purchaseDocId: string }): Promise<void>
    abstract async updateProduct(product: Product): Promise<void>
    abstract async getProductById(productId: string): Promise<Product>
    abstract async getPurchaseIdsForProduct(productId: string): Promise<string[]>
}

export class ProductServicesImplementation extends ProductServices {

    private static instance: ProductServicesImplementation;

    private constructor(_repository: ProductRepository) {
        super(_repository);
    }

    public static getInstance(_repository: ProductRepository) {
        if (!this.instance) {
            this.instance = new ProductServicesImplementation(_repository)
        }
        return this.instance;
    }

    async saveProduct(product: Product): Promise<void> {
        const productDocId = this.getProductDocId(product);
        if (await this._repository?.productExists(productDocId)) {
            return;
        }
        await this._repository?.setProduct({ product, productDocId });

    }
    async saveProductPurchase(_: { product: Product, productPurchase: ProductPurchase, purchaseDocId: string }): Promise<void> {
        const productDocId = this.getProductDocId(_.product);
        await this._repository?.setProductPurchase({ productPurchase: _.productPurchase, productDocId, purchaseDocId: _.purchaseDocId });
    }
    async updateProduct(product: Product): Promise<void> {
        const productDocId = this.getProductDocId(product);
        await this._repository?.updateProduct({ product, productDocId });
    }
    async getPurchaseIdsForProduct(productId: string): Promise<string[]> {
        return this._repository.getPurchaseIdsForProduct(productId);

    }
    private getProductDocId(product: Product): string {
        const normalizedItemName = product.name.replace(/[^a-zA-Z0-9]+/g, '-');
        const productDocId = !product.eanCode ? product.ncmCode + '-' + normalizedItemName : product.eanCode;
        return productDocId;
    }
    getProductById(productId: string): Promise<Product> {
        return this._repository?.getProductById(productId);
    }

}