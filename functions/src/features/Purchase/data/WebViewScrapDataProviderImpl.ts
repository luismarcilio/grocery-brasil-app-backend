import { WebViewScrapDataProvider } from "../provider/WebViewScrapDataProvider";
import { WebViewScrapDataRepository } from "./WebViewScrapDataRepository";
import { PurchaseException } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class WebViewScrapDataProviderImpl implements WebViewScrapDataProvider {
  private readonly webViewScrapDataRepository: WebViewScrapDataRepository;

  constructor(webViewScrapDataRepository: WebViewScrapDataRepository) {
    this.webViewScrapDataRepository = webViewScrapDataRepository;
  }

  @withLog(loggerLevel.DEBUG)
  async getUrlByUF(uf: string): Promise<string> {
    try {
      return await this.webViewScrapDataRepository.getUrlByUF(uf);
    } catch (error) {
      throw errorToApplicationException(error, PurchaseException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async getWebViewJavascriptByUF(uf: string): Promise<string> {
    try {
      return await this.webViewScrapDataRepository.getWebViewJavascriptByUF(uf);
    } catch (error) {
      throw errorToApplicationException(error, PurchaseException);
    }
  }
}
