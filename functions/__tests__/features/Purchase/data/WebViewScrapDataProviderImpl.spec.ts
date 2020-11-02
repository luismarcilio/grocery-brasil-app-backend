import { WebViewScrapDataProvider } from "../../../../src/features/Purchase/provider/WebViewScrapDataProvider";
import { WebViewScrapDataRepository } from "../../../../src/features/Purchase/data/WebViewScrapDataRepository";
import { WebViewScrapDataProviderImpl } from "../../../../src/features/Purchase/data/WebViewScrapDataProviderImpl";
import {
  PurchaseException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("WebViewScrapDataProviderImpl", () => {
  const getUrlByUF = jest.fn();
  const getWebViewJavascriptByUF = jest.fn();

  const webViewScrapDataRepository: WebViewScrapDataRepository = {
    getUrlByUF,
    getWebViewJavascriptByUF,
  };

  const sut: WebViewScrapDataProvider = new WebViewScrapDataProviderImpl(
    webViewScrapDataRepository
  );
  describe("getUrlByUF", () => {
    it("should bring initial url by the uf", async () => {
      const someUF = "MG";
      const expected = "initialURL";
      getUrlByUF.mockResolvedValue(expected);
      const actual = await sut.getUrlByUF(someUF);
      expect(actual).toEqual(expected);
      expect(getUrlByUF).toHaveBeenCalledWith(someUF);
    });

    it("should thow a PURCHASE_ERROR if some exception is thrown", async () => {
      const someUF = "MG";
      const expected = new Error("error");

      getUrlByUF.mockRejectedValue(expected);
      await expect(sut.getUrlByUF(someUF)).rejects.toEqual(
        new PurchaseException({
          messageId: MessageIds.UNEXPECTED,
          message: (expected as unknown) as string,
        })
      );
    });
  });
  describe("getWebViewJavascriptByUF", () => {
    it("should bring the javascript by the uf", async () => {
      const someUF = "MG";
      const expected = "someJavascript";
      getWebViewJavascriptByUF.mockResolvedValue(expected);
      const actual = await sut.getWebViewJavascriptByUF(someUF);
      expect(actual).toEqual(expected);
      expect(getWebViewJavascriptByUF).toHaveBeenCalledWith(someUF);
    });
    it("should thow a PURCHASE_ERROR is some exception is thrown", async () => {
      const someUF = "MG";
      const expected = new Error("error");
      getWebViewJavascriptByUF.mockRejectedValue(expected);
      await expect(sut.getWebViewJavascriptByUF(someUF)).rejects.toEqual(
        new PurchaseException({
          messageId: MessageIds.UNEXPECTED,
          message: (expected as unknown) as string,
        })
      );
    });
  });
});
