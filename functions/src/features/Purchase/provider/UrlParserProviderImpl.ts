import { UrlParserProvider } from "./UrlParserProvider";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { withLog, loggerLevel } from "../../../core/Logging";

export class UrlParserProviderImpl implements UrlParserProvider {
  @withLog(loggerLevel.DEBUG)
  parseURL(url: string): { uf: string; accessKey: string } {
    try {
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
    } catch (e) {
      return this.parseNonURL(url);
    }
  }
  parseNonURL(url: string): { uf: string; accessKey: string } {
    // The only non url implemented so far is SP.
    const uf = "SP";
    const accessKey = url.split("|")[0].substr(3);
    return { uf, accessKey };
  }
}
