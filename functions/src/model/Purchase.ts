import { User } from "./User";
import { PurchaseItem } from "./PurchaseItem";
import { FiscalNote } from "./FiscalNote";
import { Company } from "./Company";

export interface Purchase {
  user?: User;
  fiscalNote: FiscalNote;
  totalAmount: number;
  totalDiscount: number;
  purchaseItemList: PurchaseItem[];
}

export interface PurchaseResume {
  user?: User;
  accessKey: string;
  company: Company;
  date: Date;
  totalAmount: number;
  totalDiscount: number;
}
