import axios from 'axios';
import { logger } from '../logger';
export class ProductsInformationRepositoryError extends Error { }

export abstract class ProductsInformationRepository {
    abstract async getProductInformation(eanCode: string): Promise<{ response: any, status: number }>
}


export class BluesSoftCosmosInformationRepository extends ProductsInformationRepository {

    private static _instance: BluesSoftCosmosInformationRepository;
    private apiSecret: string;
    private constructor(apiSecret: string) {
        super();
        this.apiSecret = apiSecret;
    }
    public static getInstance(apiSecret: string): BluesSoftCosmosInformationRepository {
        if (!this._instance) {
            this._instance = new BluesSoftCosmosInformationRepository(apiSecret);
        }
        return this._instance;
    }


    async getProductInformation(eanCode: string): Promise<{ response: any, status: number }> {
        const apiUrl = `https://api.cosmos.bluesoft.com.br/gtins/${eanCode}`;
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'X-Cosmos-Token': this.apiSecret,
                    'Content-Type': 'application/json'
                }
            });
            return { response: response.data, status: response.status };

        } catch (error) {
            if (error.response?.status && error.response?.status === 404) {
                logger.info(`getNormailizedProductByEanCode:  ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            if (error.response?.status && error.response?.status === 429) {
                logger.info(`getNormailizedProductByEanCode:  ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            logger.error(`getNormailizedProductByEanCode:  ${JSON.stringify(error)}`);
            return { response: error.response.data, status: error.response.status };
        }

    }

}