import { User } from "./User";
import { PurchaseItem } from "./PurchaseItem";
import { FiscalNote } from "./FiscalNote";
import { Company } from "./Company";

export type Purchase = {
  user?: User;
  fiscalNote: FiscalNote;
  totalAmount: number;
  purchaseItemList: Array<PurchaseItem>;
}

export type PurchaseResume = {
  company: Company;
  date: Date;
  totalAmount: number;
}