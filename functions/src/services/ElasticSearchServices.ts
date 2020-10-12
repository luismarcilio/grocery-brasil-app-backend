import { ElasticSearchDocument } from "../model/ElasticSearchDocument";
import { ElasticSearchRepository } from "../repository/ElasticSearchRepository";

export abstract class ElasticSearchService {
    protected _repository: ElasticSearchRepository
    protected constructor(_repository: ElasticSearchRepository) {
        this._repository = _repository;
    }


    abstract insertIntoElasticSearch(elasticSearchDocument: ElasticSearchDocument): Promise<void>
    abstract getAutocompleteByPhrasePrefix(prefix: string): Promise<ElasticSearchDocument[]>
}

export class ElasticSearchServiceImplementation extends ElasticSearchService {
    private index = 'produtos_autocomplete';

    private static instance: ElasticSearchService;
    private constructor(_repository: ElasticSearchRepository) {
        super(_repository);
    }
    public static getInstance(_repository: ElasticSearchRepository) {
        if (!this.instance) {
            this.instance = new ElasticSearchServiceImplementation(_repository)
        }
        return this.instance;
    }


    async insertIntoElasticSearch(elasticSearchDocument: ElasticSearchDocument): Promise<void> {
        const doc = elasticSearchDocument.firebaseDocId;
        await this._repository.insertIntoElasticSearch(this.index, doc, elasticSearchDocument);
        return;
    }
    async getAutocompleteByPhrasePrefix(prefix: string): Promise<ElasticSearchDocument[]> {
        const response = await this._repository.getAutocompleteByPhrasePrefix(this.index, prefix);
        return response.data.hits.hits.map((i: { _source: ElasticSearchDocument; }) => i._source);
    }

}