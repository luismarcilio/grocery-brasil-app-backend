import { Purchase } from "../../../model/Purchase";
export abstract class ScrapNFProvider {
  scrap!: (html: string) => Purchase;
  static instance: () => ScrapNFProvider;
}
