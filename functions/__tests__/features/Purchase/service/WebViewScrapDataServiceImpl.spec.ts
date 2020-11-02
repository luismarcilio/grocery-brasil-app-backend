import { MinifierAdapter } from "../../../../src/features/Purchase/adapter/MinifierAdapter";
import { WebViewScrapDataProvider } from "../../../../src/features/Purchase/provider/WebViewScrapDataProvider";
import { UrlParserProvider } from "../../../../src/features/Purchase/provider/UrlParserProvider";
import { WebViewScrapDataService } from "../../../../src/features/Purchase/service/WebViewScrapDataService";
import { WebViewScrapDataServiceImpl } from "../../../../src/features/Purchase/service/WebViewScrapDataServiceImpl";
import { WebViewScrapData } from "../../../../src/features/Purchase/model/WebViewScrapData";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("WebViewScrapDataServiceImpl", () => {
  const getUrlByUF = jest.fn();
  const getWebViewJavascriptByUF = jest.fn();

  const webViewScrapDataProvider: WebViewScrapDataProvider = {
    getUrlByUF,
    getWebViewJavascriptByUF,
  };

  const minify = jest.fn();
  const minifierAdapter: MinifierAdapter = {
    minify,
  };

  const parseURL = jest.fn();
  const urlParserProvider: UrlParserProvider = {
    parseURL,
  };

  const sut: WebViewScrapDataService = new WebViewScrapDataServiceImpl(
    webViewScrapDataProvider,
    minifierAdapter,
    urlParserProvider
  );

  it("should parse the URL and bring the uf, and the accessKey", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected: WebViewScrapData = {
      initialUrl: "urlForMG",
      uf: "MG",
      accessKey: "accessKey",
      javascriptFunctions: "javascript:someMinifiedJS",
    };

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
    expect(parseURL).toHaveBeenCalledWith(sampleInitialURL);
  });
  it("should bring the url for that UF from the provider", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected: WebViewScrapData = {
      initialUrl: "urlForMG",
      uf: "MG",
      accessKey: "accessKey",
      javascriptFunctions: "javascript:someMinifiedJS",
    };

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
    expect(getUrlByUF).toHaveBeenCalledWith("MG");
  });
  it("should bring the javascript for that UF from the provider", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected: WebViewScrapData = {
      initialUrl: "urlForMG",
      uf: "MG",
      accessKey: "accessKey",
      javascriptFunctions: "javascript:someMinifiedJS",
    };

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
    expect(getWebViewJavascriptByUF).toHaveBeenCalledWith("MG");
  });
  it("should replace the string $$ACCESS_KEY$$ by the actual accessKey", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected: WebViewScrapData = {
      initialUrl: "urlForMG",
      uf: "MG",
      accessKey: "accessKey",
      javascriptFunctions: "javascript:someMinifiedJS(accessKey)",
    };

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS($$ACCESS_KEY$$)");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
  });
  it('should concat the string "javascript:" before the javascript', async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected: WebViewScrapData = {
      initialUrl: "urlForMG",
      uf: "MG",
      accessKey: "accessKey",
      javascriptFunctions: "javascript:someMinifiedJS",
    };

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
  });
  it("should minify the javascript", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected: WebViewScrapData = {
      initialUrl: "urlForMG",
      uf: "MG",
      accessKey: "accessKey",
      javascriptFunctions: "javascript:someMinifiedJS",
    };

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
    expect(minify).toHaveBeenCalledWith("someJS");
  });
  it("should return error NOT_IMPLEMENTED if javascript is not found by the provider", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected = new PurchaseException({
      messageId: MessageIds.UNIMPLEMENTED,
      message: "Javascript not found",
    });

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockRejectedValue(
      new PurchaseException({
        messageId: MessageIds.NOT_FOUND,
        message: "Javascript not found",
      })
    );
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
  });
  it("should return error NOT_IMPLEMENTED if the url is not found by the provider", async () => {
    const sampleInitialURL = "URL";
    const expectedUrlResult = { uf: "MG", accessKey: "accessKey" };
    const expected = new PurchaseException({
      messageId: MessageIds.UNIMPLEMENTED,
      message: "UF not found",
    });

    parseURL.mockReturnValue(expectedUrlResult);
    getUrlByUF.mockRejectedValue(
      new PurchaseException({
        messageId: MessageIds.NOT_FOUND,
        message: "UF not found",
      })
    );
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
  });
  it("should return error INVALID_ARGUMENT if url cannot be parsed", async () => {
    const sampleInitialURL = "URL";
    const expected = new PurchaseException({
      messageId: MessageIds.INVALID_ARGUMENT,
      message: "Error parsing url",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parseURL.mockImplementation((_) => {
      throw new Error("Error parsing url");
    });
    getUrlByUF.mockResolvedValue("urlForMG");
    getWebViewJavascriptByUF.mockResolvedValue("someJS");
    minify.mockReturnValue("someMinifiedJS");

    const actual = await sut.getWebViewScrapData(sampleInitialURL);
    expect(actual).toEqual(expected);
    expect(parseURL).toHaveBeenCalledWith(sampleInitialURL);
  });
});
