import { UseCase } from "../../../core/UseCase";
import { Address } from "../../../model/Address";
import { AddressException } from "../../../core/ApplicationException";
import { AddressService } from "../service/AddressService";
import { withLog, loggerLevel } from "../../../core/Logging";

export class GetFullAddressFromRawAddressUseCase implements UseCase<Address> {
  private readonly addressService: AddressService;
  constructor(addressService: AddressService) {
    this.addressService = addressService;
  }

  @withLog(loggerLevel.DEBUG)
  execute(rawAddress: string): Promise<Address | AddressException> {
    return this.addressService.getFullAddress(rawAddress);
  }
}
