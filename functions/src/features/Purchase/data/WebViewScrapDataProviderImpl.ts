import { WebViewScrapDataProvider } from "../provider/WebViewScrapDataProvider";
import { WebViewScrapDataRepository } from "./WebViewScrapDataRepository";
import { PurchaseException } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class WebViewScrapDataProviderImpl implements WebViewScrapDataProvider {
  private readonly webViewScrapDataRepository: WebViewScrapDataRepository;

  constructor(webViewScrapDataRepository: WebViewScrapDataRepository) {
    this.webViewScrapDataRepository = webViewScrapDataRepository;
  }

  async getUrlByUF(uf: string): Promise<string> {
    try {
      return await this.webViewScrapDataRepository.getUrlByUF(uf);
    } catch (error) {
      throw errorToApplicationException(error, PurchaseException);
    }
  }
  async getWebViewJavascriptByUF(uf: string): Promise<string> {
    try {
      return await this.webViewScrapDataRepository.getWebViewJavascriptByUF(uf);
    } catch (error) {
      throw errorToApplicationException(error, PurchaseException);
    }
  }
}
