import * as functions from 'firebase-functions';
import { logger } from '../logger';
import { Product } from '../model/Product';
import { Purchase } from '../model/Purchase';
import { PurchaseItem } from '../model/PurchaseItem';
import axios, { AxiosResponse } from 'axios';
import sharp = require('sharp');
import * as FileType from 'file-type';
import { FilestoreServices, FilestoreServicesImplementation } from '../services/FilestoreServices';
import { GcpFilestoreRepository } from '../repository/FilestoreRepository';
import { ProductInformationService, ProductInformationServiceImplementation } from '../services/ProductInformationServices';
import { BluesSoftCosmosInformationRepository } from '../repository/ProductsInformationRepository';
import { FirebaseSecretManagerService } from '../services/SecretManagerServices';
import { GCPSecretManagerRepository } from '../repository/SecretManagerRepository';
import { project_id } from '../configuration';
import { ProductServices, ProductServicesImplementation } from '../services/ProductServices';
import { FirebaseProductRepository } from '../repository/ProductsRepository';
import { PurchaseServices, PurchaseServicesImplementation } from '../services/PurchaseServices';
import { FirebasePurchaseRepository } from '../repository/PurchaseRepository';
import { FirebaseRepository } from '../repository/FirebaseRepository';


exports.uploadThumbnail = functions.firestore
    .document('PRODUTOS/{productId}')
    .onWrite(async (change, _context) => {
        FirebaseRepository.getIinstance();

        const productServices: ProductServices = ProductServicesImplementation.getInstance(
            FirebaseProductRepository.getInstance()
        );

        const purchaseServices: PurchaseServices = PurchaseServicesImplementation.getInstance(
            FirebasePurchaseRepository.getInstance()
        );

        if (!change.after.exists) {
            logger.info('change.after.exists is falsee');
            return null;
        }
        const document: Product = <Product>change.after.data();
        if (!document) {
            logger.info('change.after.data() is falsee');
            return null;
        }

        if (document?.normalized && document?.thumbnail?.includes('https://storage.googleapis.com')) {
            logger.info('product already normalized');
            return null;
        }


        const product: Product | undefined = await normalizeProduct(document);
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
        const docIds: string[] = await productServices.getPurchaseIdsForProduct(change.after.id);
        console.log('docIds', docIds);
        docIds.forEach(async docId => {
            const purchase: Purchase = await purchaseServices.getPurchaseById(docId);

            purchase.purchaseItemList.forEach((purchaseItem: PurchaseItem) => {
                if (purchaseItem.product.eanCode === product.eanCode) {
                    purchaseItem.product.thumbnail = product.thumbnail;
                }
            });
            await purchaseServices.updatePurchaseThumbnails(purchase);

        })
        return change.after.ref.set(product);
    });


async function normalizeProduct(product: Product): Promise<Product | undefined> {

    const secretManagerService = FirebaseSecretManagerService.getInstance(GCPSecretManagerRepository.getInstance(project_id));
    const bluesSoftCosmosApiSecret = await secretManagerService.getBluesoftCosmosApiKey();
    const productInformationService: ProductInformationService =
        ProductInformationServiceImplementation.getInstance(BluesSoftCosmosInformationRepository.getInstance(bluesSoftCosmosApiSecret));
    return await productInformationService.normalizeProduct(product);
}

async function saveThumbnail(url: string): Promise<string | undefined> {
    logger.info(`saveThumbnail(${url})`)


    const filestoreService: FilestoreServices = FilestoreServicesImplementation.getInstance(
        GcpFilestoreRepository.getInstance()
    )

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
    await filestoreService.saveFile(resizedImage, 'grocery-brasil-app-thumbnails', fileName);
    return `https://storage.googleapis.com/grocery-brasil-app-thumbnails/${fileName}`;
}