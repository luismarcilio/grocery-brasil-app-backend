import { Address } from "./Address";
import { UserPreferences } from "./UserPreferences";

export interface User {
  userId: string;
  name?: string;
  email: string;
  taxId?: string;
  address?: Address;
  preferences?: UserPreferences;
}
