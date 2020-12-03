import { Geohash } from "./Geohash";

export interface Location {
  lat: number;
  lon: number;
  geohash: Geohash;
}
