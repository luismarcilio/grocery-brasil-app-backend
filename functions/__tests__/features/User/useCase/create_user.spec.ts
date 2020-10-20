import { User } from "../../../../src/model/User";
import { UseCase } from "../../../../src/core/UseCase";
import { CreateUser } from "../../../../src/features/User/useCase/CreateUser";
import { UserRepository } from "../../../../src/features/User/repository/UserRepository";
import { Failure } from "../../../../src/core/Failure";

describe("create user", () => {
  const userRepositoryStub: UserRepository = {
    createUser: (user: User): Promise<User | Failure> => Promise.resolve(user),
    updateUser: (user: User): Promise<User | Failure> => Promise.resolve(user),
  };

  it("should call create user on repository and return status", async () => {
    const sut: UseCase<User> = new CreateUser(userRepositoryStub);
    const user: User = {
      email: "email",
      userId: "1",
      name: "Name",
      preferences: { searchRadius: 10000 },
    };
    const actual = await sut.execute(user);
    expect(actual).toEqual(user);
  });
});
