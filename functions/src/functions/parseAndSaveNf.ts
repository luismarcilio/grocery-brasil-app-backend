import { logger } from "../logger";
import { Purchase } from "../model/Purchase";

import * as mg from '../business/mg/parseNf';
import * as rj from '../business/rj/parseNf';
import { GeolocationApiServicesImplementation } from "../services/GeolocationApiServices";
import { GCPGeolocationApiRepository } from "../repository/GeoocationApiRepository";
import { FirebaseSecretManagerService, } from '../services/SecretManagerServices';
import { GCPSecretManagerRepository } from '../repository/SecretManagerRepository';
import { project_id } from '../configuration';
import { PurchaseServicesImplementation } from '../services/PurchaseServices';
import { FirebasePurchaseRepository } from "../repository/PurchaseRepository";


const parseMap: { [key: string]: (html: string) => Purchase } = {
    "mg": mg.parseNf,
    "rj": rj.parseNf
};

export const parseAndSaveNf = async (request: any, response: any) => {
    console.log('parseAndSaveNf');
    const firebaseSecretManagerService = FirebaseSecretManagerService.getInstance(
        GCPSecretManagerRepository.getInstance(project_id)
    );
    const secret = await firebaseSecretManagerService.getGeolocationApiKey();
    const geolocationApiServices = GeolocationApiServicesImplementation.getInstance(
        GCPGeolocationApiRepository.getInstance(secret)
    );

    const purchaseServices = PurchaseServicesImplementation.getInstance(
        FirebasePurchaseRepository.getInstance()
    );


    if (request.body.html === undefined) {
        logger.error('request.body', request.body);
        logger.error('Bad Request');
        response.status(400).send('Bad Request');
        return;
    }
    if (!Object.keys(parseMap).includes(request.params.state)) {
        logger.error('request.body', request.body);
        logger.error('Bad Request');
        response.status(400).send('Bad Request');
        return;
    }
    //Parse NF
    const purchase = parseMap[request.params.state](request.body.html);
    logger.info('purchase: ', purchase);

    if (purchase === undefined) {
        logger.error('Cannot parse nf', request.body);
        logger.error('Bad Request');
        response.status(400).send('Bad Request');
        return;
    }

    purchase.user = request.body['user'];
    purchase.fiscalNote.company.address = await geolocationApiServices.getFullAddress(purchase.fiscalNote.company.address.rawAddress);
    //Save NF
    try {
        await purchaseServices.savePurchase(purchase);
        response.status(200).send('ok');
        return;

    } catch (error) {
        logger.error(error);
        response.status(500).send(`error: ${error}`);
        return;
    }
}
