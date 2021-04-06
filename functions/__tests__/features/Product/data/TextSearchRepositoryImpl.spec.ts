import { TextSearchEngineRepository } from "../../../../src/features/Product/data/TextSearchEngineRepository";
import { TextSearchRepositoryImpl } from "../../../../src/features/Product/data/TextSearchRepositoryImpl";
import { SecretsProvider } from "../../../../src/features/Secrets/provider/SecretsProvider";
import { HttpAdapter } from "../../../../src/features/Http/adapter/HttpAdapter";
import { product } from "../fixture/product";
import { HttpResponse, HttpRequest } from "../../../../src/core/HttpProtocol";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("TextSearchRepositoryImpl", () => {
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

  const sut: TextSearchEngineRepository = new TextSearchRepositoryImpl(
    secretsProvider,
    httpAdapter
  );

  it("should save the product", async () => {
    const expected = { ...product };
    const secretObject = {
      endpoint: "someEndPoint",
      apiId: "someApiId"
    };
    const secret = JSON.stringify(secretObject);
    const httpResponse: HttpResponse = { status: 201 };
    getSecret.mockResolvedValue(secret);
    post.mockResolvedValue(httpResponse);
    const expectedRequest: HttpRequest = {
      body: product,
      headers: {
        "Content-Type": "application/json",
        "X-API-ID": "someApiId"
      },
    };
    const expectedUrl = `${secretObject.endpoint}/produto`;

    const actual = await sut.uploadProduct(product.eanCode, product);
    expect(actual).toEqual(expected);
    expect(getSecret).toHaveBeenCalledWith("TEXT_SEARCH_API_ID");
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
