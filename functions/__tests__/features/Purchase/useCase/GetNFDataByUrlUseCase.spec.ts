import { WebViewScrapDataService } from "../../../../src/features/Purchase/service/WebViewScrapDataService";
import { webViewScrapData } from "../fixtures/webViewScrapData";
import { UseCase } from "../../../../src/core/UseCase";
import { WebViewScrapData } from "../../../../src/features/Purchase/model/WebViewScrapData";
import { GetWebViewScrapDataUseCase } from "../../../../src/features/Purchase/useCase/GetWebViewScrapDataUseCase";

describe("GetNFDataByUrlUseCase", () => {
  const getWebViewScrapData = jest.fn();
  const webViewScrapDataService: WebViewScrapDataService = {
    getWebViewScrapData,
  };

  const getWebViewScrapDataUseCase: UseCase<WebViewScrapData> = new GetWebViewScrapDataUseCase(
    webViewScrapDataService
  );
  it("should return WebViewScrapData", async () => {
    const url = "url";
    getWebViewScrapData.mockResolvedValue(webViewScrapData);
    const actual = await getWebViewScrapDataUseCase.execute(url);
    expect(actual).toEqual(webViewScrapData);
    expect(getWebViewScrapData).toHaveBeenCalledWith(url);
  });
});
