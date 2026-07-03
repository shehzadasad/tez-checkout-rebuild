import { useEffect, useState } from "react";
import { IRequest } from "../../interfaces/apis/order-request-log.interface";
import { IProduct } from "../../interfaces/product.interface";
import { orderService } from "../../services/order.service";
import { request } from "http";

export const useOrderReviewHook = () => {
  const [encrypted, setEncrypted] = useState<IRequest | null>(null);
  const [lineItems, setLineItems] = useState<Array<IProduct>>([]);
  const [orderId, setOrderId] = useState<string>("");
  const [cartData, setCartData] = useState<any>();

  /**
   * @description get the order detail and update the internal state
   * * get payment method details
   * @param data
   * @param token
   */
  const requestOrderHandler = async (tracking_id: string, token: string) => {
    try {
      const response = await orderService.getOrderRequestLog(tracking_id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        setEncrypted(response.data.request);
        setLineItems(response.data.request.line_items);
        setCartData({
          totalAmount: response.data.request.total_amount,
          discount: response.data.request.discounted_amount,
          shippingAmount: response.data.request.shipping_amount,
          currency: response.data.request.currency,
          country_code: response.data.request.country_code,
          tax: response.data.request.tax_amount,
          shippingInfo: response.data.request.shipping_info,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    states: { encrypted, lineItems, orderId, cartData },
    setStates: { setOrderId },
    handlers: { requestOrderHandler },
  };
};
