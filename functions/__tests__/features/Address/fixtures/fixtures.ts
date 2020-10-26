import { Address } from "../../../../src/model/Address";
import {
  AddressException,
  MessageIds,
} from "../../../../src/core/ApplicationException";

export const someAddress: Address = {
  rawAddress:
    "Av. Epitácio Pessoa, 2566 - Ipanema, Rio de Janeiro - RJ, 22471-003, Brasil",
  street: "Avenida Epitácio Pessoa",
  number: "2566",
  poCode: "22471-003",
  county: "Ipanema",
  city: { name: "Rio de Janeiro" },
  state: { name: "Rio de Janeiro", acronnym: "RJ" },
  country: { name: "Brasil" },
  lat: -22.9749636,
  lon: -43.1984787,
};

export const someAddressException: AddressException = new AddressException({
  messageId: MessageIds.UNEXPECTED,
  message: "Error",
});

export const googleJsonAddress = JSON.parse(
  "{\n" +
    '   "results" : [\n' +
    "      {\n" +
    '         "address_components" : [\n' +
    "            {\n" +
    '               "long_name" : "2566",\n' +
    '               "short_name" : "2566",\n' +
    '               "types" : [ "street_number" ]\n' +
    "            },\n" +
    "            {\n" +
    '               "long_name" : "Avenida Epitácio Pessoa",\n' +
    '               "short_name" : "Av. Epitácio Pessoa",\n' +
    '               "types" : [ "route" ]\n' +
    "            },\n" +
    "            {\n" +
    '               "long_name" : "Ipanema",\n' +
    '               "short_name" : "Ipanema",\n' +
    '               "types" : [ "political", "sublocality", "sublocality_level_1" ]\n' +
    "            },\n" +
    "            {\n" +
    '               "long_name" : "Rio de Janeiro",\n' +
    '               "short_name" : "Rio de Janeiro",\n' +
    '               "types" : [ "administrative_area_level_2", "political" ]\n' +
    "            },\n" +
    "            {\n" +
    '               "long_name" : "Rio de Janeiro",\n' +
    '               "short_name" : "RJ",\n' +
    '               "types" : [ "administrative_area_level_1", "political" ]\n' +
    "            },\n" +
    "            {\n" +
    '               "long_name" : "Brasil",\n' +
    '               "short_name" : "BR",\n' +
    '               "types" : [ "country", "political" ]\n' +
    "            },\n" +
    "            {\n" +
    '               "long_name" : "22471-003",\n' +
    '               "short_name" : "22471-003",\n' +
    '               "types" : [ "postal_code" ]\n' +
    "            }\n" +
    "         ],\n" +
    '         "formatted_address" : "Av. Epitácio Pessoa, 2566 - Ipanema, Rio de Janeiro - RJ, 22471-003, Brasil",\n' +
    '         "geometry" : {\n' +
    '            "bounds" : {\n' +
    '               "northeast" : {\n' +
    '                  "lat" : -22.9747089,\n' +
    '                  "lng" : -43.1975541\n' +
    "               },\n" +
    '               "southwest" : {\n' +
    '                  "lat" : -22.9752519,\n' +
    '                  "lng" : -43.1989201\n' +
    "               }\n" +
    "            },\n" +
    '            "location" : {\n' +
    '               "lat" : -22.9749636,\n' +
    '               "lng" : -43.1984787\n' +
    "            },\n" +
    '            "location_type" : "GEOMETRIC_CENTER",\n' +
    '            "viewport" : {\n' +
    '               "northeast" : {\n' +
    '                  "lat" : -22.9736314197085,\n' +
    '                  "lng" : -43.1968881197085\n' +
    "               },\n" +
    '               "southwest" : {\n' +
    '                  "lat" : -22.9763293802915,\n' +
    '                  "lng" : -43.1995860802915\n' +
    "               }\n" +
    "            }\n" +
    "         },\n" +
    '         "place_id" : "ChIJMWeBRmvVmwARA6IdUQi5Nb0",\n' +
    '         "types" : [ "premise" ]\n' +
    "      }\n" +
    "   ],\n" +
    '   "status" : "OK"\n' +
    "}"
);
