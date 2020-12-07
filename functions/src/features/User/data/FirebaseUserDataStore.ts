import { UserDataStore } from "./UserDataStore";
import { User } from "../../../model/User";
import * as NodeCache from "node-cache";
import * as admin from "firebase-admin";
import { UserException, MessageIds } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";
import { withLog, loggerLevel } from "../../../core/Logging";

export class FirebaseUserDataStore implements UserDataStore {
  private readonly cache: NodeCache;
  private readonly firestore: FirebaseFirestore.Firestore;
  private readonly firebaseAuth: admin.auth.Auth;

  constructor(
    cache: NodeCache,
    firestore: FirebaseFirestore.Firestore,
    firebaseAuth: admin.auth.Auth
  ) {
    this.cache = cache;
    this.firestore = firestore;
    this.firebaseAuth = firebaseAuth;
  }

  @withLog(loggerLevel.DEBUG)
  async getUserIdFromJWT(jwt: string): Promise<string> {
    try {
      const decodedIdToken = await this.firebaseAuth.verifyIdToken(jwt);
      return decodedIdToken.uid;
    } catch (error) {
      throw errorToApplicationException(error, UserException);
    }
  }
  @withLog(loggerLevel.DEBUG)
  async getUserFromUserId(userId: string): Promise<User> {
    const user = <User>this.cache.get(userId);
    if (user) {
      return user;
    }
    const docReference = await this.firestore
      .collection("USUARIOS")
      .doc(userId)
      .get();
    if (!docReference.exists) {
      const userRecord = await this.firebaseAuth.getUser(userId);
      if (!userRecord || userRecord.disabled) {
        throw new UserException({
          messageId: MessageIds.NOT_FOUND,
          message: `user not found: ${userId}`,
        });
      }
      const userFromFirebaseAuth: User = {
        userId,
        email: userRecord.email || "",
      };
      return userFromFirebaseAuth;
    }
    this.cache.set(userId, <User>docReference.data());
    return <User>docReference.data();
  }
}
