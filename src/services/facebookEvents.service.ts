import { AxiosRequestConfig } from "axios";
import { HttpService } from "./base.service";

const BaseUrl = process.env.REACT_APP_MERCHANT_SCRIPTS_API_KEY;

class FacebookEvents extends HttpService {
  private readonly prefix: string = "tez";

  constructor() {
    super(BaseUrl);
  }

  /**
   * @description get remaining time to complete order
   * @param data
   * @param options
   * @returns
   */
  getFacebookScript = (
    data: string,
    options?: AxiosRequestConfig
  ): Promise<any> =>
    this.post(`merchant/scripts`, data, options);
}
export const facebookEvents = new FacebookEvents();
