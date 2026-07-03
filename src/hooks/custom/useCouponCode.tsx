import { useContext, useState } from "react";
import { orderService } from "../../services/order.service";
import { Context as CheckoutContext } from "../context/checkoutContext";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../enums/GA-messages";

export const useCouponCodeHook = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    state: {
      emailValidated,
      platform_fee,
      email,
      token,
      identityToken,
      customerId,
      GoogleAnalyticsCred,
      MerchantUserId,
      rudderStackID,
      user_type,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const applyCouponCodeHandler = async () => {
    (global as any).rudderanalytics?.track(
      "coupon_code_entered",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
        couponCode: couponCode,
        email: email,
      }
    );
    if (!emailValidated) {
      setError("Please verify email first");
    }
    if (emailValidated) {
      setError("");
    }
    try {
      if (couponCode == "") return;
      setLoading(true);
      let tkn = localStorage.getItem("JWTtoken");

      const response = await orderService.applyCoupon(
        {
          code: couponCode,
          // total_price: String(totalAmount),
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${tkn ? tkn : token ? token : ""}`,
            "identity-token": identityToken,
          },
        }
      );
      // console.log(response,"responseresponseresponseresponse");
      console.log(platform_fee, "platform_feeplatform_feeplatform_fee");
      if (response.success) {
        // --- Google Analytics --- //
        if (GoogleAnalyticsCred?.type === "UA") {
          console.log(
            "GoogleAnalyticsCred.tracking_id => ",
            GoogleAnalyticsCred?.tracking_id
          );
          ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
          ReactGA.event({
            category: "Event",
            action: GAMessages.CUPON_ACTIVATED,
          });
        }

        if (GoogleAnalyticsCred?.type === "GA4") {
          console.log(
            "GoogleAnalyticsCred.measurement_id => ",
            GoogleAnalyticsCred?.measurement_id
          );
          ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
          ReactGA4.event({
            category: "Event",
            action: GAMessages.CUPON_ACTIVATED,
          });
        }

        // --- Google Analytics End --- //
        setTimeout(() => {
          setError("");
          setLoading(false);
          updateStateHandler({
            payload: {
              discountedAmount:
                response.discountValue == 100 || response.discountValue == "100"
                  ? platform_fee
                  : response.discountValue == 50 ||
                    response.discountValue == "50"
                  ? platform_fee / 2
                  : 0,
              couponCode: couponCode,
              isCouponApplied: response.valid,
            },
          });
        });
      } else {
        setLoading(false);
        updateStateHandler({
          payload: {
            discountedAmount:
              response.discountValue == 100 || response.discountValue == "100"
                ? platform_fee
                : response.discountValue == 50 || response.discountValue == "50"
                ? platform_fee / 2
                : 0,
            couponCode: couponCode,
            isCouponApplied: response.valid,
          },
        });
        setError(response.message);
      }
    } catch (error: any) {
      console.log(error.response.data.error, "err");

      setError(error?.response?.data?.error);

      setLoading(false);
    }
  };

  return {
    states: { loading, error, couponCode },
    setStates: { setLoading, setCouponCode },
    handlers: { applyCouponCodeHandler },
  };
};
