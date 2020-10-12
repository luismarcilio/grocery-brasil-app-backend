import { SecretManagerRepository } from "../repository/SecretManagerRepository";

export class SecretManagerServiceError extends Error { }

export abstract class SecretManagerService {
    protected _repository: SecretManagerRepository
    protected constructor(_repository: SecretManagerRepository) {
        this._repository = _repository;
    }


    abstract async getGeolocationApiKey(): Promise<string>;
    abstract async getElasticSearchSecret(): Promise<{ endpoint: string, backEndKey: string }>;
    abstract async getBluesoftCosmosApiKey(): Promise<string>;
}


export class FirebaseSecretManagerService extends SecretManagerService {


    private _geolocationApiKey: string | undefined;
    private _elasticSearchSecret: { endpoint: string, backEndKey: string } | undefined;
    private _bluesoftCosmosApiKey: string | undefined;

    private static instance: SecretManagerService;
    public static getInstance(_repository: SecretManagerRepository): SecretManagerService {
        if (!this.instance) {
            this.instance = new FirebaseSecretManagerService(_repository);
        }
        return this.instance;
    }

    private constructor(_repository: SecretManagerRepository) {
        super(_repository);
    }

    async getGeolocationApiKey(): Promise<string> {
        if (!this._geolocationApiKey) {
            this._geolocationApiKey = await this._repository.getSecret('GEOLOCATION_API_KEY');
        }
        return this._geolocationApiKey;
    }
    async getBluesoftCosmosApiKey(): Promise<string> {
        if (!this._bluesoftCosmosApiKey) {
            this._bluesoftCosmosApiKey = await this._repository.getSecret('BLUESOFT_COSMOS_API');
        }
        return this._bluesoftCosmosApiKey;
    }
    async getElasticSearchSecret(): Promise<{ endpoint: string, backEndKey: string }> {
        if (!this._elasticSearchSecret) {
            const jsonString = await this._repository.getSecret('ELASTICSEARCH');
            this._elasticSearchSecret = JSON.parse(jsonString);
        }
        if (!this._elasticSearchSecret) {
            throw new SecretManagerServiceError('Cant read getElasticSearchSecret');
        }
        return this._elasticSearchSecret;

    }
}