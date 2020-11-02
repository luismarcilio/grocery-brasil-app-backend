import { WebViewScrapDataService } from "./WebViewScrapDataService";
import { WebViewScrapData } from "../model/WebViewScrapData";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { WebViewScrapDataProvider } from "../provider/WebViewScrapDataProvider";
import { MinifierAdapter } from "../adapter/MinifierAdapter";
import { UrlParserProvider } from "../provider/UrlParserProvider";

export class WebViewScrapDataServiceImpl implements WebViewScrapDataService {
  private readonly webViewScrapDataProvider: WebViewScrapDataProvider;
  private readonly minifierAdapter: MinifierAdapter;
  private readonly urlParserProvider: UrlParserProvider;

  constructor(
    webViewScrapDataProvider: WebViewScrapDataProvider,
    minifierAdapter: MinifierAdapter,
    urlParserProvider: UrlParserProvider
  ) {
    this.webViewScrapDataProvider = webViewScrapDataProvider;
    this.minifierAdapter = minifierAdapter;
    this.urlParserProvider = urlParserProvider;
  }
  getWebViewScrapData = async (
    url: string
  ): Promise<WebViewScrapData | PurchaseException> => {
    let parseUrlResult: { uf: string; accessKey: string };
    try {
      parseUrlResult = this.urlParserProvider.parseURL(url);
    } catch (error) {
      return new PurchaseException({
        messageId: MessageIds.INVALID_ARGUMENT,
        message: error.message,
      });
    }

    const { uf, accessKey } = parseUrlResult;
    let javascript: string;
    let initialUrl: string;
    try {
      javascript = await this.webViewScrapDataProvider.getWebViewJavascriptByUF(
        uf
      );
      initialUrl = await this.webViewScrapDataProvider.getUrlByUF(uf);
    } catch (error) {
      if (
        error instanceof PurchaseException &&
        error.messageId == MessageIds.NOT_FOUND
      ) {
        return new PurchaseException({
          messageId: MessageIds.UNIMPLEMENTED,
          message: error.message,
        });
      } else {
        throw error;
      }
    }
    const minifiedJavaScript = await this.minifierAdapter.minify(javascript);
    const javascriptWithAccessKey = minifiedJavaScript.replace(
      "$$ACCESS_KEY$$",
      accessKey
    );
    const javascriptFunctions = `javascript:${javascriptWithAccessKey}`;

    const webViewScrapData: WebViewScrapData = {
      initialUrl,
      uf,
      accessKey,
      javascriptFunctions,
    };
    return webViewScrapData;
  };
}
