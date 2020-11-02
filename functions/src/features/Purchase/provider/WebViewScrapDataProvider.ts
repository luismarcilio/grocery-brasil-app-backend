export interface WebViewScrapDataProvider {
  getUrlByUF: (uf: string) => Promise<string>;
  getWebViewJavascriptByUF: (uf: string) => Promise<string>;
}
