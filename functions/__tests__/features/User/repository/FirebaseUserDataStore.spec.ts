/* eslint-disable @typescript-eslint/no-unused-vars */
import * as NodeCache from "node-cache";
import { UserDataStore } from "../../../../src/features/User/data/UserDataStore";
import { FirebaseUserDataStore } from "../../../../src/features/User/data/FirebaseUserDataStore";
import {
  UserException,
  MessageIds,
} from "../../../../src/core/ApplicationException";
import { User } from "../../../../src/model/User";
import { admin } from "firebase-admin/lib/auth";

describe("FirebaseUserDataStore", () => {
  const verifyIdToken = jest.fn();
  const getUser = jest.fn();
  const firebaseAuth: admin.auth.Auth = ({
    verifyIdToken,
    getUser,
  } as unknown) as admin.auth.Auth;

  const collection = jest.fn((_) => ({ doc }));
  const firestore = ({
    collection,
  } as unknown) as FirebaseFirestore.Firestore;
  const doc = jest.fn((_) => ({ get: getFromFirebase }));
  const getFromFirebase = jest.fn(() =>
    Promise.resolve({ exists: true, data })
  );
  const data = jest.fn(() => expected);

  //NodeCache could be an adapter here but very unlikely this dependency will, in the future, break the OCP

  const set = jest.fn();
  const get = jest.fn();
  const cache: NodeCache = ({ set, get } as unknown) as NodeCache;

  const sut: UserDataStore = new FirebaseUserDataStore(
    cache,
    firestore,
    firebaseAuth
  );
  const expected: User = {
    userId: "userId",
    email: "test@test.com",
    address: { rawAddress: "rawAddress" },
    preferences: { searchRadius: 10 },
  };
  const expectedUserFromAuth: admin.auth.UserRecord = ({
    uid: "userId",
    emailVerified: true,
    disabled: false,
    email: "test@test.com",
  } as unknown) as admin.auth.UserRecord;
  describe("getUserIdFromJWT", () => {
    it("should validate jwt and return userId", async () => {
      verifyIdToken.mockImplementation((_) =>
        Promise.resolve({ uid: "userId" })
      );
      const actual = await sut.getUserIdFromJWT("jwt");
      expect(actual).toEqual("userId");
      expect(verifyIdToken).toBeCalledWith("jwt");
    });
    it("should throw a UserException if userId is not valid", async () => {
      verifyIdToken.mockImplementation((_) => Promise.reject("Error"));

      await expect(sut.getUserIdFromJWT("jwt")).rejects.toEqual(
        new UserException({
          messageId: MessageIds.UNEXPECTED,
          message: "Error",
        })
      );
    });
  });
  describe("getUserFromUserId", () => {
    it("should get user data from cache if exists", async () => {
      get.mockImplementation((_) => expected);
      const actual = await sut.getUserFromUserId("userId");
      expect(actual).toEqual(expected);
    });

    it("should get user data from auth if not exists in database", async () => {
      get.mockImplementation((_) => undefined);
      getFromFirebase.mockImplementationOnce(() =>
        Promise.resolve({ exists: false, data })
      );
      getUser.mockResolvedValue(expectedUserFromAuth);
      const actual = await sut.getUserFromUserId("userId");
      expect(get).toBeCalledWith("userId");
      expect(collection).toBeCalledWith("USUARIOS");
      expect(doc).toBeCalledWith("userId");
      expect(actual).toEqual({ userId: "userId", email: "test@test.com" });
    });

    it("should get user data from database if not exists in cache", async () => {
      get.mockImplementation((_) => undefined);
      data.mockReturnValue(expected);
      const actual = await sut.getUserFromUserId("userId");
      expect(get).toBeCalledWith("userId");
      expect(collection).toBeCalledWith("USUARIOS");
      expect(doc).toBeCalledWith("userId");
      expect(set).toBeCalledWith("userId", expected);
      expect(actual).toEqual(expected);
    });
    it("should return error UserException NOT FOUND if not found", async () => {
      get.mockImplementation((_) => undefined);
      getFromFirebase.mockResolvedValue({ exists: false, data });
      getUser.mockResolvedValue({ disabled: true });

      data.mockReturnValue(expected);
      await expect(sut.getUserFromUserId("userId")).rejects.toEqual(
        new UserException({
          messageId: MessageIds.NOT_FOUND,
          message: "user not found: userId",
        })
      );
    });
    //   it("should throw error UserException UNEXPECTED if an exception is thrown", () => {});
  });
});
