import { stringify } from "querystring";
import axios, { AxiosResponse } from "axios";
import { logger } from "../logger";

export class GeolocationApiRepositoryError extends Error { }

export abstract class GeolocationApiRepository {
    abstract async getDataFromNaturalLanguageAddress(address: string): Promise<any>
}


export class GCPGeolocationApiRepository extends GeolocationApiRepository {

    private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    private static _instance: GeolocationApiRepository;
    private apiSecret: string;
    private constructor(apiSecret: string) {
        super();
        this.apiSecret = apiSecret;
    }
    public static getInstance(apiSecret: string): GeolocationApiRepository {
        if (!this._instance) {
            this._instance = new GCPGeolocationApiRepository(apiSecret);
        }
        return this._instance;
    }
    async getDataFromNaturalLanguageAddress(address: string): Promise<any> {
        const _queryString = stringify(
            {
                address,
                key: this.apiSecret
            }
        );

        let response: AxiosResponse;
        try {
            response = await axios.get(`${this.apiUrl}?${_queryString}`);
        } catch (error) {
            logger.error(`axios.get(${this.apiUrl}?${_queryString}):`, error);
            throw error;
        }
        if (response.status !== 200) {
            throw new GeolocationApiRepositoryError(`GEOLOCATION API FAILED: ${response.status}`)
        }

        return response.data;
    }

}


