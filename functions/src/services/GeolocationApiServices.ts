import { GeolocationApiRepository } from "../repository/GeoocationApiRepository";
import { Address } from "../model/Address";
import jsonpath = require("jsonpath");

export abstract class GeolocationApiServices {
    protected _repository: GeolocationApiRepository
    protected constructor(_repository: GeolocationApiRepository) {
        this._repository = _repository;
    }

    abstract getFullAddress(rawAddress: string): Promise<Address>
}


export class GeolocationApiServicesImplementation extends GeolocationApiServices {
    private static instance: GeolocationApiServices;

    private constructor(_repository: GeolocationApiRepository) {
        super(_repository);
    }

    public static getInstance(_repository: GeolocationApiRepository) {
        if (!this.instance) {
            this.instance = new GeolocationApiServicesImplementation(_repository)
        }
        return this.instance;
    }
    async getFullAddress(rawAddress: string): Promise<Address> {
        const data = await this._repository.getDataFromNaturalLanguageAddress(rawAddress);
        const address: Address = {
            rawAddress: jsonpath.query(data, "$.results[0].formatted_address")[0],
            street: jsonpath.query(data, "$.results[0].address_components[?(@.types=='route')].long_name")[0],
            number: jsonpath.query(data, "$.results[0].address_components[?(@.types=='street_number')].long_name")[0],
            poCode: jsonpath.query(data, "$.results[0].address_components[?(@.types.indexOf('postal_code') != -1)].long_name")[0],
            county: jsonpath.query(data, "$.results[0].address_components[?(@.types.indexOf('sublocality_level_1') != -1)].long_name")[0],
            city: {
                name: jsonpath.query(data, "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_2') != -1)].long_name")[0]
            },
            state: {
                name: jsonpath.query(data, "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_1') != -1)].long_name")[0],
                acronnym: jsonpath.query(data, "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_1') != -1)].short_name")[0],
            },
            country: {
                name: jsonpath.query(data, "$.results[0].address_components[?(@.types.indexOf('country') != -1)].long_name")[0]
            },
            lat: jsonpath.query(data, "$.results[0].geometry.location.lat")[0],
            lon: jsonpath.query(data, "$.results[0].geometry.location.lng")[0],
        }
        return address;

    }

}
