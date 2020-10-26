import { AddressProvider } from "./AddressProvider";
import { Address } from "../../../model/Address";
import { AddressDataSource } from "../data/AddressDataSource";
import { AddressException } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class AddressProviderImpl implements AddressProvider {
  private readonly addressDataSource: AddressDataSource;

  constructor(addressDataSource: AddressDataSource) {
    this.addressDataSource = addressDataSource;
  }

  getAddressFromRawAddress = async (rawAddress: string): Promise<Address> => {
    try {
      return await this.addressDataSource.getFullAddressFromRawAddress(
        rawAddress
      );
    } catch (error) {
      return Promise.reject(
        errorToApplicationException(error, AddressException)
      );
    }
  };
}
