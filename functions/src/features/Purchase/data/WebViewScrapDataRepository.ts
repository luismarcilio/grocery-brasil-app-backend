export interface WebViewScrapDataRepository {
  getUrlByUF: (uf: string) => Promise<string>;
  getWebViewJavascriptByUF: (uf: string) => Promise<string>;
}
