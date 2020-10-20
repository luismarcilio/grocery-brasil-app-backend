import { Purchase } from "../../../model/Purchase";
export interface ScrapNFProvider {
  scrap: (html: string) => Purchase;
}
