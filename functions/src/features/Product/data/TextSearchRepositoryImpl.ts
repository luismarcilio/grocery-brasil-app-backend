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
import { withLog, loggerLevel } from "../../../core/Logging";

export class TextSearchRepositoryImpl implements TextSearchEngineRepository {
  private readonly secretsProvider: SecretsProvider;

  private readonly httpAdapter: HttpAdapter;

  constructor(secretsProvider: SecretsProvider, httpAdapter: HttpAdapter) {
    this.secretsProvider = secretsProvider;
    this.httpAdapter = httpAdapter;
  }

  @withLog(loggerLevel.DEBUG)
  async uploadProduct(documentId: string, product: Product): Promise<Product> {
    try {
      const secretString = await this.secretsProvider.getSecret(
        "TEXT_SEARCH_API_ID"
      );
      const { endpoint, apiId } = JSON.parse(secretString);
      const url = `${endpoint}/product`;
      const other:any = {...product};
      other["id"]=documentId;
      const httpRequest: HttpRequest = {
        body: other,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiId,
        },
      };

      const httpResponse = await this.httpAdapter.post(url, httpRequest);
      if (httpResponse.status !== 201) {
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
