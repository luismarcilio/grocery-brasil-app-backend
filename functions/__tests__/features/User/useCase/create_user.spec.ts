import { User } from "../../../../src/model/User";
import { UseCase } from "../../../../src/core/UseCase";
import { CreateUser } from "../../../../src/features/User/useCase/CreateUser";
import { UserRepository } from "../../../../src/features/User/repository/UserRepository";

describe("create user", () => {
  const createUser = jest.fn();
  const updateUser = jest.fn();
  const validateJWT = jest.fn();
  const userRepositoryStub: UserRepository = {
    createUser,
    updateUser,
    validateJWT,
  };

  it("should call create user on repository and return status", async () => {
    const sut: UseCase<User> = new CreateUser(userRepositoryStub);
    const user: User = {
      address: {rawAddress: ""},
      email: "email",
      userId: "1",
      name: "Name",
      preferences: { searchRadius: 10000 },
    };
    createUser.mockReturnValue(user);
    const actual = await sut.execute(user);
    expect(actual).toEqual(user);
  });
});
