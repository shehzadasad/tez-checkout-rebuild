import { AxiosRequestConfig } from 'axios'
import { EEventName } from '../enums/event-name.enum'
import { IApiResponse } from '../interfaces/api-response.interface'
import { ICreateEvent } from '../interfaces/apis/create-event.interface'
import { IGetPaymentMethodResponse } from '../interfaces/apis/get-payment-methods.interface'
import { IGetTaxesAndShippingResponse } from '../interfaces/apis/get-taxes-and-shipping.interface'
import { ISignup, ISignupResponse } from '../interfaces/apis/signup-interface'
import { HttpService } from './base.service'

const BaseUrl = process.env.REACT_APP_ORDER_MS_API_KEY

class GeneralServiceTwo extends HttpService {
  constructor() {
    super(BaseUrl)
  }

  /**
   * @description checkout started
   * @param options
   * @returns
   */
  fourGives = (options?: AxiosRequestConfig): Promise<any> =>
    this.post(`check_custom_credit`, {}, options)
}
export const generalServiceTwo = new GeneralServiceTwo()
