import { AxiosRequestConfig } from "axios";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IAddAddressOld } from "../interfaces/apis/add-address.interface";
import { IGetCitiesResponse } from "../interfaces/apis/get-city.interface";
import { IGetStatesResponse } from "../interfaces/apis/get-state.interface";
import { ICountry } from "../interfaces/country.interface";
import { HttpService } from "./base.service";

const BaseUrl = process.env.REACT_APP_WEB_EXTERNAL_MS_API_KEY;

class LocationService extends HttpService {
  private readonly prefix: string = "app/world";
  constructor() {
    super(BaseUrl);
  }

  /**
   * @description get countries list
   * @param data
   * @param options
   * @returns
   */
  getCountries = (
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<ICountry[]>> =>
    this.get(`${this.prefix}/countries`, {}, options);

  /**
   * @description get states list
   * @param countryIso
   * @param options
   * @returns
   */
  getStates = (
    countryId: string,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IGetStatesResponse>> =>
    this.get(`${this.prefix}/states/countryId/${countryId}`, {}, options);

  /**
   * @description get cities list
   * @param countryIso
   * @param stateCode
   * @param options
   * @returns
   */
  getCities = (
    stateId: string,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IGetCitiesResponse>> =>
    this.get(`${this.prefix}/cities/stateId/${stateId}`, {}, options);

  addAddress = (
    data: IAddAddressOld,
    options?: AxiosRequestConfig
  ): Promise<any> => this.post(`1cc/addAddress`, data, options);
  getAddress = (data: string, options?: AxiosRequestConfig): Promise<any> =>
    this.get(`1cc/getAddresses/${data}`, {}, options);
}
export const locationService = new LocationService();
