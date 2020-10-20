import { User } from "../../../../src/model/User";
import { UseCase } from "../../../../src/core/UseCase";
import { UpdateUser } from "../../../../src/features/User/useCase/UpdateUser";
import { UserRepository } from "../../../../src/features/User/repository/UserRepository";
import { UserException } from "../../../../src/core/ApplicationException";

describe("update user address and prefferences", () => {
  const userRepositoryStub: UserRepository = {
    createUser: (user: User): Promise<User | UserException> => {
      return Promise.resolve(user);
    },
    updateUser: (user: User): Promise<User | UserException> => {
      const response = { ...user };
      response.address = user.address;
      response.preferences = user.preferences;
      return Promise.resolve(response);
    },
  };

  it("update user preferences", async () => {
    const sut: UseCase<User> = new UpdateUser(userRepositoryStub);
    const expected: User = {
      email: "email",
      userId: "1",
      name: "Name",
      preferences: { searchRadius: 10000 },
    };
    const user = { ...expected };
    const actual = await sut.execute(user);
    expect(actual).toEqual(user);
  });
});
