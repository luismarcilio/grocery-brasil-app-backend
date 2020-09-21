import { https } from "firebase-functions";
import { getUserFromJwt } from "./firebaseServices";
import { logger } from '../logger';

module.exports = async (request: https.Request, response: any, next: any) => {
    const jwt = request.headers.authorization?.split('Bearer ')[1];

    if (jwt === undefined) {
        response.status(401).send('Unauthorized');
        return;
    }
    try {
        const user = await getUserFromJwt(jwt);
        request.body['user'] = user;
        next();
    } catch (error) {
        logger.warn('Unauthorized: ', JSON.stringify(error));
        response.status(401).send(JSON.stringify(error));
    }


}