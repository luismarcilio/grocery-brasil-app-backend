import { ProductRepository } from "./ProductRepository";
import { ProductPurchase, Product } from "../../../model/Product";
import {
  ProductException,
  MessageIds,
} from "../../../core/ApplicationException";
import { errorToProductException } from "../productUtils";

export class ProductRepositoryFirebase implements ProductRepository {
  private readonly firestore: FirebaseFirestore.Firestore;
  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
  }

  save = async (productId: string, product: Product): Promise<void> => {
    try {
      const dbNfDoc = this.firestore.collection("PRODUTOS").doc(productId);
      await dbNfDoc.set(product);
    } catch (error) {
      return Promise.reject(errorToProductException(error));
    }
  };
  saveNf = async (
    productId: string,
    nfId: string,
    productPurchase: ProductPurchase
  ): Promise<void> => {
    try {
      const dbNfDoc = this.firestore
        .collection("PRODUTOS")
        .doc(productId)
        .collection("COMPRAS")
        .doc(nfId);
      await dbNfDoc.set(productPurchase);
    } catch (error) {
      return Promise.reject(errorToProductException(error));
    }
  };
  getProductById = async (productId: string): Promise<Product> => {
    try {
      const dbNfDoc = await this.firestore
        .collection("PRODUTOS")
        .doc(productId)
        .get();
      if (!dbNfDoc.exists) {
        return Promise.reject(
          new ProductException({
            messageId: MessageIds.NOT_FOUND,
            message: `product ${productId} not found`,
          })
        );
      }
      return <Product>dbNfDoc.data();
    } catch (error) {
      return Promise.reject(errorToProductException(error));
    }
  };
}