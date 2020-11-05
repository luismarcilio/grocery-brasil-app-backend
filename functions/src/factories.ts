import { GetWebViewScrapDataController } from "./presentation/controllers/GetWebViewScrapDataController";
import { GetWebViewScrapDataUseCase } from "./features/Purchase/useCase/GetWebViewScrapDataUseCase";
import { WebViewScrapDataServiceImpl } from "./features/Purchase/service/WebViewScrapDataServiceImpl";
import { WebViewScrapDataProviderImpl } from "./features/Purchase/data/WebViewScrapDataProviderImpl";
import { MinifierAdapterMinify } from "./features/Purchase/adapter/MinifierAdapterMinify";
import * as minify from "minify";
import { UrlParserProviderImpl } from "./features/Purchase/provider/UrlParserProviderImpl";
import { WebViewScrapDataRepositoryFirebase } from "./features/Purchase/data/WebViewScrapDataRepositoryFirebase";
import NodeCache = require("node-cache");
import { ParseAndSaveNFController } from "./presentation/controllers/ParseAndSaveNFController";
import { SavePurchaseUseCase } from "./features/Purchase/useCase/SavePurchaseUseCase";
import { ScrapNFUseCase } from "./features/Purchase/useCase/ScrapNFUseCase";
import { PurchaseServiceImpl } from "./features/Purchase/service/PurchaseServiceImpl";
import { PurchaseProviderImpl } from "./features/Purchase/data/PurchaseProviderImpl";
import { ProductServiceImpl } from "./features/Product/service/ProductServiceImpl";
import { ProductProviderImpl } from "./features/Product/data/ProductProviderImpl";
import { ThumbnailFacadeImpl } from "./features/Product/provider/ThumbnailFacadeImpl";
import { FileServerRepositoryGCP } from "./features/FileServer/repository/FileServerRepositoryGCP";
import { Storage } from "@google-cloud/storage";
import { MimeTypeAdapterFileType } from "./features/MimeType/adapter/MimeTypeAdapterFileType";
import * as filetype from "file-type";
import { AxiosHttpAdapter } from "./features/Http/adapter/AxiosHttpAdapter";
import axios from "axios";
import { ScrapNFServiceImpl } from "./features/Purchase/service/ScrapNFServiceImpl";
import { ScrapNfProviderFactoryImpl } from "./features/Purchase/provider/ScrapNfProviderFactoryImpl";
import { ScrapNFServiceMG } from "./features/Purchase/provider/ScrapNFServiceMG";
import { ScrapNFServiceRJ } from "./features/Purchase/provider/ScrapNFServiceRJ";
import { ProductRepositoryFirebase } from "./features/Product/data/ProductRepositoryFirebase";
import { ProductNormalizationBluesoftCosmos } from "./features/Product/data/ProductNormalizationBluesoftCosmos";
import { SecretsProviderFirebaseImpl } from "./features/Secrets/provider/SecretsProviderFirebaseImpl";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { ElasticSearchRepositoryImpl } from "./features/Product/data/ElasticSearchRepositoryImpl";
import { PurchaseRepositoryFirebase } from "./features/Purchase/data/PurchaseRepositoryFirebase";
import { ImageManipulationAdapterSharp } from './features/Image/adapter/ImageManipulationAdapterSharp';
import * as sharp from 'sharp';
import { AuthenticationMiddleware } from './presentation/middlewares/AuthenticationMiddleware';
import { GetUserByJWTUseCase } from "./features/User/useCase/GetUserByJWTUseCase";
import { UserRepositoryImpl } from './features/User/data/UserRepositoryImpl';
import { FirebaseUserDataStore, VerifyIdTokenWrapper } from "./features/User/data/FirebaseUserDataStore";

//3rd party
const firestore = new FirebaseFirestore.Firestore();
const cache = new NodeCache();
const storage = new Storage();
const secretManagerServiceClient = new SecretManagerServiceClient();

//Adapters
const minifierAdapter = new MinifierAdapterMinify(minify);
const mimeTypeAdapter = new MimeTypeAdapterFileType(filetype);
const httpAdapter = new AxiosHttpAdapter(axios);
const imageManipulationAdapter = new ImageManipulationAdapterSharp(sharp)
const secretsProvider = new SecretsProviderFirebaseImpl(
  secretManagerServiceClient
);
const userDataStore = new FirebaseUserDataStore(cache, new VerifyIdTokenWrapper(),firestore)

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
        const textSearchEngineRepository = new ElasticSearchRepositoryImpl(
  secretsProvider,
  httpAdapter
);
const purchaseRepository = new PurchaseRepositoryFirebase(firestore);
const fileServerRepository = new FileServerRepositoryGCP(storage);
const userRepository = new UserRepositoryImpl(userDataStore);

//Facades
const thumbnailFacade = new ThumbnailFacadeImpl(imageManipulationAdapter,fileServerRepository,mimeTypeAdapter,httpAdapter);


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

const scrapNfProviderFactory = new ScrapNfProviderFactoryImpl([
  { uf: "MG", scrapNfProvider: ScrapNFServiceMG.instance() },
  { uf: "RJ", scrapNfProvider: ScrapNFServiceRJ.instance() },
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
  productService
);
const scrapNFService = new ScrapNFServiceImpl(scrapNfProviderFactory);

//Use Cases
const getWebViewScrapDataUseCase = new GetWebViewScrapDataUseCase(
  webViewScrapDataService
);
const savePurchaseUseCase = new SavePurchaseUseCase(purchaseService);
const scrapNFUseCase = new ScrapNFUseCase(scrapNFService);
const getUserByJWTUseCase = new GetUserByJWTUseCase(userRepository);

//Controllers
export const getWebViewScrapDataController = new GetWebViewScrapDataController(
  getWebViewScrapDataUseCase
);

export const parseAndSaveNFController = new ParseAndSaveNFController(
  savePurchaseUseCase,
  scrapNFUseCase
);

//Middleware

export const authenticationMiddleware = new AuthenticationMiddleware(
  getUserByJWTUseCase
);
