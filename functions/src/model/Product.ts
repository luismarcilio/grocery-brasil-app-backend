import { Unity } from "./Unity";
export type Product = {
  name: string;
  eanCode: string;
  ncmCode: string;
  unity: Unity;
  normalized?: boolean;
  thumbnail?: string;
}
