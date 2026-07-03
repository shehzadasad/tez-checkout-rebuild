import { useContext, useState } from "react";
import { IRequest } from "../../interfaces/apis/order-request-log.interface";
import { orderService } from "../../services/order.service";
import { Context as CheckoutContext } from "../context/checkoutContext";
import { useTimer } from "react-timer-hook";
import { zeroPadHelper } from "../../utils/helper";

export const usePaymentSuccessHook = () => {
  const {
    state: {
      activeMethod,
      token,
      customerId,
      MerchantUserId,
      rudderStackID,
      user_type,
      time_stamp,
      discountedAmount,
      taxes,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const [loadShipping, setLoadShipping] = useState(false);
  const [disable, setDisable] = useState(false);
  const [loadQisstpay, setLoadQisstpay] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerSuccess, setTimerSuccess] = useState(false);
  const [encrypted, setEncrypted] = useState<IRequest | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [query, setQueryString] = useState("");
  const [transactionID, setTransactionID] = useState<any>("");

  const [mins, setMins] = useState<string>("");
  const [secs, setSecs] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [timerClosed, setTimerClosed] = useState(false);
  /**
   * @description get the order detail
   */
  const getOrderDetailHandler = async () => {
    try {
      const response = await orderService.getOrderDetail(trackingId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.success) {
        updateStateHandler({
          payload: {
            orderStatus: response.data.current_order_detail.order_status,
          },
        });
      } else {
        setError(response?.message ?? "Something went wrong.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    }
  };

  /**
   * @description return in bnpl case and redirect and trigger message for bnpl success case
   * @param trackingID
   * @param token
   */
  const bnplHandler = async (trackingID: string, token: string) => {
    const response = await orderService.getOrderDetail(trackingID, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    (global as any).rudderanalytics?.track(
      `review_screen_success`,
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        method: response?.data?.current_order_detail?.order_status,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    if (response.data.current_order_detail.order_status == "COMPLETED") {
      const message = {
        success: true,
        result: {
          order_id: response.data.current_order_detail.order_number,
          invoice_id: "",
          redirect_url: "",
          merchant_order_id:
            response.data.current_order_detail.merchant_order_id,
        },
        message: "Order completed!",
        status: 200,
      };
      window.parent.postMessage(JSON.stringify(message), "*");
      if (
        response.data.current_order_detail.redirect_url != "" &&
        response.data.current_order_detail.redirect_url != null
      ) {
        let url = response.data.current_order_detail.redirect_url;
        if (url.indexOf("?") !== -1) {
          url = `${url}&order_id=${response.data.current_order_detail.order_number}&merchant_order_id=${response.data.current_order_detail.merchant_order_id}&success=${response.success}`;
        } else {
          url = `${url}/?order_id=${response.data.current_order_detail.order_number}&merchant_order_id=${response.data.current_order_detail.merchant_order_id}&success=${response.success}`;
        }

        window.location.href = url;
        return false;
      }
    }
  };

  /**
   * @description
   * * request to get order data
   * @param tracking_id
   * @param token
   */
  const requestOrderHandler = async (trackingID: any, token: any) => {
    try {
      const response = await orderService.getOrderRequestLog(trackingID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      if (response.success) {
        setEncrypted(response.data.request);
        updateStateHandler({
          payload: {
            token: token,
            identityToken: response.data.headers["Identity-Token"][0],
            isExistingUser: response.data.request.isExistingUser,
          },
        });
        if (
          response.data.request.payment_type == "COD" ||
          response.data.request.payment_type == "cod"
        ) {
          setPaymentMethod("cod");
        }
        if (response.data.request.merchant_package_name == "PAY_IN_4") {
          setPaymentMethod("qisstpay");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
          "CLOVER"
        ) {
          setPaymentMethod("CLOVER");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ===
            "VAULT" ||
          response.data.request.payment_type.toLocaleUpperCase() === "VAULT"
        ) {
          setPaymentMethod("wallet");
        }
        if (response.data.request.merchant_package_name == "PAY_IN_3") {
          setPaymentMethod("pay_in_3");
        }
        if (response.data.request.merchant_package_name == "PAY_IN_2") {
          setPaymentMethod("pay_in_2");
        }
        if (response.data.request.merchant_package_name == "PAY_IN_6") {
          setPaymentMethod("pay_in_6");
        }
        if (
          response.data.request.payment_type == "SPLIT_PAY" ||
          response.data.request.payment_type == "SPLITIT"
        ) {
          setPaymentMethod("qisstpay");
        }
        if (
          response.data.request.payment_type == "PAYPAL" ||
          response.data.request.payment_type == "paypal"
        ) {
          setPaymentMethod("paypal");
        }
        if (
          response.data.request.payment_type == "GOOGLEPAY" ||
          response.data.request.payment_type == "googlepay"
        ) {
          setPaymentMethod("googlepay");
        }
        if (
          response.data.request.payment_type == "CARD" ||
          response.data.request.payment_type == "card" ||
          response.data.request.merchant_package_name == "card" ||
          response.data.request.merchant_package_name == "Card"
        ) {
          setPaymentMethod("card");
        }
        if (response.data.request.payment_type == "DIRECT_BANK_TRANSFER") {
          setPaymentMethod("DIRECT_BANK_TRANSFER");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "EASYPAISA"
        ) {
          setPaymentMethod("EASYPAISA");
        }
        if (response.data.request.payment_type == "KLARNA") {
          setPaymentMethod("KLARNA");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "SQUARE"
        ) {
          // console.log("innn square")
          // console.log(response.data.request.payment_type.toLocaleLowerCase)

          setPaymentMethod("SQUARE");
          // console.log(paymentMethod)
        }

        if (response.data.request.is_tez == 0) {
          await bnplHandler(trackingID, token);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong.");
    }
  };

  /**
   * @description
   * * getting remaining time to cancel the order
   * @param tracking_id
   * @param token
   */
  const requestTimeHandler = async (trackingID: any, token: any) => {
    try {
      const response = await orderService.getRemainingTime(
        { tracking_id: trackingID },
        {
          headers: {
            Authorization: `Bearer  ${token}`,
          },
        }
      );
      if (response.data.success) {
        // console.log(response);
        setTimer(Number(response.data.remaining_time));
        setTimerSuccess(true);
      }
    } catch {
      setError("Unauthenticated");
    }
  };

  const EasyPaisaTimerHandler = ({ expiryTimestamp }: any) => {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({
      expiryTimestamp,
      onExpire: () => {
        setTimerClosed(true);
        getOrderDetailHandler();
      },
    });
    return (
      <>
        {!timerClosed ? (
          <p className="otp-text mt-2px">
            <p className="base-color marginOnTimer">
              {zeroPadHelper(minutes, 2)}:{zeroPadHelper(seconds, 2)}s
            </p>
          </p>
        ) : (
          <img src="/assets/refresh.gif" className="reload-gif" />
        )}
      </>
    );
  };

  return {
    states: {
      loadQisstpay,
      loadShipping,
      timer,
      timerSuccess,
      disable,
      mins,
      secs,
      query,
      encrypted,
      paymentMethod,
      transactionID,
      activeMethod,
      orderId,
      trackingId,
    },
    setStates: {
      setMins,
      setSecs,
      setDisable,
      setQueryString,
      setLoadQisstpay,
      setLoadShipping,
      setTransactionID,
      setOrderId,
      setTrackingId,
    },
    handlers: {
      requestTimeHandler,
      requestOrderHandler,
      getOrderDetailHandler,
      EasyPaisaTimerHandler,
    },
  };
};
