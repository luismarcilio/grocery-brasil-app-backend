import { User } from "./User";
import { PurchaseItem } from "./PurchaseItem";
import { FiscalNote } from "./FiscalNote";

export type Purchase = {
  user?: User;
  fiscalNote: FiscalNote;
  totalAmount: number;
  purchaseItemList: Array<PurchaseItem>;
}
