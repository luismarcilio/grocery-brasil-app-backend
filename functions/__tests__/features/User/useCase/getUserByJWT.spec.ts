import { UseCase } from "../../../../src/core/UseCase";
import { GetUserByJWTUseCase } from "../../../../src/features/User/useCase/GetUserByJWTUseCase";
import { UserRepository } from "../../../../src/features/User/repository/UserRepository";
import { User } from "../../../../src/model/User";
import { MessageIds } from "../../../../src/core/ApplicationException";

describe("getUserByJWT", () => {
  const validateJWT = jest.fn();
  const userRepository: UserRepository = ({
    validateJWT,
  } as unknown) as UserRepository;
  const sut: UseCase<User> = new GetUserByJWTUseCase(userRepository);

  const expectedUser: User = {
    userId: "userId",
    name: "name",
    email: "test@test.com",
    address: { rawAddress: "some address" },
    preferences: { searchRadius: 100 },
  };

  it("should validate JWT and return User", async () => {
    jest.spyOn(userRepository, "validateJWT").mockResolvedValue(expectedUser);
    const actual = await sut.execute("JWT");
    expect(validateJWT).toHaveBeenCalledWith("JWT");
    expect(actual).toEqual(expectedUser);
  });
  it("should should return UserException(unexpected) on exception", async () => {
    jest.spyOn(userRepository, "validateJWT").mockImplementation(() => {
      throw "Error";
    });
    const actual = await sut.execute("JWT");
    expect(actual).toEqual({
      messageId: MessageIds.UNEXPECTED,
      message: "Error",
    });
  });
});
