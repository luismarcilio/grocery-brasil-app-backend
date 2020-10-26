import { Address } from "../../../model/Address";
import { AddressException } from '../../../core/ApplicationException';
export interface AddressService {
  getFullAddress: (rawAddress: string) => Promise<Address|AddressException>;
}
