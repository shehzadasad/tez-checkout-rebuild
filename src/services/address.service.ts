import { AxiosRequestConfig } from "axios";
import { IAddress } from "../interfaces/address.interface";
import { IApiResponse } from "../interfaces/api-response.interface";
import { IGetCitiesResponse } from "../interfaces/apis/get-city.interface";
import { IGetStatesResponse } from "../interfaces/apis/get-state.interface";
import { ICountry } from "../interfaces/country.interface";
import { HttpService } from "./base.service";

const BaseUrl = process.env.REACT_APP_CUSTOMER_MS_API_KEY;

class AddressService extends HttpService {
  constructor() {
    super(BaseUrl);
  }

  addAddress = (
    data: IAddress,
    userId: string,
    options?: AxiosRequestConfig
  ): Promise<any> =>
    this.post(`addShippingAddress?user_id=${userId}`, data, options);

  updateAddress = (
    data: IAddress,
    userId: string,
    options?: AxiosRequestConfig
  ): Promise<any> =>
    this.post(`updateShippingAddress?user_id=${userId}`, data, options);

  getAddress = (userId: string, options?: AxiosRequestConfig): Promise<any> =>
    this.get(`Address?user_id=${userId}&address_type=SHIPPING`, {}, options);

  deleteAddress = (
    body: { id: string },
    userId: string,
    options?: AxiosRequestConfig
  ): Promise<any> =>
    this.delete(`deleteShippingAddress?user_id=${userId}`, {}, body, options);

  markAsDefaultAddress = (
    body: { id: number; is_default: boolean; rs_anonymous_id: string },
    userId: string,
    options?: AxiosRequestConfig
  ): Promise<any> =>
    this.post(`markDefaultShippingAddress?user_id=${userId}`, body, options);
}
export const addressService = new AddressService();
