import { AxiosRequestConfig } from "axios";
import { IApiResponse } from "../interfaces/api-response.interface";
import {
  ISendOtp,
  ISendOtpResponse,
} from "../interfaces/apis/send-otp.interface";
import { IUserFeedback, IUrlShort, IUrlShortGet } from "../interfaces/apis/user-feedback.interface";
import {
  IVerifyOtp,
  IVerifyOtpResponse,
} from "../interfaces/apis/verify-otp.interface";
import { HttpService } from "./base.service";

// const BaseUrl = process.env.REACT_APP_RECOVERY_MS_API_KEY;
const BaseUrl = "https://recovery.qisstpay.com";

class RecoveryService extends HttpService {
  constructor() {
    super(BaseUrl);
  }

  /**
   * @description send user feedback
   * @param data
   * @param options
   * @returns
   */
  sendUserFeedback = (
    data: IUserFeedback,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<{}>> => this.post(`user-feedback`, data, options);

  /**
 * @description checkout started
 * @param data
 * @param options
 * @returns
 */
  urlShortner = (
    body: IUrlShort,
    options?: AxiosRequestConfig
    // ): Promise<IApiResponse<IGetPaymentMethodResponse>> =>

  ): Promise<any> => this.post(`url_short`, body, options)

  /**
* @description checkout started
* @param data
* @param options
* @returns
*/
  getLink = (
    body: IUrlShortGet,
    options?: AxiosRequestConfig
    // ): Promise<IApiResponse<IGetPaymentMethodResponse>> =>

  ): Promise<any> => this.post(`get_url`, body, options)
}
export const recoveryService = new RecoveryService();
