import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { getGeolocationApiKey } from './functions/getGeolocationApiKey';
import { getAutocompleteByPhrasePrefix } from './functions/getAutocompleteByPhrasePrefix';
import { authenticate, initializeFirebase } from './business/expressMiddleware';
import { parseAndSaveNf } from './functions/parseAndSaveNf';



const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
app.use(authenticate);
app.use(initializeFirebase);
app.get('/geolocationApiKey', getGeolocationApiKey);
app.get('/autocomplete/:phrase', getAutocompleteByPhrasePrefix);
app.post('/parseAndSaveNf/:state', parseAndSaveNf);
app.get('*', function (req, res) {
    res.status(404).send('Not Found');
});

app.post('*', function (req, res) {
    res.status(404).send('Not Found');
});

//http functions
exports.v1 = functions.https.onRequest(app);


//Firestore functions
exports.uploadToElasticsearch = require('./functions/uploadToElasticsearch');
exports.uploadThumbnail = require('./functions/uploadThumbnail');


