import * as functions from 'firebase-functions';
import { logger } from '../logger';
import { FirebaseSecretManagerService } from '../services/SecretManagerServices';
import { GCPSecretManagerRepository } from '../repository/SecretManagerRepository';
import { project_id } from '../configuration';
import { ElasticSearchService, ElasticSearchServiceImplementation } from '../services/ElasticSearchServices';
import { ElasticSearchRepositoryImplementation } from '../repository/ElasticSearchRepository';
import { ElasticSearchDocument } from '../model/ElasticSearchDocument';



exports.uploadToElasticsearch = functions.firestore
    .document('PRODUTOS/{productId}')
    .onWrite(async (change, _context) => {

        const secretManagerService = FirebaseSecretManagerService.getInstance(GCPSecretManagerRepository.getInstance(project_id));
        const elasticSearchSecret = await secretManagerService.getElasticSearchSecret();

        const elasticSearcService: ElasticSearchService =
            ElasticSearchServiceImplementation.getInstance(
                ElasticSearchRepositoryImplementation.getInstance(elasticSearchSecret))



        if (!change.after.exists) {
            logger.info('change.after.exists is falsee');
            return null;
        }
        const document = change.after.data();
        if (!document) {
            logger.info('change.after.data() is falsee');
            return null;
        }
        const elasticSearchDocument: ElasticSearchDocument = {
            eanCode: change.after.data()?.eanCode,
            name: change.after.data()?.name,
            firebaseDocId: change.after.id,
            thumbnail: change.after.data()?.thumbnail
        }
        await elasticSearcService.insertIntoElasticSearch(elasticSearchDocument);
        return null;
    });

