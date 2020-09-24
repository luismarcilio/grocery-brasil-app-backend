import * as admin from 'firebase-admin';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { User } from '../model/User';
import { Purchase } from '../model/Purchase';
import { getNormailizedProductByEanCode } from './apiServices';
import * as FileType from 'file-type';
import { Storage } from '@google-cloud/storage'
import axios, { AxiosResponse } from 'axios';
import * as sharp from "sharp";
import { Product } from '../model/Product';
import { logger } from '../logger';

const client = new SecretManagerServiceClient();
const storage = new Storage();

// const httpAdapter = require('axios/lib/adapters/http');


let geolocationApiKey: string;
let bluesoftCosmosApiKey: string;
let elasticSearchSecret: any;
let app: admin.app.App;
export const getApp = () => {
    return app;
}

export function setupFirebase() {
    app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

export async function getUserFromJwt(jwt: string): Promise<User> {
    if (!app) {
        setupFirebase();
    }
    const decodedIdToken = await admin.auth().verifyIdToken(jwt);
    const user: User = {
        userId: decodedIdToken.uid,
        email: decodedIdToken.email || ""
    }
    return user;
}

export async function saveNf(nf: Purchase) {
    await saveNfFull(nf);
    await saveNfResume(nf);
    await saveNfItems(nf);

}
async function saveNfFull(nf: Purchase) {
    const db = admin.firestore();
    const docId = getDocId(nf);
    if (!nf.user?.userId) {
        throw Error(`nf.user?.userId is undefined: ${JSON.stringify(nf)}`);
    }
    await db.collection('COMPRAS').doc(nf.user?.userId).set(nf.user);
    const dbNfDoc = db.collection('COMPRAS').doc(nf.user?.userId).collection('COMPLETA').doc(docId);
    const writeResult = await dbNfDoc.set(nf);
    logger.info('saveNfFull(nf: Purchase)', writeResult);
    logger.info('purchase: ', db.collection('COMPRAS').doc(nf.user?.userId).collection('COMPLETA').doc(docId).get());
}
async function saveNfResume(nf: Purchase) {
    const db = admin.firestore();
    const docId = getDocId(nf);
    const nfResume = {
        company: nf.fiscalNote.company,
        date: nf.fiscalNote.date.toISOString(),
        totalAmount: nf.totalAmount
    };
    if (!nf.user?.userId) {
        throw Error(`nf.user?.userId is undefined: ${JSON.stringify(nf)}`);
    }
    const dbNfDoc = db.collection('COMPRAS').doc(nf.user?.userId).collection('RESUMIDA').doc(docId);
    const writeResult = await dbNfDoc.set(nfResume);
    logger.info('saveNfResume(nf: Purchase)', JSON.stringify(writeResult));

}

function getProductCode(product: Product): string {
    const normalizedItemName = product.name.replace(/[^a-zA-Z0-9]+/g, '-');
    const code = !product.eanCode ? product.ncmCode + '-' + normalizedItemName : product.eanCode;
    return code;

}

async function saveNfItems(nf: Purchase) {
    const date: string = nf.fiscalNote.date.toISOString();
    const db = admin.firestore();
    const docId = getDocId(nf);
    const promises: Promise<any>[] = [Promise.resolve()];
    nf.purchaseItemList.forEach(async item => {

        const itemDoc = {
            "company": nf.fiscalNote.company,
            "unityValue": item.unityValue,
            date
        };
        const code = getProductCode(item.product);
        logger.debug(`code: ${code}, docId: ${docId}`);
        // const dbNfItemDoc = db.collection(code).doc(docId);
        const dbNfItemDoc = db.collection('PRODUTOS').doc(code).collection('COMPRAS').doc(docId);
        promises.push(dbNfItemDoc.set(itemDoc));
        if (code !== item.product.eanCode) {
            promises.push(saveProductByNcmCode(item.product));
        } else {
            promises.push(saveProductByEanCode(item.product))
        }
    });
    await Promise.all(promises);
}

async function existsProduct(code: string): Promise<boolean> {
    const db = admin.firestore();
    const dbNormalizedProdRef = db.collection('PRODUTOS').doc(code);
    const docRef = await dbNormalizedProdRef.get();
    return docRef.exists;
}

export async function saveProductByNcmCode(product: Product) {
    const code = getProductCode(product);

    if (await existsProduct(code)) {
        return
    }
    const db = admin.firestore();
    const dbNormalizedProdRef = db.collection('PRODUTOS').doc(code);
    const writeResult = await dbNormalizedProdRef.set(product);
    logger.info('PRODUCT writeResult: ', writeResult);
    return;
}

export async function saveProductByEanCode(product: Product) {

    const code = getProductCode(product);

    const db = admin.firestore();
    const dbNormalizedProdRef = db.collection('PRODUTOS').doc(code);
    const docRef = await dbNormalizedProdRef.get();
    const data = docRef.data();
    // let normalizedProduct: Product;
    if (!data || !data.normalized) {
        // normalizedProduct = await normalizeProduct(product);
        const writeResult = await db.collection('PRODUTOS').doc(code).set(product);
        logger.info('PRODUCT writeResult: ', writeResult);
    }
    return;
}

export async function normalizeProduct(eanCode: string): Promise<Product | undefined> {
    let normalizedProduct: any;
    normalizedProduct = await getNormailizedProductByEanCode(eanCode);
    if (normalizedProduct === undefined) {
        return;
    }
    const product: Product = {
        name: normalizedProduct.description,
        eanCode,
        ncmCode: normalizedProduct.ncm.code,
        unity: {
            name: normalizedProduct.gtins[0].commercial_unit.type_packaging
        },
        thumbnail: normalizedProduct.thumbnail
    };
    return product;
}

export async function saveThumbnail(url: string): Promise<string | undefined> {
    logger.info(`saveThumbnail(${url})`)
    const urlArray = url.split('/');
    const fileName = urlArray[urlArray.length - 1].replace(/ /g, "_");
    let response: AxiosResponse<ArrayBuffer>;
    try {
        response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'accept': 'image/*'
            },
            timeout: 30000
        });
    } catch (error) {
        logger.error(`error getting ${url}: `, JSON.stringify(error));
        throw error;
    }
    if (response.status !== 200) {
        throw Error(`get(${url}) returned status ${response.status}: ${response.data}`);
    }
    const fileType = await FileType.fromBuffer(response.data);
    if (!fileType?.mime || !fileType.mime.toString().includes('image')) {
        logger.error(`wrong file type ${fileType?.mime} for ${url} `);
        return;
    }
    const resizedImage = await sharp(Buffer.from(response.data)).resize(100, 100).toBuffer();
    const writeStream = storage.bucket('grocery-brasil-app-thumbnails').file(`${fileName}`)
        .createWriteStream({
            gzip: true,
            public: true,
            resumable: false,
            metadata: {
                contentType: fileType?.mime
            }
        });
    writeStream
        .on('error', (err) => { logger.error('writeStream: ', JSON.stringify(err)); throw err })
        .on('finish', () => logger.info(`finished saving https://storage.googleapis.com/grocery-brasil-app-thumbnails/${fileName}`))
        .end(resizedImage);
    return `https://storage.googleapis.com/grocery-brasil-app-thumbnails/${fileName}`;
}

