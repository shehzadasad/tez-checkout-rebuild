import { AxiosRequestConfig } from "axios";
import { IApiResponse } from "../interfaces/api-response.interface";
import {
  ISendOtp,
  ISendOtpResponse,
} from "../interfaces/apis/send-otp.interface";
import {
  IVerifyOtp,
  IVerifyOtpMail,
  IVerifyOtpResponse,
  IVerifyOtpResponseNumber,
} from "../interfaces/apis/verify-otp.interface";
import { HttpService } from "./base.service";

const BaseUrl = process.env.REACT_APP_AUTHENTICATION_MS_API_KEY;

class OtpService extends HttpService {
  private readonly prefix: string = "tez";

  constructor() {
    super(BaseUrl);
  }

  /**
   * @description send otp code on phone and on email depending on its type
   * @param data
   * @param options
   * @returns
   */
  sendOtp = (
    data: ISendOtp,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<ISendOtpResponse>> =>
    this.post(`sendotp`, data, options);

  /**
   * @description verify otp code on phone and email depending on its type
   * @param data
   * @param options
   * @returns
   */

  verifyOtp = (
    data: IVerifyOtp,
    options?: AxiosRequestConfig
  ): Promise<IApiResponse<IVerifyOtpResponseNumber>> =>
    this.post(`verifyotp`, data, options);
    
    verifyOtpMail = (
      data: IVerifyOtpMail,
      options?: AxiosRequestConfig
    ): Promise<IApiResponse<IVerifyOtpResponse>> =>
      this.post(`verifyotp`, data, options);
  // /**
  //  * @description send otp on phone number
  //  * @param data
  //  * @returns
  //  */
  // sendPhoneOtp = (
  //   data: { phone_number: string },
  //   options?: AxiosRequestConfig
  // ): Promise<any> => this.post(`${this.prefix}/otp/send`, data, options);

  /**
   * @description verify phone otp code
   * @param data
   * @param options
   * @returns
   */
  verifyPhoneOtp = (
    data: { value: string; pin: string },
    options?: AxiosRequestConfig
  ): Promise<any> => this.post(`${this.prefix}/confirm-otp`, data, options);

  /**
   * @description verify email otp code
   * @param data
   * @param options
   * @returns
   */
  verifyEmailOtp = (
    data: { value: string; pin: string },
    options?: AxiosRequestConfig
  ): Promise<any> =>
    this.post(`${this.prefix}/confirm-email-otp`, data, options);

  /**
   * @description resend email otp code
   * @param options
   * @returns
   */
  resendEmailOtp = (options?: AxiosRequestConfig): Promise<any> =>
    this.get(`${this.prefix}/resend-email`, {}, options);
}
export const otpService = new OtpService();
