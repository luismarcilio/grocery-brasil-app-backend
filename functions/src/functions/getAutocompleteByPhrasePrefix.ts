import { ElasticSearchService, ElasticSearchServiceImplementation } from "../services/ElasticSearchServices";
import { ElasticSearchRepositoryImplementation } from '../repository/ElasticSearchRepository';
import { FirebaseSecretManagerService } from "../services/SecretManagerServices";
import { GCPSecretManagerRepository } from "../repository/SecretManagerRepository";
import { project_id } from "../configuration";
import { ProductServicesImplementation } from "../services/ProductServices";
import { FirebaseProductRepository } from "../repository/ProductsRepository";
import { Product } from "../model/Product";

export const getAutocompleteByPhrasePrefix = async (request: any, response: any) => {
    const secretManagerService = FirebaseSecretManagerService.getInstance(GCPSecretManagerRepository.getInstance(project_id));
    const elasticSearchSecret = await secretManagerService.getElasticSearchSecret();

    const elasticSearcService: ElasticSearchService =
        ElasticSearchServiceImplementation.getInstance(
            ElasticSearchRepositoryImplementation.getInstance(elasticSearchSecret))


    const productService = ProductServicesImplementation.getInstance(
        FirebaseProductRepository.getInstance()
    );

    if (!request.params.phrase) {
        response.status(400).send('Bad Request');
        return;
    }
    const responseData = await elasticSearcService.getAutocompleteByPhrasePrefix(request.params.phrase);
    const productList = await Promise.all(responseData.map(
        async function mapToProduct(p: { firebaseDocId: string; }): Promise<Product | undefined> {
            const product = productService.getProductById(p.firebaseDocId);
            return product;
        }
    ));
    response.status(200).send(productList);
    return;


}