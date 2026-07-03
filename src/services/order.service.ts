import { AxiosRequestConfig } from 'axios'
import { IApiResponse } from '../interfaces/api-response.interface'
import {
  IApplyCoupon,
  IApplyCouponResponse,
} from '../interfaces/apis/apply-coupon.interface'
import { ICancelOrder } from '../interfaces/apis/cancel-order.interface'
import { IOrderDetailResponse } from '../interfaces/apis/order-detail.interface'
import { IOrderRequestLog } from '../interfaces/apis/order-request-log.interface'
import { IUpSellResponse } from '../interfaces/apis/upsell.interface'
import {
  IPlaceOrder,
  IPlaceOrderResponse,
} from '../interfaces/apis/place-order.interface'
import { HttpService } from './base.service'
import { IVerifyNitOtpCode } from '../interfaces/apis/verify-nift-otp-code.interface'

const BaseUrl = process.env.REACT_APP_ORDER_MS_API_KEY

class OrderService extends HttpService {
  constructor() {
    super(BaseUrl)
  }

  /**
   * @description get bank list for nift payment method
   * @param data
   * @param options
   * @returns
   */
  getBankList = (options?: AxiosRequestConfig): Promise<IApiResponse<any[]>> =>
    this.get(`get_bank_list`, {}, options)

  /**
   * @description apply coupon to get discount
   * @param data
   * @param options
   * @returns
   */
  applyCoupon = (
    data: IApplyCoupon,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<IApplyCouponResponse>> =>
    this.get(`validate_discount`, data, options)

  verifyNiftOtpCode = (
    data: IVerifyNitOtpCode,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<{}>> => this.post(`send_otp`, data, options)

  /**
   * @description create order
   * @param data
   * @param options
   * @returns
   */
  placeOrder = (
    data: IPlaceOrder,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<IPlaceOrderResponse>> =>
    this.post(`place_order`, data, options)

  /**
   * @description cancel order
   * @param data
   * @param options
   * @returns
   */
  cancelOrder = (
    data: ICancelOrder,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<{}>> => this.post(`cancel_order`, data, options)

  /**
   * @description get order request log
   * @param trackingId
   * @param options
   * @returns
   */
  getOrderRequestLog = (
    trackingId: string,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<IOrderRequestLog>> =>
    this.get(`order_request_log?tracking_id=${trackingId}`, {}, options)

  /**
   * @description get order details
   * @param trackingId
   * @param options
   * @returns
   */
  getOrderDetail = (
    trackingId: string,
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<IOrderDetailResponse>> =>
    this.get(`order_details?tracking_id=${trackingId}`, {}, options)

  /**
   * @description get up sell product list
   * @param trackingId
   * @param options
   * @returns
   */
  getUpSellItems = (
    ids: string[],
    options?: AxiosRequestConfig,
  ): Promise<IApiResponse<IUpSellResponse[]>> => {
    let query = ''
    ids.forEach((id, index) => {
      if (ids.length != index + 2 && index != 0) query = query + '&'
      query = query + `variant_id=${id}`
    })
    return this.get(`upsell-products?${query}`, {}, options)
  }

  /**
   * @description send order request
   * @param data
   * @returns
   */
  requestOrder = (
    data: { tracking_id: string },
    options?: AxiosRequestConfig,
  ): Promise<any> => this.post(`tez/request/order`, data, options)

  /**
   * @description create order
   * @param data
   * @param options
   * @returns
   */
  createOrder = (data: any, options?: AxiosRequestConfig): Promise<any> =>
    this.post(`tez/create/order`, data, options)

  /**
   * @description get all payment methods
   * @param options
   * @returns
   */
  getPaymentMethods = (options?: AxiosRequestConfig): Promise<any> =>
    this.get(`tez/merchant/paymentmethods`, {}, options)

  /**
   * @description get remaining time to complete order
   * @param data
   * @param options
   * @returns
   */
  getRemainingTime = (
    data: { tracking_id: string },
    options?: AxiosRequestConfig,
  ): Promise<any> => this.post(`tez/order/remainingtime`, data, options)
}
export const orderService = new OrderService()
