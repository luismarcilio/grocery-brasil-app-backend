import { WebViewScrapDataRepository } from "./WebViewScrapDataRepository";
import * as NodeCache from "node-cache";
import {
  PurchaseException,
  MessageIds,
} from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class WebViewScrapDataRepositoryFirebase
  implements WebViewScrapDataRepository {
  private readonly firestore: FirebaseFirestore.Firestore;
  private readonly cache: NodeCache;

  constructor(firestore: FirebaseFirestore.Firestore, cache: NodeCache) {
    this.firestore = firestore;
    this.cache = cache;
  }

  @withLog(loggerLevel.DEBUG)
  async getUrlByUF(uf: string): Promise<string> {
    try {
      const docFromCache = this.cache.get(`urlByUF(${uf})`);
      if (docFromCache) {
        return Promise.resolve(<string>docFromCache);
      }
      const { initialURL } = await this.getFromFirestore(uf);
      return initialURL;
    } catch (error) {
      throw errorToApplicationException(error, PurchaseException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async getWebViewJavascriptByUF(uf: string): Promise<string> {
    try {
      const docFromCache = this.cache.get(`webViewJavascriptByUF(${uf})`);
      if (docFromCache) {
        return Promise.resolve(<string>docFromCache);
      }
      const { javascript } = await this.getFromFirestore(uf);
      return javascript;
    } catch (error) {
      throw errorToApplicationException(error, PurchaseException);
    }
  }

  @withLog(loggerLevel.DEBUG)
  private async getFromFirestore(
    uf: string
  ): Promise<{ initialURL: string; javascript: string }> {
    const docRefFromFirestore = await this.firestore
      .collection("CONFIG")
      .doc(uf)
      .get();

    if (!docRefFromFirestore.exists || !docRefFromFirestore.data) {
      throw new PurchaseException({
        messageId: MessageIds.NOT_FOUND,
        message: `No data found for UF: [${uf}]`,
      });
    }
    const data = (docRefFromFirestore.data() as unknown) as {
      initialURL: string;
      javascript: string;
    };
    this.cache.set(`urlByUF(${uf})`, data.initialURL);
    this.cache.set(`webViewJavascriptByUF(${uf})`, data.javascript);

    return data;
  }
}
