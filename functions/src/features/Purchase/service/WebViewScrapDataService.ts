import { WebViewScrapData } from "../model/WebViewScrapData";
import { PurchaseException } from "../../../core/ApplicationException";

export interface WebViewScrapDataService {
  getWebViewScrapData: (
    url: string
  ) => Promise<WebViewScrapData | PurchaseException>;
}
