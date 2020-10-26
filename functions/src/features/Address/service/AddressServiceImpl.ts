import { AddressService } from "./AddressService";
import { Address } from "../../../model/Address";
import { AddressException } from "../../../core/ApplicationException";
import { AddressProvider } from "../provider/AddressProvider";
import { errorToApplicationException } from "../../../core/utils";

export class AddressServiceImpl implements AddressService {
  private readonly addressProvider: AddressProvider;
  constructor(addressProvider: AddressProvider) {
    this.addressProvider = addressProvider;
  }

  getFullAddress = async (
    rawAddress: string
  ): Promise<Address | AddressException> => {
    try {
      return await this.addressProvider.getAddressFromRawAddress(rawAddress);
    } catch (error) {
      return errorToApplicationException(error, AddressException);
    }
  };
}
