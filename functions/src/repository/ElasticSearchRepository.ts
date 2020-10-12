import axios, { AxiosResponse } from 'axios';
import { logger } from '../logger';

export class ElasticSearchRepositoryError extends Error { }

export abstract class ElasticSearchRepository {
    abstract async  insertIntoElasticSearch(index: string, doc: string, elasticSearchDocument: any): Promise<any>
    abstract async  getAutocompleteByPhrasePrefix(index: string, prefix: string): Promise<any>;
}

export class ElasticSearchRepositoryImplementation extends ElasticSearchRepository {
    private static _instance: ElasticSearchRepository;
    private apiSecret: { endpoint: string, backEndKey: string };
    private constructor(apiSecret: { endpoint: string, backEndKey: string }) {
        super();
        this.apiSecret = apiSecret;
    }
    public static getInstance(apiSecret: { endpoint: string, backEndKey: string }): ElasticSearchRepository {
        if (!this._instance) {
            this._instance = new ElasticSearchRepositoryImplementation(apiSecret);
        }
        return this._instance;
    }
    async insertIntoElasticSearch(index: string, doc: string, elasticSearchDocument: any): Promise<any> {
        const { endpoint, backEndKey } = this.apiSecret;
        const path = `/${index}/_doc/${doc}`
        try {
            const response: AxiosResponse = await axios.post(`${endpoint}${path}`,
                elasticSearchDocument,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `ApiKey ${backEndKey}`
                    }
                });
            logger.info(`insertIntoElasticSearch(${JSON.stringify(elasticSearchDocument)}): ${response.status}`);
            return response.data;

        } catch (error) {
            throw new ElasticSearchRepositoryError(error);
        }
    }

    async getAutocompleteByPhrasePrefix(index: string, prefix: string): Promise<any> {
        const { endpoint, backEndKey } = this.apiSecret;
        const path = `/${index}/_search`;
        const query = {
            query: {
                match_phrase_prefix: {
                    name: prefix
                }
            }
        }
        try {
            const response: AxiosResponse = await axios.get(`${endpoint}${path}`,
                {
                    params: {
                        source: JSON.stringify(query),
                        source_content_type: 'application/json'
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `ApiKey ${backEndKey}`
                    }
                });
            logger.info(`getAutocompleteByPhrasePrefix(${JSON.stringify(prefix)}): ${response.status}`);
            return response.data.hits.hits.map((i: { _source: any; }) => i._source);

        } catch (error) {
            logger.error(`getAutocompleteByPhrasePrefix(${JSON.stringify(prefix)}): ${error.response.status}`);
            throw error;
        }
    }

}