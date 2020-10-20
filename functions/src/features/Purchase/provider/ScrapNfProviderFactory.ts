import { ScrapNFProvider } from "./ScrapNFProvider";

export interface ScrapNfProviderFactory {
  get: (uf: string) => ScrapNFProvider;
}
