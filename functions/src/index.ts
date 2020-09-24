import * as functions from 'firebase-functions';
import * as express from 'express';
import * as mg from './business/mg/parseNf';
import * as rj from './business/rj/parseNf';
import { saveNf, getApp, setupFirebase, saveThumbnail, normalizeProduct, getProductById, getGeolocationApiKey } from './business/firebaseServices';
import { getFullAddress, insertIntoElasticSearch, getAutocompleteByPhrasePrefix } from './business/apiServices';
import { Purchase } from './model/Purchase';
import * as cors from 'cors';
import { logger } from './logger';
import { Product } from './model/Product';

const authenticate = require('./business/authenticate');



const parseMap: { [key: string]: (html: string) => Purchase } = {
    "mg": mg.parseNf,
    "rj": rj.parseNf
};

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
app.use(authenticate);
app.use((_req: any, _res: any, next: any) => {
    if (!getApp()) {
        setupFirebase();
    }
    next();
});
app.get('/geolocationApiKey'
    , async (request, response) => {
        try {
            const geolocationApiKey: string = await getGeolocationApiKey();
            response.status(200).send({ geolocationApiKey });
            return;
        } catch (error) {
            response.status(500).send(error);
            return;
        }
    }
);
app.get('/autocomplete/:phrase'
    , async (request, response) => {
        if (!request.params.phrase) {
            response.status(400).send('Bad Request');
            return;
        }
        const responseData = await getAutocompleteByPhrasePrefix(request.params.phrase);
        const productList = await Promise.all(responseData.map(
            async function mapToProduct(p: { firebaseDocId: string; }): Promise<Product | undefined> {
                const product = getProductById(p.firebaseDocId);
                return product;
            }


        ));
        response.status(200).send(productList);
        return;
    }
);
app.post('/:state',
    async (request, response) => {
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
        const purchase = parseMap[request.params.state](request.body.html);
        logger.info('purchase: ', purchase);

        if (purchase === undefined) {
            logger.error('Cannot parse nf', request.body);
            logger.error('Bad Request');
            response.status(400).send('Bad Request');
            return;
        }

        purchase.user = request.body['user'];
        purchase.fiscalNote.company.address = await getFullAddress(purchase.fiscalNote.company.address.rawAddress);
        try {
            await saveNf(purchase);
            response.status(200).send('ok');
            return;

        } catch (error) {
            logger.error(error);
            response.status(500).send(`error: ${error}`);
            return;
        }
    }
);
exports.saveNf = functions.https.onRequest(app);

exports.uploadToElasticsearch = functions.firestore
    .document('PRODUTOS/{productId}')
    .onWrite(async (change, _context) => {
        if (!change.after.exists) {
            logger.info('change.after.exists is falsee');
            return null;
        }
        const document = change.after.data();
        if (!document) {
            logger.info('change.after.data() is falsee');
            return null;
        }
        await insertIntoElasticSearch(
            {
                eanCode: change.after.data()?.eanCode,
                name: change.after.data()?.name,
                firebaseDocId: change.after.id
            }
        );
        return null;
    });


exports.uploadThumbnail = functions.firestore
    .document('PRODUTOS/{productId}')
    .onWrite(async (change, _context) => {
        if (!change.after.exists) {
            logger.info('change.after.exists is falsee');
            return null;
        }
        const document = change.after.data();
        if (!document) {
            logger.info('change.after.data() is falsee');
            return null;
        }

        if (document?.normalized && document?.thumbnail?.includes('https://storage.googleapis.com')) {
            logger.info('product already normalized');
            return null;
        }


        const product: Product | undefined = await normalizeProduct(document.eanCode);
        if (product === undefined) {
            return null;
        }
        if (product.thumbnail) {
            try {
                product.thumbnail = await saveThumbnail(product.thumbnail)
                logger.info('SUCESSO: ', document.thumbnail);
            } catch (error) {
                logger.error(error);
                throw error;
            }
        }
        return change.after.ref.set(product);
    });
