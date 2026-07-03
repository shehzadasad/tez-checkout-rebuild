import {
  ITokenizeCard,
  ITokenizeCardResponse,
} from './../interfaces/apis/tokenize-card.interface'
import { AxiosRequestConfig } from 'axios'
import { IApiResponse } from '../interfaces/api-response.interface'
import {
  ISendOtp,
  ISendOtpResponse,
} from '../interfaces/apis/send-otp.interface'
import {
  IVerifyOtp,
  IVerifyOtpResponse,
} from '../interfaces/apis/verify-otp.interface'
import { HttpService } from './base.service'

const BaseUrl = process.env.REACT_APP_SKYFLOW_URL

class SkyFlowService extends HttpService {
  constructor() {
    super(BaseUrl)
  }

  /**
   * @description send otp code on phone and on email depending on its type
   * @param data
   * @param options
   * @returns
   */
  getTokenCard = (
    data: ITokenizeCard,
    options?: AxiosRequestConfig,
  ): Promise<ITokenizeCardResponse> => this.post(`cards`, data, options)
}
export const skyFlowService = new SkyFlowService()
