import axios, { AxiosResponse } from 'axios';
import { stringify } from 'querystring';
import { Address } from '../model/Address';
import { getGeolocationApiKey, getBluesoftCosmosApiKey, getElasticSearchSecret } from './firebaseServices';
import { logger } from '../logger';
const jsonpath = require('jsonpath');

export async function getFullAddress(rawAddress: string): Promise<Address> {

    const apiKey = await getGeolocationApiKey();
    const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    const _queryString = stringify(
        {
            address: rawAddress,
            key: apiKey
        }
    );

    let response: AxiosResponse;
    try {
        response = await axios.get(`${apiUrl}?${_queryString}`);
    } catch (error) {
        logger.error(`axios.get(${apiUrl}?${_queryString}):`, error);
        throw error;
    }


    if (response.status !== 200) {
        throw new Error(`GEOLOCATION API FAILED: ${response.status}`)
    }
    logger.info('response.data', JSON.stringify(response.data));
    const address: Address = {
        rawAddress: jsonpath.query(response.data, "$.results[0].formatted_address")[0],
        street: jsonpath.query(response.data, "$.results[0].address_components[?(@.types=='route')].long_name")[0],
        number: jsonpath.query(response.data, "$.results[0].address_components[?(@.types=='street_number')].long_name")[0],
        poCode: jsonpath.query(response.data, "$.results[0].address_components[?(@.types.indexOf('postal_code') != -1)].long_name")[0],
        county: jsonpath.query(response.data, "$.results[0].address_components[?(@.types.indexOf('sublocality_level_1') != -1)].long_name")[0],
        city: {
            name: jsonpath.query(response.data, "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_2') != -1)].long_name")[0]
        },
        state: {
            name: jsonpath.query(response.data, "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_1') != -1)].long_name")[0],
            acronnym: jsonpath.query(response.data, "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_1') != -1)].short_name")[0],
        },
        country: {
            name: jsonpath.query(response.data, "$.results[0].address_components[?(@.types.indexOf('country') != -1)].long_name")[0]
        },
        lat: jsonpath.query(response.data, "$.results[0].geometry.location.lat")[0],
        lon: jsonpath.query(response.data, "$.results[0].geometry.location.lng")[0],
    }

    logger.info('address', address);
    return address;
}

export async function getNormailizedProductByEanCode(eanCode: string): Promise<any> {
    const apiKey = await getBluesoftCosmosApiKey();
    const apiUrl = `https://api.cosmos.bluesoft.com.br/gtins/${eanCode}`;




    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-Cosmos-Token': apiKey,
                'Content-Type': 'application/json'
            }
        });
        return response.data;

    } catch (error) {
        if (error.response?.status && error.response?.status === 404) {
            return;
        }
        if (error.response?.status && error.response?.status === 429) {
            logger.error(`getNormailizedProductByEanCode:  ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            return;
        }
        logger.error(`getNormailizedProductByEanCode:  ${JSON.stringify(error)}`);
        throw error;
    }
}

export async function insertIntoElasticSearch(elasticSearchDocument: { eanCode: string, name: string, firebaseDocId: string }): Promise<any> {
    const secret = await getElasticSearchSecret();
    const { endpoint, backEndKey } = secret;
    const path = `/produtos_autocomplete/_doc/${elasticSearchDocument.firebaseDocId}`
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
}

export async function getAutocompleteByPhrasePrefix(prefix: string): Promise<any> {
    const secret = await getElasticSearchSecret();
    const { endpoint, backEndKey } = secret;
    const path = '/produtos_autocomplete/_search';
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
