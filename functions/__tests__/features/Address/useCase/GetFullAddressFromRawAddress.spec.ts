import { Address } from "../../../../src/model/Address";
import { UseCase } from "../../../../src/core/UseCase";
import { AddressService } from "../../../../src/features/Address/service/AddressService";
import { GetFullAddressFromRawAddressUseCase } from "../../../../src/features/Address/useCase/GetFullAddressFromRawAddress";
import { someAddress } from "../fixtures/fixtures";

describe("GetFullAddressFromRawAddress", () => {
  const getFullAddress = jest.fn();
  const addressServices: AddressService = {
    getFullAddress,
  };

  const sut: UseCase<Address> = new GetFullAddressFromRawAddressUseCase(
    addressServices
  );
  it("should Return full address from raw address", async () => {
    jest
      .spyOn(addressServices, "getFullAddress")
      .mockResolvedValue(someAddress);
    const actual = await sut.execute(someAddress.rawAddress);
    expect(actual).toEqual(someAddress);
    expect(getFullAddress).toBeCalledWith(someAddress.rawAddress);
  });
});
