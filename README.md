# grocery-brasil-app backend
## Architecture:
We have done the development using TDD and clean architecture. We refactored to S.O.L.I.D. principles where it calls most attention. We used design patterns where they fit.
## Technologies used:
- GCP
- firebase
- firestore
- Google Cloud Storage
- Google Geolocation API
- TDD
- Clean Architecture
- S.O.L.I.D. principles
- Typescript
- CICD
- Design patterns
  - Abstract Factory
  - Factory
  - Facade
  - Decorator
  - Inversion of Control


## Proposal:
Firebase can provide a full back end to one's application but some reasons made us prefer to implement some functions on the back end:
1. Responsiveness: We are scrapping third parties web. These can change without notice and it will break the appliction. To mitigate it we want to be able to respond to such events without changes in the app code.
1. Upgrade: Brazil has 27 states, and potentially each one has a different layout to show the fiscal note. We will launch the application without having all states implemented. We want to be able to implement access to data of a state without the need to upgrade the app.
1. Performance: the firestore triggers implement potentially long operations such as accessing a service on the cloud to bring some product's picture, resize it and upload to cloud storage. Such operations should be on the back end.
## Cloud functions:
### http:
- v1: done over express app in [controllers](https://github.com/luismarcilio/grocery-brasil-app-backend/tree/master/functions/src/presentation/controllers)
  - [GetSecret](https://github.com/luismarcilio/grocery-brasil-app-backend/blob/master/functions/src/presentation/controllers/GetSecretController.ts): return mostly api keys to front end app.
  - [GetWebViewScrapData](https://github.com/luismarcilio/grocery-brasil-app-backend/blob/master/functions/src/presentation/controllers/GetWebViewScrapDataController.ts): parses the QRCode url and returns {initial url, the brazilian state, javascript to reach and get the fiscal note, the access key}
  - [ParseAndSaveNFController](https://github.com/luismarcilio/grocery-brasil-app-backend/blob/master/functions/src/presentation/controllers/ParseAndSaveNFController.ts): will scrap the HTML with the fiscal note and save to the database. It also enriches the address of the company using Google Geolocation api, to make possible to have a normalized address with latitude and longitude.
### firestore triggers:
- [NormalizeProductAndUploadThumbnail](https://github.com/luismarcilio/grocery-brasil-app-backend/blob/master/functions/src/presentation/functions/NormalizeProductAndUploadThumbnailTrigger.ts): Enriches and normalizes the product record with external services, also brings a thumbnail of the product and saves it to cloud storage
- [UploadToTextSearchEngine](https://github.com/luismarcilio/grocery-brasil-app-backend/blob/master/functions/src/presentation/functions/UploadToTextSearchEngineTrigger.ts): Uploads the record to text search engine (Currently elasticsearch)
