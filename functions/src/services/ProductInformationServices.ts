import { Product } from "../model/Product";
import { ProductsInformationRepository } from "../repository/ProductsInformationRepository";

export abstract class ProductInformationService {
    protected _repository: ProductsInformationRepository
    protected constructor(_repository: ProductsInformationRepository) {
        this._repository = _repository;
    }
    abstract normalizeProduct(product: Product): Promise<Product | undefined>;
}

export class ProductInformationServiceImplementation extends ProductInformationService {
    private static instance: ProductInformationServiceImplementation;

    private constructor(_repository: ProductsInformationRepository) {
        super(_repository);
    }

    public static getInstance(_repository: ProductsInformationRepository) {
        if (!this.instance) {
            this.instance = new ProductInformationServiceImplementation(_repository)
        }
        return this.instance;
    }

    async normalizeProduct(product: Product): Promise<Product | undefined> {
        const { response, status } = await this._repository.getProductInformation(product.eanCode);
        const newProduct = { ...product };
        if (status === 200) {
            newProduct.name = response.description;
            newProduct.ncmCode = response.ncm.code;
            newProduct.thumbnail = response.thumbnail;
        }
        newProduct.normalizationStatus = status;
        return newProduct;
    }

}