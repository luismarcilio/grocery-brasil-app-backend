import { AddressProvider } from "../../../../src/features/Address/provider/AddressProvider";
import { AddressProviderImpl } from "../../../../src/features/Address/provider/AddressProviderImpl";
import { someAddress, someAddressException } from "../fixtures/fixtures";
import { AddressDataSource } from "../../../../src/features/Address/data/AddressDataSource";

describe("AddressProviderImpl", () => {
  const getFullAddressFromRawAddress = jest.fn();
  const addressDataSource: AddressDataSource = {
    getFullAddressFromRawAddress,
  };
  const sut: AddressProvider = new AddressProviderImpl(addressDataSource);

  it("should return the full address if all om", async () => {
    jest
      .spyOn(addressDataSource, "getFullAddressFromRawAddress")
      .mockResolvedValue(someAddress);
    const actual = await sut.getAddressFromRawAddress(someAddress.rawAddress);
    expect(actual).toEqual(someAddress);
    expect(getFullAddressFromRawAddress).toHaveBeenCalledWith(
      someAddress.rawAddress
    );
  });

  it("should throw AddressException if an AddressException occurs", async () => {
    jest
      .spyOn(addressDataSource, "getFullAddressFromRawAddress")
      .mockRejectedValue(someAddressException);
    await expect(
      sut.getAddressFromRawAddress(someAddress.rawAddress)
    ).rejects.toEqual(someAddressException);
  });

  it("should throw AddressException if an error occurs", async () => {
    jest
      .spyOn(addressDataSource, "getFullAddressFromRawAddress")
      .mockRejectedValue("Error");
    await expect(
      sut.getAddressFromRawAddress(someAddress.rawAddress)
    ).rejects.toEqual(someAddressException);
  });
});
