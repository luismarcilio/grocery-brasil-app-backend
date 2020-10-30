import { UserDataStore } from "./UserDataStore";
import { User } from "../../../model/User";
import * as NodeCache from "node-cache";
import * as admin from "firebase-admin";
import { UserException, MessageIds } from "../../../core/ApplicationException";
import { errorToApplicationException } from "../../../core/utils";

export class VerifyIdTokenWrapper {
  verifyIdToken = (jwt: string): Promise<admin.auth.DecodedIdToken> =>
    admin.auth().verifyIdToken(jwt);
}
export class FirebaseUserDataStore implements UserDataStore {
  private readonly cache: NodeCache;
  private readonly verifyIdToken: VerifyIdTokenWrapper;
  private readonly firestore: FirebaseFirestore.Firestore;

  constructor(
    cache: NodeCache,
    verifyIdToken: VerifyIdTokenWrapper,
    firestore: FirebaseFirestore.Firestore
  ) {
    this.cache = cache;
    this.verifyIdToken = verifyIdToken;
    this.firestore = firestore;
  }

  getUserIdFromJWT = async (jwt: string): Promise<string> => {
    try {
      const decodedIdToken = await this.verifyIdToken.verifyIdToken(jwt);
      return decodedIdToken.uid;
    } catch (error) {
      throw errorToApplicationException(error, UserException);
    }
  };
  getUserFromUserId = async (userId: string): Promise<User> => {
    const user = <User>this.cache.get(userId);
    if (user) {
      return user;
    }
    const docReference = await this.firestore
      .collection("USUARIOS")
      .doc(userId)
      .get();
    if (!docReference.exists) {
      throw new UserException({
        messageId: MessageIds.NOT_FOUND,
        message: `user not found: ${userId}`,
      });
    }
    this.cache.set(userId, <User>docReference.data());
    return <User>docReference.data();
  };
}
