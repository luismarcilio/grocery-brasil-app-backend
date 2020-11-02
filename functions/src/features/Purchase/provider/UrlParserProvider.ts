export interface UrlParserProvider {
  parseURL: (url: string) => { uf: string; accessKey: string };
}
