import { ProductNormalizationRepository } from "../../../../src/features/Product/data/ProductNormalizationRepository";
import { ProductNormalizationBluesoftCosmos } from "../../../../src/features/Product/data/ProductNormalizationBluesoftCosmos";
import { SecretsProvider } from "../../../../src/features/Secrets/provider/SecretsProvider";
import { HttpAdapter } from "../../../../src/features/Http/adapter/HttpAdapter";
import { product } from "../fixtures";
import { HttpResponse, HttpRequest } from "../../../../src/core/HttpProtocol";
import { bluesoftSampleResponse } from "../fixture/bluesoftSampleResponse";
import {
  ProductException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("ProductNormalizationBluesoftCosmos", () => {
  const getSecret = jest.fn();
  const secretsProvider: SecretsProvider = {
    getSecret,
  };
  const get = jest.fn();
  const httpAdapter: HttpAdapter = {
    get,
  };

  const sut: ProductNormalizationRepository = new ProductNormalizationBluesoftCosmos(
    secretsProvider,
    httpAdapter
  );

  it("should retrieve normalized product by ean code", async () => {
    const normalizedProduct = { ...product };
    const espectedNormProductResponse: HttpResponse = {
      status: 200,
      body: bluesoftSampleResponse,
    };
    normalizedProduct.name = "SUCO INTEGRAL UVA TINTO ALIANÇA GARRAFA 1,5L";
    normalizedProduct.thumbnail =
      "https://cdn-cosmos.bluesoft.com.br/products/7896100501829";
    const expectedUrl = `https://api.cosmos.bluesoft.com.br/gtins/${product.eanCode}`;
    getSecret.mockReturnValue("BLUESOFT_API_KEY");
    get.mockReturnValue(espectedNormProductResponse);
    const expectedHttpRequest: HttpRequest = {
      headers: { "X-Cosmos-Token": "BLUESOFT_API_KEY" },
    };
    const actual = await sut.normalizeProduct(product);
    expect(actual).toEqual(normalizedProduct);
    expect(getSecret).toHaveBeenCalledWith("BLUESOFT_COSMOS_API");
    expect(get).toHaveBeenCalledWith(expectedUrl, expectedHttpRequest);
  });

  it("should throw UNEXPÉCTED if response status != 200", async () => {
    const espectedNormProductResponse: HttpResponse = {
      status: 400,
      body: "Bad Request",
    };

    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: "Response status:400 Bad Request",
    });

    getSecret.mockReturnValue("BLUESOFT_API_KEY");
    get.mockReturnValue(espectedNormProductResponse);

    await expect(sut.normalizeProduct(product)).rejects.toEqual(expected);
  });

  it("should throw error INVALID ARGUMENT if product doesn't have ean code", async () => {
    const otherProduct = { ...product };
    delete otherProduct.eanCode;
    const expected = new ProductException({
      messageId: MessageIds.INVALID_ARGUMENT,
      message: "EAN code is falsee",
    });
    await expect(sut.normalizeProduct(otherProduct)).rejects.toEqual(expected);
  });
  it("should throw UNEXPÉCTED if some error occurs", async () => {
    const someException = new Error("error");
    const expected = new ProductException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    getSecret.mockRejectedValue(someException);

    await expect(sut.normalizeProduct(product)).rejects.toEqual(expected);
  });
});