function getDocId(nf: Purchase): string {
    return nf.fiscalNote.accessKey;
}

export async function getBluesoftCosmosApiKey(): Promise<string> {
    if (!bluesoftCosmosApiKey) {
        bluesoftCosmosApiKey = await getSecret('BLUESOFT_COSMOS_API');
    }

    return bluesoftCosmosApiKey;
}

export async function getGeolocationApiKey(): Promise<string> {
    if (!geolocationApiKey) {
        geolocationApiKey = await getSecret('GEOLOCATION_API_KEY');

    }
    return geolocationApiKey;

}

export async function getElasticSearchSecret(): Promise<any> {
    if (!elasticSearchSecret) {
        elasticSearchSecret = await getSecret('ELASTICSEARCH');

    }
    return JSON.parse(elasticSearchSecret);

}

export async function getSecret(secretId: string): Promise<string> {

    const [secret] = await client.accessSecretVersion({
        name: `projects/301850316531/secrets/${secretId}/versions/latest`
    });
    if (secret && secret.payload && secret.payload.data) {
        const secretKey = secret.payload.data.toString();
        return secretKey;
    }
    else {
        throw new Error(`Cannot get ${secretId}`);
    }
}

export async function getProductById(docId: string): Promise<Product | undefined> {
    const db = admin.firestore();
    const dbNormalizedProdRef = db.collection('PRODUTOS').doc(docId);
    const docRef = await dbNormalizedProdRef.get();
    if (!docRef.exists) {
        return;
    }
    const data = docRef.data();
    if (!data) {
        return;
    }
    return <Product>data;
}


