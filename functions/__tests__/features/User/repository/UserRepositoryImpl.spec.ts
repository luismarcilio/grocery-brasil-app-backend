import { UserRepository } from "../../../../src/features/User/repository/UserRepository";
import { UserDataStore } from "../../../../src/features/User/data/UserDataStore";
import { UserRepositoryImpl } from "../../../../src/features/User/data/UserRepositoryImpl";
import { User } from "../../../../src/model/User";
import {
  UserException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

describe("UserRepositoryImpl", () => {
  const getUserIdFromJWT = jest.fn();
  const getUserFromUserId = jest.fn();

  const userDataStore: UserDataStore = { getUserIdFromJWT, getUserFromUserId };
  const sut: UserRepository = new UserRepositoryImpl(userDataStore);

  describe("getUserByJWT", () => {
    it("should validate jwt and return userID", async () => {
      const expected: User = {
        userId: "userId",
        email: "test@test.com",
        address: { rawAddress: "rawAddress" },
        preferences: { searchRadius: 10 },
      };
      jest.spyOn(userDataStore, "getUserIdFromJWT").mockResolvedValue("userId");
      jest
        .spyOn(userDataStore, "getUserFromUserId")
        .mockResolvedValue(expected);
      const actual = await sut.validateJWT("jwt");
      expect(actual).toEqual(expected);
      expect(getUserIdFromJWT).toHaveBeenCalledWith("jwt");
      expect(getUserFromUserId).toHaveBeenCalledWith("userId");
    });
    it("should return UserException with proper description if jwt is invalid", async () => {
      const expected = new UserException({
        messageId: MessageIds.UNEXPECTED,
        message: "Invalid Date",
      });
      jest
        .spyOn(userDataStore, "getUserIdFromJWT")
        .mockRejectedValue("Invalid Date");
      const actual = await sut.validateJWT("jwt");
      expect(actual).toEqual(expected);
      expect(getUserIdFromJWT).toHaveBeenCalledWith("jwt");
    });

    it("should return UserException on exception thrown", async () => {
      const expected = new UserException({
        messageId: MessageIds.UNEXPECTED,
        message: "Error",
      });
      jest
        .spyOn(userDataStore, "getUserIdFromJWT")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((_) => {
          throw "Error";
        });
      const actual = await sut.validateJWT("jwt");
      expect(actual).toEqual(expected);
      expect(getUserIdFromJWT).toHaveBeenCalledWith("jwt");
    });
  });
});
