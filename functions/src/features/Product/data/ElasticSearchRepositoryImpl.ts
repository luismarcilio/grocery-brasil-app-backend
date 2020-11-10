import { TextSearchEngineRepository } from "./TextSearchEngineRepository";
import { Product } from "../../../model/Product";
import { SecretsProvider } from "../../Secrets/provider/SecretsProvider";
import { HttpAdapter } from "../../Http/adapter/HttpAdapter";
import { HttpRequest } from "../../../core/HttpProtocol";
import {
  ProductException,
  MessageIds,
} from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class ElasticSearchRepositoryImpl implements TextSearchEngineRepository {
  private readonly secretsProvider: SecretsProvider;

  private readonly httpAdapter: HttpAdapter;

  constructor(secretsProvider: SecretsProvider, httpAdapter: HttpAdapter) {
    this.secretsProvider = secretsProvider;
    this.httpAdapter = httpAdapter;
  }

  async uploadProduct(documentId: string, product: Product): Promise<Product> {
    try {
      const secretString = await this.secretsProvider.getSecret(
        "ELASTICSEARCH"
      );
      const { endpoint, backEndKey } = JSON.parse(secretString);
      const url = `${endpoint}/produtos_autocomplete/_doc/${documentId}`;
      const httpRequest: HttpRequest = {
        body: product,
        headers: {
          "Content-Type": "application/json",
          Authorization: `ApiKey ${backEndKey}`,
        },
      };

      const httpResponse = await this.httpAdapter.post(url, httpRequest);
      if (httpResponse.status !== 200) {
        return Promise.reject(
          new ProductException({
            messageId: MessageIds.UNEXPECTED,
            message: httpResponse.body,
          })
        );
      }
      return { ...product };
    } catch (error) {
      throw errorToApplicationException(error, ProductException);
    }
  }
}
