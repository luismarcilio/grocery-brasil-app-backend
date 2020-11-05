import { TextSearchEngineRepository } from "../../../../src/features/Product/data/TextSearchEngineRepository";
import { ElasticSearchRepositoryImpl } from "../../../../src/features/Product/data/ElasticSearchRepositoryImpl";
import { SecretsProvider } from "../../../../src/features/Secrets/provider/SecretsProvider";
import { HttpAdapter } from "../../../../src/features/Http/adapter/HttpAdapter";
import { product } from "../fixture/product";
import { HttpResponse, HttpRequest } from "../../../../src/core/HttpProtocol";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("ElasticSearchRepositoryImpl", () => {
  const getSecret = jest.fn();
  const secretsProvider: SecretsProvider = {
    getSecret,
  };
  const get = jest.fn();
  const getBuffer = jest.fn();
  const post = jest.fn();
  const httpAdapter: HttpAdapter = {
    get,
    getBuffer,
    post,
  };

  const sut: TextSearchEngineRepository = new ElasticSearchRepositoryImpl(
    secretsProvider,
    httpAdapter
  );

  it("should save the product", async () => {
    const expected = { ...product };
    const secretObject = {
      endpoint: "someEndPoint",
      backEndKey: "somebackEndKey",
      frontEndKey: "someFrontEndKey",
    };
    const secret = JSON.stringify(secretObject);
    const httpResponse: HttpResponse = { status: 200 };
    getSecret.mockResolvedValue(secret);
    post.mockResolvedValue(httpResponse);
    const expectedRequest: HttpRequest = {
      body: product,
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${secretObject.backEndKey}`,
      },
    };
    const expectedUrl = `${secretObject.endpoint}/produtos_autocomplete/_doc/${product.eanCode}`;

    const actual = await sut.uploadProduct(product.eanCode, product);
    expect(actual).toEqual(expected);
    expect(getSecret).toHaveBeenCalledWith("ELASTICSEARCH");
    expect(post).toHaveBeenCalledWith(expectedUrl, expectedRequest);
  });

  it("should throw exception if return status <> 200", async () => {
    const secretObject = {
      endpoint: "someEndPoint",
      backEndKey: "somebackEndKey",
      frontEndKey: "someFrontEndKey",
    };
    const secret = JSON.stringify(secretObject);
    const httpResponse: HttpResponse = { status: 400, body: "Error" };
    getSecret.mockResolvedValue(secret);
    post.mockResolvedValue(httpResponse);
    await expect(sut.uploadProduct(product.eanCode, product)).rejects.toEqual(
      new ProductException({
        messageId: MessageIds.UNEXPECTED,
        message: httpResponse.body,
      })
    );
  });

  it("should throw an exception is some error occurs", async () => {
    const someError = new Error("error");
    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someError as unknown) as string,
    });
    const httpResponse: HttpResponse = { status: 200 };
    getSecret.mockRejectedValue(someError);
    post.mockResolvedValue(httpResponse);
    await expect(sut.uploadProduct(product.eanCode, product)).rejects.toEqual(
      expected
    );
  });
});
