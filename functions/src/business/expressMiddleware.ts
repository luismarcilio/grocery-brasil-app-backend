import { https } from "firebase-functions";
import { logger } from '../logger';
import { FirebaseUserServices } from "../services/UserServices";
import { FirebaseRepository } from "../repository/FirebaseRepository";

export const authenticate = async (request: https.Request, response: any, next: any) => {
    console.log('authenticate')
    const userServices = FirebaseUserServices.getInstance();
    const jwt = request.headers.authorization?.split('Bearer ')[1];
    if (jwt === undefined) {
        response.status(401).send('Unauthorized');
        return;
    }
    try {
        const user = await userServices.getUserFromJwt(jwt);
        request.body['user'] = user;
        next();
    } catch (error) {
        logger.warn('Unauthorized: ', JSON.stringify(error));
        response.status(401).send(JSON.stringify(error));
    }
}

export const initializeFirebase = async (request: https.Request, response: any, next: any) => {
    console.log('initializeFirebase')
    FirebaseRepository.getIinstance();
    next();
}