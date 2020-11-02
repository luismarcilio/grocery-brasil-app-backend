import { UrlParserProvider } from "./UrlParserProvider";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";

export class UrlParserProviderImpl implements UrlParserProvider {
  parseURL = (url: string): { uf: string; accessKey: string } => {
    const uri: URL = new URL(url);

    if (!uri.hostname.match(/..\.gov\.br/)) {
      throw new PurchaseException({
        messageId: MessageIds.INVALID_ARGUMENT,
        message: `invalid hostname for url: ${url}`,
      });
    }
    const searchParams = uri.searchParams.get("p");
    if (!searchParams) {
      throw new PurchaseException({
        messageId: MessageIds.INVALID_ARGUMENT,
        message: `invalid queryString for url: ${url}`,
      });
    }

    const splitUf = uri.hostname.split(".");
    const uf = splitUf[splitUf.length - 3].toUpperCase();
    const accessKey = searchParams.split("|")[0];
    return { uf, accessKey };
  };
}
