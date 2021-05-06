import { ProductRepository } from "./ProductRepository";
import { ProductPurchase, Product } from "../../../model/Product";
import {
  ProductException,
} from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class ProductRepositoryFirebase implements ProductRepository {
  private readonly firestore: FirebaseFirestore.Firestore;
  constructor(firestore: FirebaseFirestore.Firestore) {
    this.firestore = firestore;
  }

  @withLog(loggerLevel.DEBUG)
  async save(productId: string, product: Product): Promise<void> {
    try {
      const dbNfDoc = this.firestore.collection("PRODUTOS").doc(productId);
      await dbNfDoc.set(product);
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  }
  async saveNf(
    productId: string,
    nfId: string,
    productPurchase: ProductPurchase
  ): Promise<void> {
    try {
      const dbNfDoc = this.firestore
        .collection("PRODUTOS")
        .doc(productId)
        .collection("COMPRAS")
        .doc(nfId);
      await dbNfDoc.set(productPurchase);
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  }
  @withLog(loggerLevel.DEBUG)
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const dbNfDoc = await this.firestore
        .collection("PRODUTOS")
        .doc(productId)
        .get();
      if (!dbNfDoc.exists) {
        return Promise.resolve(null);
      }
      return <Product>dbNfDoc.data();
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, ProductException)
      );
    }
  }
}
