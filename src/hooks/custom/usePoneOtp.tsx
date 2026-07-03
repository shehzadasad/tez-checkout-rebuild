import { useCallback, useContext, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { otpService } from "../../services/otp.service";
import { isEmpty, isNull } from "lodash";
import { setUserData } from "../../helper/setUserData";
import { routes } from "../../router/routes";
import { useTimer } from "react-timer-hook";
import { Context as CheckoutContext } from "../context/checkoutContext";
import { EOtpType } from "../../enums/otp-type.enum";
import { checkBlockCitiesHelper } from "../../utils/check-block-cities.helper";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../enums/GA-messages";
import axios from "axios";

export const usePhoneOtpHook = () => {
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [timerClosed, setTimerClosed] = useState(false);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 30); // 30 seconds timer
  const {
    state: {
      isEventsEnabled,
      intlNumber,
      customerId,
      currency,
      checkout_url,
      identityToken,
      cartSessionID,
      totalAmount,
      shippingPrice,
      discountedAmount,
      taxPrice,
      productsObj,
      email: userEmail,
      GoogleAnalyticsCred,
      mall_ID,
      globalCartObject,
      rudderStackID,
      is4gives,
      MerchantUserId,
      checkout_anonymous_id,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  useEffect(() => {
    if (mall_ID && mall_ID !== null && globalCartObject.length === 0) {
      setError("Cart is empty. Can't proceed further - Please close checkout!");
    } else {
      setError("");
    }
  }, [globalCartObject]);

  /**
   * @description hit verify phone otp code
   * * have different check (email verified, user detail verified etc)
   * * do redirection and update context on the basis of validation and check of api response
   * @param otp
   * @param intlNumber
   * @param callBack
   */
  const verifyOtpHandler = async (
    otp: string = "",
    intlNumber: string,
    callBack: Function,
    signInRequestId: any = null
  ) => {
    // console.log("verifyOtpHandler CALLED!");
    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    try {
      Sentry.captureMessage("Something went wrong");
      const re = /^[0-9]+$/;
      if (re.test(otp) || otp.length == 4) {
        setOnLoad(true);
        const response = await otpService.verifyOtp(
          {
            isEventsEnabled: isEventsEnabled,
            otp: otp,
            value: intlNumber,
            type: EOtpType.PHONE,
            segmentId: segmentId,
            checkoutUrl: checkout_url,
            signInRequestId: signInRequestId,
            rs_anonymous_id: rudderStackID,
          },
          {
            headers: {
              "identity-token": identityToken,
            },
          }
        );

        let updatedState = {
          customerId: "",
          token: "",
          cardInfo: [],
          email: "",
          userDetail: false,
          emailValidated: false,
          shippingZip: "",
          billingZip: "",
          isExistingUser: false,
        };
        if (response.success) {
          updateStateHandler({
            payload: {
              user_type: response.data.isEventsEnabled == true ? 1 : 2,
            },
          });
          if (response.data.isExistingUser === true) {
            // --- Google Analytics --- //
            if (GoogleAnalyticsCred?.type === "UA") {
              // console.log(
              //   "GoogleAnalyticsCred.tracking_id => ",
              //   GoogleAnalyticsCred?.tracking_id
              // );
              ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
              ReactGA.event({
                category: "Event",
                action: GAMessages.RETURNING_USER,
              });
            }

            if (GoogleAnalyticsCred?.type === "GA4") {
              // console.log(
              //   "GoogleAnalyticsCred.measurement_id => ",
              //   GoogleAnalyticsCred?.measurement_id
              // );
              ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
              ReactGA4.event({
                category: "Event",
                action: GAMessages.RETURNING_USER,
              });
            }
            // --- Google Analytics End --- //
            // try {
            //   await axios
            //     .put(
            //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
            //       {
            //         userId: response.data.user.id,
            //         phoneNumber: intlNumber,
            //         sessionId: cartSessionID,
            //         json: JSON.stringify({
            //           sessionID: cartSessionID.toString(),
            //           date: new Date(),
            //           email: response?.data?.user?.email,
            //           abandonedStep: "OTP Page",
            //           emailStatus: "",
            //           recoveryStatus: "",
            //           totalAmount: (
            //             Number(totalAmount) +
            //             Number(shippingPrice) +
            //             Number(taxPrice) -
            //             Number(discountedAmount)
            //           ).toString(),
            //           currency: currency,
            //           orderItems: {
            //             product: productsObj,
            //             shippingAmount: shippingPrice,
            //             subTotal: (
            //               Number(totalAmount) - Number(discountedAmount)
            //             ).toString(),
            //           },
            //           orderDetails: {
            //             firstName: response?.data?.user?.firstName,
            //             lastName: response?.data?.user?.lastName,
            //             phoneNumber: response?.data?.user?.phoneNumber,
            //             cityName: response?.data?.shipping?.cityName,
            //             stateName: response?.data?.shipping?.stateName,
            //             countryName: response?.data?.shipping?.countryName,
            //             zipCode: response?.data?.shipping?.zip,
            //           },
            //           billingDetails: {
            //             name:
            //               response?.data?.user?.firstName +
            //               " " +
            //               response?.data?.user?.lastName,
            //             phone_number: intlNumber,
            //             address_1: response?.data?.billing?.addressLineOne,
            //             address_2: response?.data?.billing?.addressLineTwo,
            //             city: response?.data?.billing?.cityName,
            //             zip: response?.data?.billing?.zip,
            //             state: response?.data?.billing?.stateName,
            //             country: response?.data?.billing?.countryName,
            //             address_type: "Billing",
            //           },
            //           shippingDetails: {
            //             name:
            //               response?.data?.user?.firstName +
            //               " " +
            //               response?.data?.user?.lastName,
            //             phone_number: intlNumber,
            //             address_1: response?.data?.shipping?.addressLineOne,
            //             address_2: response?.data?.shipping?.addressLineTwo,
            //             city: response?.data?.shipping?.cityName,
            //             zip: response?.data?.shipping?.zip,
            //             state: response?.data?.shipping?.stateName,
            //             country: response?.data?.shipping?.countryName,
            //             address_type: "Shipping",
            //           },
            //         }),
            //       }
            //     )
            //     .then(async (response: any) => {
            //       updateStateHandler({
            //         payload: {
            //           cartSessionID: response?.data?.body?.sessionId,
            //         },
            //       });
            //     })
            //     .catch(function (error) {
            //       console.log(error);
            //     });
            // } catch (error: any) {
            //   console.log(error);
            // }
          }

          setOtpCode("");
          if (response.data.isExistingUser == false) {
            // --- Google Analytics --- //
            if (GoogleAnalyticsCred?.type === "UA") {
              // console.log(
              //   "GoogleAnalyticsCred.tracking_id => ",
              //   GoogleAnalyticsCred?.tracking_id
              // );
              ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
              ReactGA.event({
                category: "Event",
                action: GAMessages.NEW_USER,
              });
            }

            if (GoogleAnalyticsCred?.type === "GA4") {
              // console.log(
              //   "GoogleAnalyticsCred.measurement_id => ",
              //   GoogleAnalyticsCred?.measurement_id
              // );
              ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
              ReactGA4.event({
                category: "Event",
                action: GAMessages.NEW_USER,
              });
            }
            // --- Google Analytics End --- //
            callBack({}, routes.userDetailPage);
          } else {
            updatedState.isExistingUser = true;
          }
          updatedState.customerId = String(response.data.user.id);
          updatedState.token =
            response.data.token != null ? response.data.token : "";

          updateStateHandler({
            payload: {
              isStackBuilderEnabled: response.data.isStackBuilderEnabled,
              merchantWalletIsEnabled: response.data.merchantWalletIsEnabled,
              merchantWalletFeePercentage:
                response.data.merchantWalletFeePercentage,
            },
          });

          if (
            checkBlockCitiesHelper(
              identityToken,
              response.data.billing.cityName
            )
          ) {
            setOnLoad(false);
            setError("Cannot place an order from your city.");
            return;
          }
          //Check that payment method is selected of not and set cardInfo
          //TODO: verify this data because we are not getting this now in api response
          // if (response.data.data.payment_method != null) {
          //   if (
          //     isNull(response.data.data.payment_method.account_holder_name) ||
          //     isNull(response.data.data.payment_method.card_number) ||
          //     isNull(response.data.data.payment_method.card_type) ||
          //     isNull(response.data.data.payment_method.exp_month) ||
          //     isNull(response.data.data.payment_method.exp_year)
          //   ) {
          //   } else {
          //     updatedState.cardInfo = response.data.data.payment_method;
          //   }
          // }

          //validate email
          if (response.data.user.email !== "") {
            var email = response.data.user.email;
            var domain = email.substring(email.lastIndexOf("@") + 1);
            if (domain == "example.com") {
              updatedState.email = "";
            } else {
              updatedState.email = response.data.user.email;
            }
          }

          if (
            response.data.user.firstName === "" ||
            response.data.billing.cityName === "" ||
            response.data.billing.countryName === "" ||
            response.data.billing.stateName === "" ||
            response.data.billing.addressLineOne === "" ||
            // response.data.billing.zip === "" ||
            // response.data.billing.zip == "NA" ||
            response.data.shipping.addressLineOne === "" ||
            // response.data.shipping.zip === "" ||
            response.data.shipping.countryName === "" ||
            response.data.shipping.cityName === "" ||
            response.data.billing === null
            // response.data.shipping.zip == "NA"
            // isEmpty(response.data.user.lastName) ||
          ) {
            setTimeout(() => {
              updatedState = {
                ...updatedState,
                ...setUserData(
                  response.data.user.firstName,
                  response.data.user.lastName,
                  response.data.billing.addressLineOne,
                  response.data.billing.cityName,
                  response.data.billing.countryName,
                  "",
                  "",
                  "",
                  "",
                  response.data.shipping.stateName,
                  response.data.shipping.cityName,
                  response.data.shipping.countryName
                ),
              };
              updatedState = {
                ...updatedState,
                shippingZip: response.data.shipping.zip ?? "",
                billingZip: response.data.billing.zip ?? "",
              };
              setOnLoad(false);
              //TODO: redirection on user detail screen callback

              callBack(updatedState, routes.userDetailPage);
              //   props.userDetails(true);
            }, 500);
          } else if (response.data.isEmailVerified == true) {
            // console.log("141");
            setTimeout(() => {
              updatedState = {
                ...updatedState,
                ...setUserData(
                  response.data.user.firstName,
                  response.data.user.lastName,
                  response.data.shipping.addressLineOne,
                  response.data.shipping.cityName,
                  response.data.shipping.countryName,
                  "",
                  response.data.billing.addressLineOne,
                  response.data.billing.cityName,
                  response.data.billing.countryName,
                  response.data.shipping.stateName,
                  response.data.shipping.cityName,
                  response.data.shipping.countryName
                ),
              };
              updatedState = {
                ...updatedState,
                emailValidated: true,
                shippingZip: response.data.shipping.zip ?? "",
                billingZip: response.data.billing.zip ?? "",
              };
              setOnLoad(false);
              //TODO: redirection on payment selection screen callback
              //   props.payment_selection(true);
              callBack(updatedState, routes.paymentSelectionPage);
            }, 500);
          } else {
            // console.log("line 160");
            setTimeout(() => {
              updatedState = {
                ...updatedState,
                ...setUserData(
                  response.data.user.firstName,
                  response.data.user.lastName,
                  response.data.shipping.addressLineOne,
                  response.data.shipping.cityName,
                  response.data.shipping.countryName,
                  "",
                  response.data.billing.addressLineOne,
                  response.data.billing.cityName,
                  response.data.billing.countryName,
                  response.data.shipping.stateName,
                  response.data.shipping.cityName,
                  response.data.shipping.countryName
                ),
              };
              updatedState = {
                ...updatedState,
                emailValidated: false,
                shippingZip: response.data.shipping.zip ?? "",
                billingZip: response.data.billing.zip ?? "",
              };
              setOnLoad(false);
              //TODO: redirection on user detail screen callback
              callBack(updatedState, routes.paymentSelectionPage);
            }, 500);
          }
        } else {
          if (response.data.isExistingUser === true) {
            // --- Google Analytics --- //
            if (GoogleAnalyticsCred?.type === "UA") {
              // console.log(
              //   "GoogleAnalyticsCred.tracking_id => ",
              //   GoogleAnalyticsCred?.tracking_id
              // );
              ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
              ReactGA.event({
                category: "Event",
                action: GAMessages.RETURNING_USER,
              });
            }

            if (GoogleAnalyticsCred?.type === "GA4") {
              // console.log(
              //   "GoogleAnalyticsCred.measurement_id => ",
              //   GoogleAnalyticsCred?.measurement_id
              // );
              ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
              ReactGA4.event({
                category: "Event",
                action: GAMessages.RETURNING_USER,
              });
            }
            // --- Google Analytics End --- //
            // try {
            //   await axios
            //     .put(
            //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
            //       {
            //         userId: response.data.user.id,
            //         phoneNumber: intlNumber,
            //         sessionId: cartSessionID,
            //         json: JSON.stringify({
            //           sessionID: cartSessionID.toString(),
            //           date: new Date(),
            //           email: response?.data?.user?.email,
            //           abandonedStep: "OTP Page",
            //           emailStatus: "",
            //           recoveryStatus: "",
            //           totalAmount: (
            //             Number(totalAmount) +
            //             Number(shippingPrice) +
            //             Number(taxPrice) -
            //             Number(discountedAmount)
            //           ).toString(),
            //           currency: currency,
            //           orderItems: {
            //             product: productsObj,
            //             shippingAmount: shippingPrice,
            //             subTotal: (
            //               Number(totalAmount) - Number(discountedAmount)
            //             ).toString(),
            //           },
            //           orderDetails: {
            //             firstName: response?.data?.user?.firstName,
            //             lastName: response?.data?.user?.lastName,
            //             phoneNumber: response?.data?.user?.phoneNumber,
            //             cityName: response?.data?.shipping?.cityName,
            //             stateName: response?.data?.shipping?.stateName,
            //             countryName: response?.data?.shipping?.countryName,
            //             zipCode: response?.data?.shipping?.zip,
            //           },
            //           billingDetails: {
            //             name:
            //               response?.data?.user?.firstName +
            //               " " +
            //               response?.data?.user?.lastName,
            //             phone_number: intlNumber,
            //             address_1: response?.data?.billing?.addressLineOne,
            //             address_2: response?.data?.billing?.addressLineTwo,
            //             city: response?.data?.billing?.cityName,
            //             zip: response?.data?.billing?.zip,
            //             state: response?.data?.billing?.stateName,
            //             country: response?.data?.billing?.countryName,
            //             address_type: "Billing",
            //           },
            //           shippingDetails: {
            //             name:
            //               response?.data?.user?.firstName +
            //               " " +
            //               response?.data?.user?.lastName,
            //             phone_number: intlNumber,
            //             address_1: response?.data?.shipping?.addressLineOne,
            //             address_2: response?.data?.shipping?.addressLineTwo,
            //             city: response?.data?.shipping?.cityName,
            //             zip: response?.data?.shipping?.zip,
            //             state: response?.data?.shipping?.stateName,
            //             country: response?.data?.shipping?.countryName,
            //             address_type: "Shipping",
            //           },
            //         }),
            //       }
            //     )
            //     .then(async (response: any) => {
            //       updateStateHandler({
            //         payload: {
            //           cartSessionID: response?.data?.body?.sessionId,
            //         },
            //       });
            //     })
            //     .catch(function (error) {
            //       console.log(error);
            //     });
            // } catch (error: any) {
            //   console.log(error);
            // }
          }
          setOtpCode("");
          setError("Please enter valid OTP");
          Sentry.captureMessage("Invalid Code");
          Sentry.captureMessage("Something went wrong");
          setOnLoad(false);
        }
      }
    } catch (error: any) {
      // try {
      //   await axios
      //     .put(
      //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
      //       {
      //         userId: customerId,
      //         phoneNumber: intlNumber,
      //         sessionId: cartSessionID,
      //         json: JSON.stringify({
      //           sessionID: cartSessionID.toString(),
      //           date: new Date(),
      //           email: userEmail,
      //           abandonedStep: "OTP Page",
      //           emailStatus: "",
      //           recoveryStatus: "",
      //           totalAmount: (
      //             Number(totalAmount) +
      //             Number(shippingPrice) +
      //             Number(taxPrice) -
      //             Number(discountedAmount)
      //           ).toString(),
      //           currency: currency,
      //           orderItems: {
      //             product: productsObj,
      //             shippingAmount: shippingPrice,
      //             subTotal: (
      //               Number(totalAmount) - Number(discountedAmount)
      //             ).toString(),
      //           },
      //           orderDetails: [],
      //           billingDetails: [],
      //           shippingDetails: [],
      //         }),
      //       }
      //     )
      //     .then(async (response: any) => {
      //       updateStateHandler({
      //         payload: {
      //           cartSessionID: response?.data?.body?.sessionId,
      //         },
      //       });
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
      // } catch (error: any) {
      //   console.log(error);
      // }
      setOtpCode("");
      setError(error?.response?.data?.message ?? "Something went wrong.");
      Sentry.captureException(error);
      setOnLoad(false);
      Sentry.captureMessage("Something went wrong");
    }
  };

  /**
   * @description resend otp code
   * @param intlNumber
   */

  const [counter, setCounter] = useState(0);

  const resendOtpCodeHandler = async (intlNumber: string) => {
    (global as any).rudderanalytics?.track(
      "otp_resend_click",
      {},
      {
        time_stamp: time_stamp,
        user_id: customerId,
        mobileNumber: intlNumber,
        merchantId: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    setCounter((count) => count + 1);

    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    try {
      setOnLoad(true);
      const response = await otpService.sendOtp(
        {
          checkout_anonymous_id: checkout_anonymous_id,
          productTotalAmount: totalAmount,
          isEventsEnabled: isEventsEnabled,
          value: intlNumber,
          type: EOtpType.PHONE,
          segmentId: segmentId,
          resend: counter,
          checkoutUrl: checkout_url,
          rs_anonymous_id: rudderStackID,
          userID: customerId,
          haveUpdatedEmail: false,
        },
        {
          headers: {
            "identity-token": identityToken,
          },
        }
      );
      setError(
        response.success ? "" : response.message ? response.message : "Error!"
      );
      if (counter == 0) {
        (global as any).rudderanalytics?.track(
          "mobile_entered_success",
          {},
          {
            time_stamp: time_stamp,
            mobileNumber: intlNumber,
            merchantId: MerchantUserId,
            anonymousId: rudderStackID,
          }
        );
      }
      setOnLoad(false);
    } catch (error: any) {
      // setError(error?.response?.data?.message ?? "Something went wrong.");
      if (counter == 0) {
        (global as any).rudderanalytics?.track(
          "mobile_entered_fail",
          {},
          {
            time_stamp: time_stamp,
            mobileNumber: intlNumber,
            merchantId: MerchantUserId,
            anonymousId: rudderStackID,
            error: error?.response?.data?.message,
          }
        );
      } else {
        (global as any).rudderanalytics?.track(
          "otp_resend_fail",
          {},
          {
            time_stamp: time_stamp,
            mobileNumber: intlNumber,
            merchantId: MerchantUserId,
            anonymousId: rudderStackID,
          }
        );
      }
      setError(error.response.data.message ?? "Something went wrong");
      setOnLoad(false);
    }
  };

  /**
   * @description resend otp code timer and component
   * @param intlNumber
   */
  const MyTimerHandler = ({ expiryTimestamp }: any) => {
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
    } = useTimer({ expiryTimestamp, onExpire: () => setTimerClosed(true) });
    return (
      <>
        {!timerClosed ? (
          <p className="otp-text">
            <p className="base-color marginOnTimer"> {seconds}s</p>
          </p>
        ) : (
          <p
            className="base-color marginOnTimer"
            onClick={() => {
              const time = new Date();
              time.setSeconds(time.getSeconds() + 30);
              restart(time);
              setTimerClosed(false);
              resendOtpCodeHandler(intlNumber);
            }}
          >
            {" "}
            {is4gives ? <> Click Here</> : <>Yahan click karain</>}
          </p>
        )}
      </>
    );
  };

  return {
    states: { onLoad, otpCode, error },
    setStates: { setOnLoad, setOtpCode },
    handlers: { verifyOtpHandler, resendOtpCodeHandler, MyTimerHandler },
  };
};
