import { ICity } from "../city.interface";
import { IState } from "../state.interface";

export interface IGetCitiesResponse {
  countryId: number;
  countryName: string;
  cities: ICity[];
}
