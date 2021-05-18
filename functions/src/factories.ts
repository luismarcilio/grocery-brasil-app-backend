import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Storage } from "@google-cloud/storage";
import axios from "axios";
import * as filetype from "file-type";
import * as admin from "firebase-admin";
import * as sharp from "sharp";
import { AddressDataSourceGoogleImpl } from "./features/Address/data/AddressDataSourceGoogleImpl";
import { AddressProviderImpl } from "./features/Address/provider/AddressProviderImpl";
import { FileServerRepositoryGCP } from "./features/FileServer/repository/FileServerRepositoryGCP";
import { AxiosHttpAdapter } from "./features/Http/adapter/AxiosHttpAdapter";
import { ImageManipulationAdapterSharp } from "./features/Image/adapter/ImageManipulationAdapterSharp";
import { MimeTypeAdapterFileType } from "./features/MimeType/adapter/MimeTypeAdapterFileType";
import { ProductNormalizationBluesoftCosmos } from "./features/Product/data/ProductNormalizationBluesoftCosmos";
import { ProductProviderImpl } from "./features/Product/data/ProductProviderImpl";
import { ProductRepositoryFirebase } from "./features/Product/data/ProductRepositoryFirebase";
import { TextSearchRepositoryImpl } from "./features/Product/data/TextSearchRepositoryImpl";
import { ThumbnailFacadeImpl } from "./features/Product/provider/ThumbnailFacadeImpl";
import { ProductServiceImpl } from "./features/Product/service/ProductServiceImpl";
import { NormalizeProductUseCase } from "./features/Product/useCase/NormalizeProductUseCase";
import { UploadThumbnailUseCase } from "./features/Product/useCase/UploadThumbnailUseCase";
import { UploadToTextSearchEngineUseCase } from "./features/Product/useCase/UploadToTextSearchEngineUseCase";
import { MinifierAdapterBypass } from "./features/Purchase/adapter/MinifierAdapterBypass";
import { PurchaseProviderImpl } from "./features/Purchase/data/PurchaseProviderImpl";
import { PurchaseRepositoryFirebase } from "./features/Purchase/data/PurchaseRepositoryFirebase";
import { WebViewScrapDataProviderImpl } from "./features/Purchase/data/WebViewScrapDataProviderImpl";
import { WebViewScrapDataRepositoryFirebase } from "./features/Purchase/data/WebViewScrapDataRepositoryFirebase";
import { ScrapNfProviderFactoryImpl } from "./features/Purchase/provider/ScrapNfProviderFactoryImpl";
import { ScrapNFServiceMG } from "./features/Purchase/provider/ScrapNFServiceMG";
import { ScrapNFServiceRJ } from "./features/Purchase/provider/ScrapNFServiceRJ";
import { UrlParserProviderImpl } from "./features/Purchase/provider/UrlParserProviderImpl";
import { PurchaseServiceImpl } from "./features/Purchase/service/PurchaseServiceImpl";
import { ScrapNFServiceImpl } from "./features/Purchase/service/ScrapNFServiceImpl";
import { WebViewScrapDataServiceImpl } from "./features/Purchase/service/WebViewScrapDataServiceImpl";
import { GetWebViewScrapDataUseCase } from "./features/Purchase/useCase/GetWebViewScrapDataUseCase";
import { SavePurchaseUseCase } from "./features/Purchase/useCase/SavePurchaseUseCase";
import { ScrapNFUseCase } from "./features/Purchase/useCase/ScrapNFUseCase";
import { SecretsProviderFirebaseImpl } from "./features/Secrets/provider/SecretsProviderFirebaseImpl";
import { SecretServiceImpl } from "./features/Secrets/service/SecretServiceImpl";
import { GetSecretUseCase } from "./features/Secrets/useCase/GetSecretUseCase";
import { FirebaseUserDataStore } from "./features/User/data/FirebaseUserDataStore";
import { UserRepositoryImpl } from "./features/User/data/UserRepositoryImpl";
import { GetUserByJWTUseCase } from "./features/User/useCase/GetUserByJWTUseCase";
import { GetSecretController } from "./presentation/controllers/GetSecretController";
import { GetWebViewScrapDataController } from "./presentation/controllers/GetWebViewScrapDataController";
import { ParseAndSaveNFController } from "./presentation/controllers/ParseAndSaveNFController";
import { NormalizeProductAndUploadThumbnailTrigger } from "./presentation/functions/NormalizeProductAndUploadThumbnailTrigger";
import { UploadToTextSearchEngineTrigger } from "./presentation/functions/UploadToTextSearchEngineTrigger";
import {
  AuthenticationMiddleware,
  AuthenticationMiddlewareTest
} from "./presentation/middlewares/AuthenticationMiddleware";
import NodeCache = require("node-cache");
import { ScrapNFServiceSP } from "./features/Purchase/provider/ScrapNFServiceSP";


