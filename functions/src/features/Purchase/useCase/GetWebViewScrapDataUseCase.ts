import { UseCase } from "../../../core/UseCase";
import { WebViewScrapData } from "../model/WebViewScrapData";
import { PurchaseException } from "../../../core/ApplicationException";
import { WebViewScrapDataService } from "../service/WebViewScrapDataService";

export class GetWebViewScrapDataUseCase implements UseCase<WebViewScrapData> {
  private readonly webViewScrapDataService: WebViewScrapDataService;

  constructor(webViewScrapDataService: WebViewScrapDataService) {
    this.webViewScrapDataService = webViewScrapDataService;
  }

  async execute (url: string): Promise<WebViewScrapData | PurchaseException>  {
    return this.webViewScrapDataService.getWebViewScrapData(url);
  }
}
