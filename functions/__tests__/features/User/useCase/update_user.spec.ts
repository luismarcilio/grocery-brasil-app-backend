import { User } from "../../../../src/model/User";
import { UseCase } from "../../../../src/core/UseCase";
import { UpdateUser } from "../../../../src/features/User/useCase/UpdateUser";
import { UserRepository } from "../../../../src/features/User/repository/UserRepository";

describe("update user address and prefferences", () => {
  const createUser = jest.fn();
  const updateUser = jest.fn();
  const validateJWT = jest.fn();
  const userRepositoryStub: UserRepository = {
    createUser,
    updateUser,
    validateJWT,
  };

  it("update user preferences", async () => {
    const sut: UseCase<User> = new UpdateUser(userRepositoryStub);
    const expected: User = {
      address: { rawAddress: "" },
      email: "email",
      userId: "1",
      name: "Name",
      preferences: { searchRadius: 10000 },
    };
    updateUser.mockResolvedValue(expected);
    const user = { ...expected };
    const actual = await sut.execute(user);
    expect(actual).toEqual(user);
  });
});
