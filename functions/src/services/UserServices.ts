import { User } from "../model/User";
import { FirebaseRepository } from "../repository/FirebaseRepository";
import admin = require("firebase-admin");

export class UserServicesException extends Error {}

export abstract class UserServices {
  abstract async getUserFromJwt(jwt: string): Promise<User>;
}

export class FirebaseUserServices extends UserServices {
  private static instance: FirebaseUserServices;

  private constructor() {
    super();
    FirebaseRepository.getIinstance().getApp();
  }

  public static getInstance(): UserServices {
    if (!this.instance) {
      this.instance = new FirebaseUserServices();
    }
    return this.instance;
  }

  async getUserFromJwt(jwt: string): Promise<User> {
    const decodedIdToken = await admin.auth().verifyIdToken(jwt);
    const user: User = {
      address: { rawAddress: "" },
      userId: decodedIdToken.uid,
      email: decodedIdToken.email || "",
      preferences: { searchRadius: 30 },
    };
    return user;
  }
}
