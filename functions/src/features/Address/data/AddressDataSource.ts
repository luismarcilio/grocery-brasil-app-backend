import { Address } from "../../../model/Address";

export interface AddressDataSource {
  getFullAddressFromRawAddress: (rawAddress: string) => Promise<Address>;
}
