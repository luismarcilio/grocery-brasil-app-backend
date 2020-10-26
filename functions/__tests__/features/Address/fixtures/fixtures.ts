import { Address } from "../../../../src/model/Address";
import {
  AddressException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

export const someAddress: Address = {
  rawAddress: "rawAddress",
  street: "street",
  number: "number",
  complement: "complement",
  poCode: "pocode",
  county: "county",
  city: { name: "name" },
  state: { name: "name", acronnym: "acronym" },
  country: { name: "brasil" },
  lat: 0.0,
  lon: 0.0,
};

export const someAddressException: AddressException = new AddressException({
  messageId: MessageIds.UNEXPECTED,
  message: "Error",
});
