import { UseCase } from "../../../../src/core/UseCase";
import { SecretService } from "../../../../src/features/Secrets/service/SecretService";
import { GetSecretUseCase } from "../../../../src/features/Secrets/useCase/GetSecretUseCase";
import {
  SecretException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("GetSecretUseCase", () => {
  const get = jest.fn();
  const secretService: SecretService = {
    get,
  };
  const sut: UseCase<string> = new GetSecretUseCase(secretService);

  it("should retrieve the secret by ID", async () => {
    const expected = "SOME_SECRET";
    get.mockResolvedValue(expected);
    const actual = await sut.execute("SOME_ID");
    expect(actual).toEqual(expected);
    expect(get).toHaveBeenCalledWith("SOME_ID");
  });

  it("should return secret exception if an exception occures", async () => {
    const someException = new Error("error");
    const expected = new SecretException({
      messageId: MessageIds.UNEXPECTED,
      message: (someException as unknown) as string,
    });
    get.mockRejectedValue(someException);
    const actual = await sut.execute("SOME_ID");
    expect(actual).toEqual(expected);


  });
});
