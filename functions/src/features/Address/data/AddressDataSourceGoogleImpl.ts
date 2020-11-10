import { AddressDataSource } from "./AddressDataSource";
import { Address } from "../../../model/Address";
import { HttpAdapter } from "../../Http/adapter/HttpAdapter";
import { stringify } from "querystring";
import {
  AddressException,
  MessageIds,
} from "../../../core/ApplicationException";
import * as jsonpath from "jsonpath";
import { errorToApplicationException } from "../../../core/utils";
import { SecretsProvider } from "../../Secrets/provider/SecretsProvider";

export class AddressDataSourceGoogleImpl implements AddressDataSource {
  private readonly apiKeyProvider: SecretsProvider;
  private readonly httpAdapter: HttpAdapter;

  constructor(apiKeyProvider: SecretsProvider, httpAdapter: HttpAdapter) {
    this.apiKeyProvider = apiKeyProvider;
    this.httpAdapter = httpAdapter;
  }

  async getFullAddressFromRawAddress(rawAddress: string): Promise<Address> {
    try {
      const apiKey = await this.apiKeyProvider.getSecret("GEOLOCATION_API_KEY");
      const googleGeocodeBaseUrl =
        "https://maps.googleapis.com/maps/api/geocode/json";
      const queryString = stringify({
        address: rawAddress,
        key: apiKey,
        language: "pt-BR",
      });

      const httpAdapterResponse = await this.httpAdapter.get(
        `${googleGeocodeBaseUrl}?${queryString}`
      );
      if (httpAdapterResponse.status !== 200) {
        throw new AddressException({
          messageId: MessageIds.UNEXPECTED,
          message: httpAdapterResponse.body,
        });
      }
      const googleResponse = httpAdapterResponse.body;
      if (googleResponse?.status !== "OK") {
        throw new AddressException({
          messageId: MessageIds.UNEXPECTED,
          message: googleResponse?.status || "Empty response",
        });
      }
      const addressResponse = this.googleAddressToAddress(googleResponse);
      return addressResponse;
    } catch (error) {
      throw errorToApplicationException(error, AddressException);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private googleAddressToAddress(googleAddress: any): Address {
    const address: Address = {
      rawAddress: jsonpath.query(
        googleAddress,
        "$.results[0].formatted_address"
      )[0],
      street: jsonpath.query(
        googleAddress,
        "$.results[0].address_components[?(@.types=='route')].long_name"
      )[0],
      number: jsonpath.query(
        googleAddress,
        "$.results[0].address_components[?(@.types=='street_number')].long_name"
      )[0],
      poCode: jsonpath.query(
        googleAddress,
        "$.results[0].address_components[?(@.types.indexOf('postal_code') != -1)].long_name"
      )[0],
      county: jsonpath.query(
        googleAddress,
        "$.results[0].address_components[?(@.types.indexOf('sublocality_level_1') != -1)].long_name"
      )[0],
      city: {
        name: jsonpath.query(
          googleAddress,
          "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_2') != -1)].long_name"
        )[0],
      },
      state: {
        name: jsonpath.query(
          googleAddress,
          "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_1') != -1)].long_name"
        )[0],
        acronnym: jsonpath.query(
          googleAddress,
          "$.results[0].address_components[?(@.types.indexOf('administrative_area_level_1') != -1)].short_name"
        )[0],
      },
      country: {
        name: jsonpath.query(
          googleAddress,
          "$.results[0].address_components[?(@.types.indexOf('country') != -1)].long_name"
        )[0],
      },
      lat: jsonpath.query(
        googleAddress,
        "$.results[0].geometry.location.lat"
      )[0],
      lon: jsonpath.query(
        googleAddress,
        "$.results[0].geometry.location.lng"
      )[0],
    };
    return address;
  }
}
