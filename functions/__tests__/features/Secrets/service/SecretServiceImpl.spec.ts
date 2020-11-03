import { SecretService } from "../../../../src/features/Secrets/service/SecretService";
import { SecretServiceImpl } from "../../../../src/features/Secrets/service/SecretServiceImpl";
import { SecretsProvider } from "../../../../src/features/Secrets/provider/SecretsProvider";
import {
  SecretException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
describe("SecretServiceImpl", () => {
  const getSecret = jest.fn();
  const secretProvider: SecretsProvider = {
    getSecret,
  };
  const sut: SecretService = new SecretServiceImpl(secretProvider);

  it("should retrieve the secret", async () => {
    const expected = "SOME_SECRET";
    getSecret.mockResolvedValue(expected);
    const actual = await sut.get("some_id");
    expect(actual).toEqual(expected);
    expect(getSecret).toHaveBeenCalledWith("some_id");
  });
  it("should throw exception if some error occurs", async () => {
    const someException = new Error("error");
    const expected = new SecretException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    getSecret.mockRejectedValue(someException);
    await expect(sut.get("some_id")).rejects.toEqual(expected);
  });
});
