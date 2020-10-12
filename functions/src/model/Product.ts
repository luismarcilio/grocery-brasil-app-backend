import { Unity } from "./Unity";
import { Company } from "./Company";
export type Product = {
  name: string;
  eanCode: string;
  ncmCode: string;
  unity: Unity;
  normalized?: boolean;
  thumbnail?: string;
  normalizationStatus?: number;
}

export type ProductPurchase = {
  company: Company,
  date: Date,
  unityValue: number
}