//3rd party
admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ignoreUndefinedProperties: true});
const cache = new NodeCache();
const storage = new Storage();
const secretManagerServiceClient = new SecretManagerServiceClient();

//Adapters
const minifierAdapter = new MinifierAdapterBypass();
const mimeTypeAdapter = new MimeTypeAdapterFileType(filetype);
const httpAdapter = new AxiosHttpAdapter(axios);
const imageManipulationAdapter = new ImageManipulationAdapterSharp(sharp);
const secretsProvider = new SecretsProviderFirebaseImpl(
  secretManagerServiceClient
);
const userDataStore = new FirebaseUserDataStore(cache, firestore, admin.auth());

//Repositories
const webViewScrapDataRepository = new WebViewScrapDataRepositoryFirebase(
  firestore,
  cache
);
const productRepository = new ProductRepositoryFirebase(firestore);
const productNormalizationRepository = new ProductNormalizationBluesoftCosmos(
  secretsProvider,
  httpAdapter
);
const textSearchEngineRepository = new TextSearchRepositoryImpl(
  secretsProvider,
  httpAdapter
);
const purchaseRepository = new PurchaseRepositoryFirebase(firestore);
const fileServerRepository = new FileServerRepositoryGCP(storage);
const userRepository = new UserRepositoryImpl(userDataStore);

//Facades
const thumbnailFacade = new ThumbnailFacadeImpl(
  imageManipulationAdapter,
  fileServerRepository,
  mimeTypeAdapter,
  httpAdapter
);

const addressDataSource = new AddressDataSourceGoogleImpl(
  secretsProvider,
  httpAdapter
);

//Providers
const webViewScrapDataProvider = new WebViewScrapDataProviderImpl(
  webViewScrapDataRepository
);
const urlParserProvider = new UrlParserProviderImpl();
const purchaseProvider = new PurchaseProviderImpl(purchaseRepository);
const productProvider = new ProductProviderImpl(
  productRepository,
  productNormalizationRepository,
  textSearchEngineRepository
);
const addressProvider = new AddressProviderImpl(addressDataSource);
const scrapNfProviderFactory = new ScrapNfProviderFactoryImpl([
  { uf: "MG", scrapNfProvider: ScrapNFServiceMG.instance() },
  { uf: "RJ", scrapNfProvider: ScrapNFServiceRJ.instance() },
  { uf: "SP", scrapNfProvider: ScrapNFServiceSP.instance() }
]);

//Services
const webViewScrapDataService = new WebViewScrapDataServiceImpl(
  webViewScrapDataProvider,
  minifierAdapter,
  urlParserProvider
);
const productService = new ProductServiceImpl(productProvider, thumbnailFacade);
const purchaseService = new PurchaseServiceImpl(
  purchaseProvider,
  productService,
  addressProvider
);
const scrapNFService = new ScrapNFServiceImpl(scrapNfProviderFactory);
const secretService = new SecretServiceImpl(secretsProvider);

//Use Cases
const getWebViewScrapDataUseCase = new GetWebViewScrapDataUseCase(
  webViewScrapDataService
);
const savePurchaseUseCase = new SavePurchaseUseCase(purchaseService);
const scrapNFUseCase = new ScrapNFUseCase(scrapNFService);
const getUserByJWTUseCase = new GetUserByJWTUseCase(userRepository);
const getSecretUseCase = new GetSecretUseCase(secretService);
const normalizeProductUseCase = new NormalizeProductUseCase(productService);
const uploadThumbnailUseCase = new UploadThumbnailUseCase(productService);
const uploadToTextSearchEngineUseCase = new UploadToTextSearchEngineUseCase(
  productService
);

//Controllers
export const makeGetWebViewScrapDataController = (): GetWebViewScrapDataController =>
  new GetWebViewScrapDataController(getWebViewScrapDataUseCase);

export const makeParseAndSaveNFController = (): ParseAndSaveNFController =>
  new ParseAndSaveNFController(savePurchaseUseCase, scrapNFUseCase);

export const makeGetSecrectController = (): GetSecretController =>
  new GetSecretController(getSecretUseCase);

let auth;
//Middleware
if (process.env.NODE_ENV !== "test") {
  auth = (): AuthenticationMiddleware =>
    new AuthenticationMiddleware(getUserByJWTUseCase);
} else {
  auth = (): AuthenticationMiddlewareTest =>
    new AuthenticationMiddlewareTest(getUserByJWTUseCase);
}
export const makeAuthenticationMiddleware = auth;
//Database functions
export const makeNormalizeProductAndUploadThumbnailTrigger = (): NormalizeProductAndUploadThumbnailTrigger =>
  new NormalizeProductAndUploadThumbnailTrigger(
    normalizeProductUseCase,
    uploadThumbnailUseCase
  );
export const makeUploadToTextSearchEngineTrigger = (): UploadToTextSearchEngineTrigger =>
  new UploadToTextSearchEngineTrigger(uploadToTextSearchEngineUseCase);
