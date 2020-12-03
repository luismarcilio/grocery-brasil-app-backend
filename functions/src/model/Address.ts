import { City } from "./City";
import { State } from "./State";
import { Country } from "./Country";
import { Location } from "./Location";

export interface Address {
  rawAddress: string;
  street?: string;
  number?: string;
  complement?: string;
  poCode?: string;
  county?: string;
  city?: City;
  state?: State;
  country?: Country;
  location?: Location;
}
