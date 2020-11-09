import { HttpAdapter } from "../../../../src/features/Http/adapter/HttpAdapter";
import { AddressDataSource } from "../../../../src/features/Address/data/AddressDataSource";
import { AddressDataSourceGoogleImpl } from "../../../../src/features/Address/data/AddressDataSourceGoogleImpl";
import { someAddress, googleJsonAddress } from "../fixtures/fixtures";
import {
  AddressException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { SecretsProvider } from "../../../../src/features/Secrets/provider/SecretsProvider";

describe("AddressDataSourceGoogleImpl", () => {
  const getSecret = jest.fn();
  const get = jest.fn();
  const getBuffer = jest.fn();
  const post = jest.fn();

  const apiKeyProvider: SecretsProvider = {
    getSecret,
  };

  const httpAdapter: HttpAdapter = {
    get,
    getBuffer,
    post,
  };

  const sut: AddressDataSource = new AddressDataSourceGoogleImpl(
    apiKeyProvider,
    httpAdapter
  );

  it("should get google address and parse google json address to Address", async () => {
    jest.spyOn(apiKeyProvider, "getSecret").mockResolvedValue("apiKey");
    jest
      .spyOn(httpAdapter, "get")
      .mockResolvedValue({ status: 200, body: googleJsonAddress });

    const actual = await sut.getFullAddressFromRawAddress(
      someAddress.rawAddress
    );
    expect(actual).toEqual(someAddress);
    expect(getSecret).toBeCalledWith("GEOLOCATION_API_KEY");
    expect(get).toBeCalledWith(
      "https://maps.googleapis.com/maps/api/geocode/json?address=Av.%20Epit%C3%A1cio%20Pessoa%2C%202566%20-%20Ipanema%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022471-003%2C%20Brasil&key=apiKey&language=pt-BR"
    );
  });

  it("should return exception if status != 200", async () => {
    jest.spyOn(apiKeyProvider, "getSecret").mockResolvedValue("apiKey");
    jest
      .spyOn(httpAdapter, "get")
      .mockResolvedValue({ status: 500, body: "server error" });

    await expect(
      sut.getFullAddressFromRawAddress(someAddress.rawAddress)
    ).rejects.toEqual(
      new AddressException({
        messageId: MessageIds.UNEXPECTED,
        message: "server error",
      })
    );
  });
  it("should check google status code", async () => {
    const googleErrorFixture = { ...googleJsonAddress };
    googleErrorFixture.status = "ZERO_RESULTS";
    jest.spyOn(apiKeyProvider, "getSecret").mockResolvedValue("apiKey");
    jest
      .spyOn(httpAdapter, "get")
      .mockResolvedValue({ status: 200, body: googleErrorFixture });
    await expect(
      sut.getFullAddressFromRawAddress(someAddress.rawAddress)
    ).rejects.toEqual(
      new AddressException({
        messageId: MessageIds.UNEXPECTED,
        message: "ZERO_RESULTS",
      })
    );
  });
  it('should throw UNEXPECTED address exception if impossible to parse, with message "impossible to parse"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jest.spyOn(apiKeyProvider, "getSecret").mockImplementation((_) => {
      throw "Error";
    });
    await expect(
      sut.getFullAddressFromRawAddress(someAddress.rawAddress)
    ).rejects.toEqual(
      new AddressException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
});
