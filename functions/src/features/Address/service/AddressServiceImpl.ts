import { AddressService } from "./AddressService";
import { Address } from "../../../model/Address";
import { AddressException } from "../../../core/ApplicationException";
import { AddressProvider } from "../provider/AddressProvider";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class AddressServiceImpl implements AddressService {
  private readonly addressProvider: AddressProvider;
  constructor(addressProvider: AddressProvider) {
    this.addressProvider = addressProvider;
  }

  @withLog(loggerLevel.DEBUG)
  async getFullAddress(
    rawAddress: string
  ): Promise<Address | AddressException> {
    try {
      return await this.addressProvider.getAddressFromRawAddress(rawAddress);
    } catch (error) {
      return errorToApplicationException(error, AddressException);
    }
  }
}
