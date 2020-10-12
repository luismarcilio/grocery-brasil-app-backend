import admin = require("firebase-admin");

export class FirebaseRepository {
    private static instance: FirebaseRepository;
    private app: admin.app.App

    private constructor() {
        console.log('FirebaseRepository.constructor')
        this.app = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
        console.log('FirebaseRepository.constructor finished')

    }

    public static getIinstance() {
        if (!this.instance) {
            this.instance = new FirebaseRepository();
        }
        return this.instance;
    }

    public getApp() {
        return this.app;
    }

}