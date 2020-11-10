import { Controller } from "./Controller";
import { GetWebViewScrapDataUseCase } from "../../features/Purchase/useCase/GetWebViewScrapDataUseCase";
import { HttpRequest, HttpResponse } from "../../core/HttpProtocol";
import { PurchaseException, MessageIds } from "../../core/ApplicationException";
export class GetWebViewScrapDataController implements Controller {
  private readonly getWebViewScrapDataUseCase: GetWebViewScrapDataUseCase;

  constructor(getWebViewScrapDataUseCase: GetWebViewScrapDataUseCase) {
    this.getWebViewScrapDataUseCase = getWebViewScrapDataUseCase;
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const url: string = request.params.url;
      const result = await this.getWebViewScrapDataUseCase.execute(url);
      if (result instanceof PurchaseException) {
        let status: number;
        if (result.messageId === MessageIds.NOT_FOUND) {
          status = 400;
        } else {
          status = 500;
        }
        const response: HttpResponse = {
          status,
          body: result.message,
        };
        return response;
      }
      const response: HttpResponse = {
        status: 200,
        body: result,
      };
      return response;
    } catch (error) {
      return Promise.resolve({ status: 500, body: error });
    }
  }
}
