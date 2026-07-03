import { AxiosRequestConfig } from 'axios'
import { IApiResponse } from '../interfaces/api-response.interface'
import { ISignup, ISignupResponse } from '../interfaces/apis/signup-interface'
import { HttpService } from './base.service'

const BaseUrl = process.env.REACT_APP_AUTHENTICATION_MS_API_KEY

class UserService extends HttpService {
  private readonly prefix: string = 'tez'

  constructor() {
    super(BaseUrl)
  }

  /**
   * @description signup user and return userId and token
   * @param data
   * @param options
   * @returns
   */
  signUp = (
    data: ISignup,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<ISignupResponse>> =>
    this.post(`signup`, data, options)

  /**
   * @description get addresses
   * @param options
   * @returns
   */
  getAddress = (options?: AxiosRequestConfig): Promise<any> =>
    this.post(`${this.prefix}/get-addresses`, {}, options)
}
export const userService = new UserService()
