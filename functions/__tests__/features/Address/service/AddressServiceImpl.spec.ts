import { AddressService } from "../../../../src/features/Address/service/AddressService";
import { AddressServiceImpl } from "../../../../src/features/Address/service/AddressServiceImpl";
import { someAddress, someAddressException } from "../fixtures/fixtures";
import { AddressProvider } from "../../../../src/features/Address/provider/AddressProvider";

describe("AddressServiceImpl", () => {
  const getAddressFromRawAddress = jest.fn();
  const addressProvider: AddressProvider = {
    getAddressFromRawAddress,
  };
  const sut: AddressService = new AddressServiceImpl(addressProvider);
  it("should return an Address if all ok", async () => {
    jest
      .spyOn(addressProvider, "getAddressFromRawAddress")
      .mockResolvedValue(someAddress);
    const actual = await sut.getFullAddress(someAddress.rawAddress);
    expect(actual).toEqual(someAddress);
  });

  it("should return an AddressException if AddressException occurs", async () => {
    jest
      .spyOn(addressProvider, "getAddressFromRawAddress")
      .mockRejectedValue(someAddressException);
    const actual = await sut.getFullAddress(someAddress.rawAddress);
    expect(actual).toEqual(someAddressException);
  });

  it("should return AddressException if a generic exception occurs", async () => {
    jest
      .spyOn(addressProvider, "getAddressFromRawAddress")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((_) => {
        throw "Error";
      });
    const actual = await sut.getFullAddress(someAddress.rawAddress);
    expect(actual).toEqual(someAddressException);
  });
});
