/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ApplicationException, MessageIds } from "./ApplicationException";
import { Geohash } from "../model/Geohash";
import * as ngeohash from "ngeohash";
import { Product } from "../model/Product";

export function parseDate(dateString: string): Date {
  const year = +dateString.split("/")[2];
  const mon = +dateString.split("/")[1] - 1;
  const day = +dateString.split("/")[0];

  return new Date(year, mon, day);
}

export const errorToApplicationException = <T extends ApplicationException>(
  error: any,
  constructor: new (data: { messageId: MessageIds; message: string }) => T
): T => {
  if (error.constructor.name === constructor.name) {
    return error;
  }
  return new constructor({ messageId: MessageIds.UNEXPECTED, message: error });
};

export const calculateGeohash = (lat: number, lon: number): Geohash => {
  const geohashArray = Array.from(ngeohash.encode(lat, lon, 9));
  const geohash: Geohash = {
    g1: geohashArray[0],
    g2: geohashArray.slice(0, 2).join(""),
    g3: geohashArray.slice(0, 3).join(""),
    g4: geohashArray.slice(0, 4).join(""),
    g5: geohashArray.slice(0, 5).join(""),
    g6: geohashArray.slice(0, 6).join(""),
    g7: geohashArray.slice(0, 7).join(""),
    g8: geohashArray.slice(0, 8).join(""),
    g9: geohashArray.slice(0, 9).join(""),
  };
  return geohash;
};

export const getDocId = (product: Product): string => {
  const normalizedItemName = product.name.replace(/[^a-zA-Z0-9]+/g, "-");
  const productDocId = !product.eanCode
    ? product.ncmCode + "-" + normalizedItemName
    : product.eanCode;
  return productDocId;
}
