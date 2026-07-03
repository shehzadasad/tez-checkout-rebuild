import React, { useContext,useState, useEffect } from "react";
import { usePhoneOtpHook } from "../hooks/custom/usePoneOtp";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import "../styles/phoneScreen.css";
import { useHistory } from "react-router-dom";
const OtpPhone = () => {
    const {
        state: {
          intlNumber,
          phoneNumber,
          countryCode,
          currency,
          taxPrice,
          shippingPrice,
          totalAmount,
          productsObj,
          discountedAmount,
          cartSessionID,
          is4gives,
          GoogleAnalyticsCred,
          mall_ID,
          globalCartObject,
          phoneNumberUrl,
        },
        actions: { updateStateHandler },
      } = useContext(CheckoutContext);
  const {
    states: { onLoad, otpCode, error },
    setStates: { setOtpCode },
    handlers: { verifyOtpHandler, resendOtpCodeHandler, MyTimerHandler },
  } = usePhoneOtpHook();
  // useEffect(() => {
  //   let ac = new AbortController();
  //   setTimeout(() => {
  //     // abort after 10 minutes
  //     ac.abort();
  //   }, 10 * 60 * 1000);
  // console.log(ac,"abc");
  // console.log(navigator.credentials,"navigator.credentials");
  //   if (navigator.credentials && navigator.credentials.get) {
  //     navigator.credentials
  //       .get({
  //         otp: { transport: ["sms"] },
  //         signal: ac.signal
  //       })
  //       .then(otp => {
  //         setOtpCode(otp.code);
  //         console.log("your otp code is", otp.code);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   } else {
  //     console.log("Web Authentication API not supported");
  //   }
  // }, []);
  const history = useHistory();
  const optCodeChangeHandler = (otp) => {
    setOtpCode(otp);
    if (otp.length == 4) {
      verifyOtpHandler(
        otp,
        intlNumber,
        (updatedContext, redirectionUrl) => {
          updateStateHandler({
            payload: {
              ...updatedContext,
              isGuest: false,
            },
          });
          history.push(redirectionUrl);
        }
      );
    }
  };
  return (
    <input
      value={otpCode}
      onChange={(e) => optCodeChangeHandler(e.target.value)}
      className="otp-phone"
      disabled={
        mall_ID && mall_ID !== null && globalCartObject.length === 0 && true
      }
      // autoComplete="one-time-code"
      // containerStyle="otp-container"
      autoFocus={true}
    />
  );
};

export default OtpPhone;
