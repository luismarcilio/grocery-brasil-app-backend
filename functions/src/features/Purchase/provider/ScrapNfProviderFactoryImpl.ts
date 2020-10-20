import { ScrapNfProviderFactory } from "./ScrapNfProviderFactory";
import { ScrapNFProvider } from "./ScrapNFProvider";
import {
  MessageIds,
  ScrapNfException,
} from "../../../core/ApplicationException";

export class ScrapNfProviderFactoryImpl implements ScrapNfProviderFactory {
  providerConfiguration: { uf: string; scrapNfProvider: ScrapNFProvider }[];
  constructor(
    providerConfiguration: { uf: string; scrapNfProvider: ScrapNFProvider }[]
  ) {
    this.providerConfiguration = providerConfiguration;
  }
  get = (uf: string): ScrapNFProvider => {
    const scrapNFProvider = this.providerConfiguration.find(
      (provider) => provider.uf === uf
    )?.scrapNfProvider;
    if (scrapNFProvider === undefined) {
      throw new ScrapNfException({
        messageId: MessageIds.UNIMPLEMENTED,
        message: `Not implemented for UF: ${uf}`,
      });
    }
    return scrapNFProvider;
  };
}
