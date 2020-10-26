import { Address } from "../../../model/Address";

export interface AddressProvider {
  getAddressFromRawAddress: (rawAddress: string) => Promise<Address>;
}
