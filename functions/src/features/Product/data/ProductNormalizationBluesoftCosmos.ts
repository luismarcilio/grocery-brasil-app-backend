import { ProductNormalizationRepository } from "./ProductNormalizationRepository";
import { Product } from "../../../model/Product";
import { SecretsProvider } from "../../Secrets/provider/SecretsProvider";
import { HttpAdapter } from "../../Http/adapter/HttpAdapter";
import {
  ProductException,
  MessageIds,
} from "../../../core/ApplicationException";
import { HttpRequest } from "../../../core/HttpProtocol";
import { errorToApplicationException } from "../../../core/utils";

export class ProductNormalizationBluesoftCosmos
  implements ProductNormalizationRepository {
  private readonly secretsProvider: SecretsProvider;
  private readonly httpAdapter: HttpAdapter;

  constructor(secretsProvider: SecretsProvider, httpAdapter: HttpAdapter) {
    this.secretsProvider = secretsProvider;
    this.httpAdapter = httpAdapter;
  }

  normalizeProduct = async (product: Product): Promise<Product> => {
    if (!product.eanCode) {
      return Promise.reject(
        new ProductException({
          messageId: MessageIds.INVALID_ARGUMENT,
          message: "EAN code is falsee",
        })
      );
    }
    try {
      const secret = await this.secretsProvider.getSecret(
        "BLUESOFT_COSMOS_API"
      );
      const url = `https://api.cosmos.bluesoft.com.br/gtins/${product.eanCode}`;
      const httpRequest: HttpRequest = {
        headers: { "X-Cosmos-Token": secret },
      };
      const response = await this.httpAdapter.get(url, httpRequest);
      if (response.status !== 200) {
        return Promise.reject(
          new ProductException({
            messageId: MessageIds.UNEXPECTED,
            message: `Response status:${response.status} ${response.body}`,
          })
        );
      }
      const bluesoftProduct = response.body;

      const normalizedProduct = { ...product };
      normalizedProduct.name = bluesoftProduct.description;
      normalizedProduct.thumbnail = bluesoftProduct.thumbnail;
      return normalizedProduct;
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  };
}
