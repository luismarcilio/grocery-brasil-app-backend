import { Company } from "./Company";

export type FiscalNote = {
  accessKey: string;
  number: string;
  series: string;
  company: Company;
  date: Date;
}
