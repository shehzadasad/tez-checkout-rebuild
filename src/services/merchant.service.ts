import { AxiosRequestConfig } from 'axios'
import { IApiResponse } from '../interfaces/api-response.interface'
import { IGetPaymentMethodResponse } from '../interfaces/apis/get-payment-methods.interface'
import { IGetTaxesAndShippingResponse } from '../interfaces/apis/get-taxes-and-shipping.interface'
import { ISignup, ISignupResponse } from '../interfaces/apis/signup-interface'
import { HttpService } from './base.service'

const BaseUrl = process.env.REACT_APP_WEB_EXTERNAL_MS_API_KEY

class MerchantService extends HttpService {
  constructor() {
    super(BaseUrl)
  }

  /**
   * @description get merchant payment methods and views
   * @param data
   * @param options
   * @returns
   */
  getPaymentMethods = (
    options?: AxiosRequestConfig,
    // ): Promise<IApiResponse<IGetPaymentMethodResponse>> =>
  ): Promise<any> => this.get(`merchants/payment/methods`, {}, options)

  /**
   * @description get taxes and shipping details
   * @param options
   * @returns
   */
  getTaxesAndShipping = (
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<IGetTaxesAndShippingResponse>> =>
    this.get(`1cc/merchant/taxes`, {}, options)

  /**
   * @description get merchant payment methods and views
   * @param data
   * @param options
   * @returns
   */
  getPaymentMethodsV1 = (
    options?: AxiosRequestConfig,
    // ): Promise<IApiResponse<IGetPaymentMethodResponse>> =>
  ): Promise<any> => this.get(`merchants/v1/payment/methods`, {}, options)
}

export const merchantService = new MerchantService()
