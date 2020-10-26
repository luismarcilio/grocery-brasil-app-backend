import { SecretManagerServiceClient } from "@google-cloud/secret-manager/build/src/v1";

import { SecretsProvider } from "../../../../src/features/Secrets/provider/SecretsProvider";
import { SecretsProviderFirebaseImpl } from "../../../../src/features/Secrets/provider/SecretsProviderFirebaseImpl";
import {
  SecretException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("SecretsProviderFirebaseImpl", () => {
  const expected = "SECRET";
  const expectedResponse = [{ payload: { data: expected } }];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const accessSecretVersion = jest.fn((_) => Promise.resolve(expectedResponse));
  const secretManagerServiceClient: SecretManagerServiceClient = ({
    accessSecretVersion,
  } as unknown) as SecretManagerServiceClient;
  const sut: SecretsProvider = new SecretsProviderFirebaseImpl(
    secretManagerServiceClient
  );
  it("should get the api key when all is ok", async () => {
    const actual = await sut.getSecret("API_KEY");

    expect(actual).toEqual(expected);
    expect(accessSecretVersion).toBeCalledWith({
      name: "projects/301850316531/secrets/API_KEY/versions/latest",
    });
  });
  it("should throw an application exception NOT-FOUND if not found", async () => {
    jest
      .spyOn(secretManagerServiceClient, "accessSecretVersion")
      .mockImplementation(() => [{ payload: { data: undefined } }]);

    await expect(sut.getSecret("API_KEY")).rejects.toEqual(
      new SecretException({
        messageId: MessageIds.NOT_FOUND,
        message: "Secret not found: API_KEY",
      })
    );
  });
  it("should throw an Application exception on error", async () => {
    jest
      .spyOn(secretManagerServiceClient, "accessSecretVersion")
      .mockImplementation(() => {
        throw "Error";
      });

    await expect(sut.getSecret("API_KEY")).rejects.toEqual(
      new SecretException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      })
    );
  });
});
