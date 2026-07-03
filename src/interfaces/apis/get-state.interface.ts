import { IState } from "../state.interface";

export interface IGetStatesResponse {
  countryId: number;
  countryCame: string;
  iso2: String;
  iso3: string;
  states: IState[];
}
