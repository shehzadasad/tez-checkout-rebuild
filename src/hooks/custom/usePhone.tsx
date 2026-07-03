import { SetStateAction, useContext, useEffect, useState } from "react";
import { EOtpType } from "../../enums/otp-type.enum";
import { routes } from "../../router/routes";
import { otpService } from "../../services/otp.service";
import { Context as CheckoutContext } from "../context/checkoutContext";
// import { BitlyClient } from "bitly";
import { generalService } from "../../services/general.service";
import { recoveryService } from "../../services/recovery.service";
import { EEventName } from "../../enums/event-name.enum";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../enums/GA-messages";
import { useHistory, useLocation } from "react-router-dom";
import { checkBlockCitiesHelper } from "../../utils/check-block-cities.helper";
import { setUserData } from "../../helper/setUserData";
import * as Sentry from "@sentry/react";

import axios from "axios";
import { isEmpty } from "../../helper/isEmpty";
import { LocationDescriptor } from "history";

// const bitly = new BitlyClient("fbc387a5b2f4f5acb633189ca4ca6735d4f4d742", {});

export const usePhoneHook = () => {
  const {
    state: {
      abandonedCartCheck,
      token,
      signIn1cAuthStatus,
      SignInRequestId,
      intlNumber,
      customerId,
      isEventsEnabled,
      currency,
      checkout_url,
      identityToken,
      time_stamp,
      ipAddress,
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
      MerchantUserId,
      checkout_anonymous_id,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [phoneValidity, setPhoneValidity] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [limit, setLimit] = useState<string>("");
  const [limitNum, setLimitNum] = useState<number>(12);
  const [limitError, setLimitError] = useState<boolean>(true);
  const [limitSuccess, setLimitSuccess] = useState<string>("");
  const [showHelpUs, setShowHelpUs] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);
  const [shortURL, setShortURL] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const history = useHistory();

  /**
   * @description get the url and git cloudfront api to get the country code
   * * default country code will be 'pk'
   * @returns Promise<string>
   */
  const getCountryCodeHandler = async () => {
    // axios
    //   .get(
    //     `https://geolocation-db.com/json/67273a00-5c4b-11ed-9204-d161c2da74ce`
    //   )
    //   .then((response) => {
    //     console.log("THIS IS COUNTRY => ", response?.data?.country_code);
    //     updateStateHandler({
    //       payload: {
    //         countryCode: response?.data?.country_code
    //           ? response?.data?.country_code
    //           : "pk",
    //       },
    //     });
    //   })
    //   .catch((error) => {
    //     updateStateHandler({
    //       payload: {
    //         countryCode: "pk",
    //       },
    //     });
    //     console.log(error);
    //   });
    // const req = new XMLHttpRequest();
    // req.open("GET", document.location.href, false);
    // req.send(null);
    // const headers = req.getResponseHeader("CloudFront-Viewer-Country");
    // let countryCode = "pk"
    // console.log("Header: ", headers);
    // if (headers != null) {
    //   countryCode = headers != null ? headers.toString().toLowerCase() : "pk";
    // }
    // // let countryCode = (window as any).geoplugin_countryCode()
    // // console.log("Country Code: ", countryCode);
    // updateStateHandler({
    //   payload: {
    //     countryCode: countryCode,
    //   },
    // });
  };
  const locationn = useLocation();
  const searh = locationn.search; // could be '?foo=bar'
  const param = new URLSearchParams(searh);
  let queryurl: any = param.get("identity-token");
  let decodedURLL: any = window.atob(queryurl);
  let conditionalIdentityToken = decodedURLL.includes("mall.qisstpay");
  useEffect(() => {
    if (mall_ID && mall_ID !== null && globalCartObject.length === 0) {
      setError("Cart is empty. Can't proceed further - Please close checkout!");
    } else {
      setError("");
    }
  }, [globalCartObject]);

  /**
   * @description validation number and intlNumber and update state
   * @param valid
   * @param number
   * @param numberIntl
   */
  const updatePhoneNumberHandler = (
    valid: boolean,
    number: string,
    numberIntl: string,
    countryData: any
  ) => {
    // const regex = /^[\+]?[(]?[0-9]{}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    // regex.test(number);
    // console.log(number);
    // if (number.length == 12 || number.length == 10) {
    //   // setPhoneValidity(false);
    //   setLimitSuccess("");
    //   setLimit("");
    // } else if (number.length < 11) {
    //   setLimitSuccess("Keep Going");
    // } else if (number.length == 11 || number.length > 10) {
    //   setLimit("Please Correct your phone number");
    // } else if (number.length > 12) {
    // }

    const re = /^(?=.*[0-9])[- +()0-9]+$/;

    // const reg = /^\+\d{12}$/;

    if (number === "" || re.test(number)) {
      updateStateHandler({
        payload: { phoneNumber: number, countryCode: countryData.iso2 },
      });
    }
    if (numberIntl != "") {
      var newStr = numberIntl.replace(/-/g, "");
      var noSP = newStr.replace(/\s/g, "");
      updateStateHandler({
        payload: { intlNumber: noSP, countryCode: countryData.iso2 },
      });
    }
  };

  /**
   *@description close the help us modal
   */
  const closeHelpUsModalHandler = () => {
    setShowHelpUs(false);
  };

  /**
   * @description show the help us modal
   */
  const showHelpUsModalHandler = () => {
    setShowHelpUs(true);
    if (MerchantUserId != 0) {
      (global as any).rudderanalytics?.track(
        "how_it_works_clicked",
        {},
        {
          time_stamp: time_stamp,
          checkout_url: checkout_url,
          anonymousId: conditionalIdentityToken
            ? (global as any).rudderanalytics.getAnonymousId()
            : rudderStackID,
          MerchantUserId: MerchantUserId,
        }
      );
    }
  };

  const location = useLocation();
  /**
   * @description after validation check update the state and skip verification screen and redirect on signup
   */
  const guestCheckoutHandler = async () => {
    // const search = location.search;
    // const params = new URLSearchParams(search);
    // const sessionId: any = params.get("sessionId");
    // console.log("sessionIdsessionId", sessionId);
    // (global as any).rudderanalytics?.track(
    //   "Guest Checkout",
    //   {},
    //   {
    //     anonymousId: rudderStackID,
    //   }
    // );
    // if (!acceptTerms) {
    //   setError("Please Accept Terms & Condition to Continue!");
    //   setOnLoad(false);
    // } else {
    //   updateStateHandler({
    //     payload: {
    //       isGuest: true,
    //     },
    //   });
    //   // if (abandonedCartCheck === false) {
    //   //   if (sessionId === null || sessionId === "") {
    //   //     try {
    //   //       axios
    //   //         .post(
    //   //           `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/initiate`,
    //   //           {
    //   //             userId: null,
    //   //             phoneNumber: intlNumber ? intlNumber : null,
    //   //             checkoutUrl: window.location.href,
    //   //           },
    //   //           {
    //   //             headers: {
    //   //               "identity-token": identityToken,
    //   //             },
    //   //           }
    //   //         )
    //   //         .then((response: any) => {
    //   //           // if (sessionId) {
    //   //           //   console.log("sessionId, sessionId => ", sessionId)
    //   //           //   updateStateHandler({
    //   //           //     payload: {
    //   //           //       cartSessionID: sessionId
    //   //           //     },
    //   //           //   });
    //   //           // } else {
    //   //           updateStateHandler({
    //   //             payload: {
    //   //               abandonedCartCheck: true,
    //   //               cartSessionID: response?.data?.body?.sessionId,
    //   //             },
    //   //           });
    //   //           // }
    //   //           // console.log(response?.data?.body?.sessionId, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    //   //         })
    //   //         .catch(function (error) {
    //   //           console.log(error);
    //   //         });
    //   //     } catch (error: any) {
    //   //       console.log(error);
    //   //     }
    //   //   } else {
    //   //     // try {
    //   //     //   await axios
    //   //     //     .put(
    //   //     //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
    //   //     //       {
    //   //     //         userId: "",
    //   //     //         phoneNumber: intlNumber,
    //   //     //         sessionId: sessionId,
    //   //     //         json: JSON.stringify({
    //   //     //           recoveryStatus: "CHECKOUT_STARTED",
    //   //     //         }),
    //   //     //       }
    //   //     //     )
    //   //     //     .then(async (response: any) => {
    //   //     //       console.log("UPDATE RESPONSE: ", response);
    //   //     //       updateStateHandler({
    //   //     //         payload: {
    //   //     //           newSessionID: response?.data?.body?.sessionId,
    //   //     //           abandonedCartCheck: true,
    //   //     //           cartSessionID: response?.data?.body?.sessionId,
    //   //     //         },
    //   //     //       });
    //   //     //     })
    //   //     //     .catch(function (error) {
    //   //     //       console.log(error);
    //   //     //     });
    //   //     // } catch (error: any) {
    //   //     //   console.log(error);
    //   //     // }
    //   //   }
    //   // }
    //   history.push(routes.userDetailPage);
    // }
  };

  /**
   * @description Submit Number on Enter Key
   */
  const handleKeyPressHandler = (event: any) => {
    if (event.key === "Enter") {
      // console.log("enter press here! ");
      VerifyUser();
    }
  };

  /**
   * @description
   * * check phone validity
   * * hit api to send otp on phone number
   * @param intlNumber
   * @param token
   */
  const sendOtpHandler = async () => {
    const search = location.search;
    const params = new URLSearchParams(search);
    const sessionId = params.get("sessionId");
    // console.log("sessionIdsessionId", sessionId);

    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    try {
      setOnLoad(true);
      if (!phoneValidity) {
        setError("Number is not valid");
        setOnLoad(false);
      } else if (!acceptTerms) {
        setError("Please Accept Terms & Condition to Continue!");
        setOnLoad(false);
      } else {
        const response = await otpService.sendOtp(
          {
            checkout_anonymous_id: checkout_anonymous_id,
            productTotalAmount: totalAmount,
            isEventsEnabled: isEventsEnabled,
            value: intlNumber,
            type: EOtpType.PHONE,
            segmentId: segmentId,
            resend: 0,
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

        if (response.success) {
          verifyOtpHandler(
            "",
            intlNumber,
            (updatedContext: any, redirectionUrl: string) => {
              updateStateHandler({
                payload: {
                  ...updatedContext,
                  // isGuest: false,
                },
              });
              history.push(redirectionUrl);
            },
            SignInRequestId
          );
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
          // --- Google Analytics --- //
          if (GoogleAnalyticsCred?.type === "UA") {
            // console.log(
            //   "GoogleAnalyticsCred.tracking_id => ",
            //   GoogleAnalyticsCred?.tracking_id
            // );
            ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
            ReactGA.event({
              category: "Event",
              action: GAMessages.OTP_SENT_SUCCESSFULLY,
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
              action: GAMessages.OTP_SENT_SUCCESSFULLY,
            });
          }
          // --- Google Analytics End --- //
          setTimeout(async () => {
            // if (abandonedCartCheck === false) {
            //   if (sessionId === null || sessionId === "") {
            //     try {
            //       axios
            //         .post(
            //           `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/initiate`,
            //           {
            //             userId: null,
            //             phoneNumber: intlNumber ? intlNumber : null,
            //             checkoutUrl: window.location.href,
            //           },
            //           {
            //             headers: {
            //               "identity-token": identityToken,
            //             },
            //           }
            //         )
            //         .then((response: any) => {
            //           // if (sessionId) {
            //           //   console.log("sessionId, sessionId => ", sessionId)
            //           //   updateStateHandler({
            //           //     payload: {
            //           //       cartSessionID: sessionId
            //           //     },
            //           //   });
            //           // } else {
            //           updateStateHandler({
            //             payload: {
            //               abandonedCartCheck: true,
            //               cartSessionID: response?.data?.body?.sessionId,
            //             },
            //           });
            //           // }
            //           // console.log(response?.data?.body?.sessionId, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            //         })
            //         .catch(function (error) {
            //           console.log(error);
            //         });
            //     } catch (error: any) {
            //       console.log(error);
            //     }
            //   } else {
            //     // try {
            //     //   await axios
            //     //     .put(
            //     //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
            //     //       {
            //     //         userId: "",
            //     //         phoneNumber: intlNumber,
            //     //         sessionId: sessionId,
            //     //         json: JSON.stringify({
            //     //           recoveryStatus: "CHECKOUT_STARTED",
            //     //         }),
            //     //       }
            //     //     )
            //     //     .then(async (response: any) => {
            //     //       console.log("UPDATE RESPONSE: ", response);
            //     //       updateStateHandler({
            //     //         payload: {
            //     //           newSessionID: response?.data?.body?.sessionId,
            //     //           abandonedCartCheck: true,
            //     //           cartSessionID: response?.data?.body?.sessionId,
            //     //         },
            //     //       });
            //     //     })
            //     //     .catch(function (error) {
            //     //       console.log(error);
            //     //     });
            //     // } catch (error: any) {
            //     //   console.log(error);
            //     // }
            //   }
            // }

            setError("");
            setOnLoad(false);

            // updateStateHandler({
            //   payload: {
            //     countryId: response.data.data.country_id,
            //   },
            // });
            // history.push(routes.phoneOtpPage);
          }, 1000);
        } else {
          // if (abandonedCartCheck === false) {
          //   if (sessionId === null || sessionId === "") {
          //     try {
          //       axios
          //         .post(
          //           `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/initiate`,
          //           {
          //             userId: null,
          //             phoneNumber: intlNumber ? intlNumber : null,
          //             checkoutUrl: window.location.href,
          //           },
          //           {
          //             headers: {
          //               "identity-token": identityToken,
          //             },
          //           }
          //         )
          //         .then((response: any) => {
          //           // if (sessionId) {
          //           //   console.log("sessionId, sessionId => ", sessionId)
          //           //   updateStateHandler({
          //           //     payload: {
          //           //       cartSessionID: sessionId
          //           //     },
          //           //   });
          //           // } else {
          //           updateStateHandler({
          //             payload: {
          //               abandonedCartCheck: true,
          //               cartSessionID: response?.data?.body?.sessionId,
          //             },
          //           });
          //           // }
          //           // console.log(response?.data?.body?.sessionId, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          //         })
          //         .catch(function (error) {
          //           console.log(error);
          //         });
          //     } catch (error: any) {
          //       console.log(error);
          //     }
          //   } else {
          //     // try {
          //     //   await axios
          //     //     .put(
          //     //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
          //     //       {
          //     //         userId: "",
          //     //         phoneNumber: intlNumber,
          //     //         sessionId: sessionId,
          //     //         json: JSON.stringify({
          //     //           recoveryStatus: "CHECKOUT_STARTED",
          //     //         }),
          //     //       }
          //     //     )
          //     //     .then(async (response: any) => {
          //     //       console.log("UPDATE RESPONSE: ", response);
          //     //       updateStateHandler({
          //     //         payload: {
          //     //           newSessionID: response?.data?.body?.sessionId,
          //     //           abandonedCartCheck: true,
          //     //           cartSessionID: response?.data?.body?.sessionId,
          //     //         },
          //     //       });
          //     //     })
          //     //     .catch(function (error) {
          //     //       console.log(error);
          //     //     });
          //     // } catch (error: any) {
          //     //   console.log(error);
          //     // }
          //   }
          // }
          setOnLoad(false);
          setError(
            response.message && response.message === "Invalid Phone Number"
              ? "This service is not allowed in your region."
              : response.message
              ? response.message
              : "Validation Error"
          );
        }
        // console.log(response.message);
      }
    } catch (error: any) {
      setOnLoad(false);
      setError(error?.response?.data?.message);
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
      //setError("something went wrong");
    }
  };

  const generateSignInRequestId = async (id: any = null) => {
    setTimeLeft(30);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      user_id: id !== null ? id : customerId,
      signIn_request_id: SignInRequestId,
      status: "PENDING",
    });

    fetch(
      `${process.env.REACT_APP_AUTHENTICATION_MS_API_KEY}/generate/sign-in`,
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log("PUSH NOTIFICATION => ", result);
        if (result.status) {
          setOnLoad(false);
          updateStateHandler({
            payload: {
              SignInRequestId: result.sign_in_request_id,
              signIn1cAuthStatus: result.status,
            },
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const [otpCode, setOtpCode] = useState<string>("");
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
    console.log("verifyOtpHandler CALLED!");
    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    try {
      Sentry.captureMessage("Something went wrong");
      const re = /^[0-9]+$/;
      setOnLoad(true);
      const response = await otpService.verifyOtp(
        {
          isEventsEnabled: isEventsEnabled,
          otp: "0000",
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
            user_type: response?.data?.isExistingUser == true ? 1 : 2,
          },
        });
        console.log(
          response?.data?.isExistingUser,
          "response.data.isEventsEnabled",
          response?.data?.isExistingUser == true ? 1 : 2
        );

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
          checkBlockCitiesHelper(identityToken, response.data.billing.cityName)
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
   * @description
   * * check phone validity
   * * hit api to send otp on phone number
   * @param intlNumber
   * @param token
   */

  const calculateLoadingTimeo = () => {
    const entries = performance.getEntriesByType("navigation");
    if (entries.length > 0) {
      const navigationEntry = entries[0];
      return navigationEntry.duration / 1000; // Convert milliseconds to seconds
    }
    return 0;
  };

  const VerifyUser = async () => {
    // fetch(`${process.env.REACT_APP_AUTHENTICATION_MS_API_KEY}/sendotp`, {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log("VERIFY USER => ", result);
    //     if (result.email) {
    //       updateStateHandler({
    //         payload: {
    //           customerId: result.userId,
    //         },
    //       });
    //       sendOtpHandler();
    //       // if (result.isDeviceRegistered === true) {
    //       //   generateSignInRequestId(result.userId);
    //       // } else {
    //       //   sendOtpHandler();
    //       // }
    //     } else {
    sendOtpHandler();
    // }
  };
  // )
  //     .catch((error) => console.log("error", error));
  // };

  const bityCall = async (checkout_url_: string) => {
    // console.log(checkout_url_);
    // const response = await recoveryService.urlShortner({
    //   url: checkout_url_,
    // });
    // updateStateHandler({
    //   payload: {
    //     checkout_url:
    //       "https://ms.tezcheckout.qisstpay.com/redirect?id=" + response.data,
    //     shorten_url:
    //       "https://ms.tezcheckout.qisstpay.com/redirect?id=" + response.data,
    //   },
    // });
    // console.log(response.data);
  };

  const getLinkUrl = async (id: any) => {
    const response = await recoveryService.getLink({
      id: id,
    });

    window.location.href = response.data.url;
    // console.log(response.data);
  };

  // const intiateSegmentHandler = async (url: string) => {
  //   let segmentId = "12";
  //   if (typeof (global as any)?.rudderanalytics?.user == "function") {
  //     segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
  //   }
  //   // console.log("use phone");
  //   generalService.createSegmentEvent(
  //     EEventName.CHECKOUT_STARTED,
  //     {
  //       ip_address: ipAddress,
  //       checkout_url: url,
  //       checkout_type: "1-Click",
  //       affiliation: "",
  //       subtotal: Number(totalAmount),
  //       total: Number(totalAmount) + Number(shippingPrice) + Number(taxPrice),
  //       revenue: 0,
  //       shipping: Number(shippingPrice) ?? 0,
  //       tax: Number(taxPrice) ?? 0,
  //       discount: 0,
  //       coupon: "",
  //       currency: currency,
  //       country: "Pakistan",
  //       locale: "EN",
  //       product: productsObj.map((product: any) => {
  //         return {
  //           sku: product.src,
  //           category: null,
  //           name: product.title,
  //           brand: "NA",
  //           variant: "NA",
  //           price: Number(product.price),
  //           quantity: Number(product.quantity),
  //           coupon: null,
  //         };
  //       }),

  //       segment_id: segmentId,
  //     },
  //     {
  //       headers: {
  //         "identity-token": identityToken!,
  //       },
  //     }
  //   );
  // };

  return {
    states: {
      onLoad,
      showHelpUs,
      phoneValidity,
      error,
      acceptTerms,
      shortURL,
      limit,
      limitError,
      limitSuccess,
      timeLeft,
    },
    setStates: {
      setOnLoad,
      setError,
      setPhoneValidity,
      setAcceptTerms,
      setLimit,
      setLimitError,
      setLimitSuccess,
      setTimeLeft,
    },
    handlers: {
      getCountryCodeHandler,
      generateSignInRequestId,
      closeHelpUsModalHandler,
      showHelpUsModalHandler,
      sendOtpHandler,
      updatePhoneNumberHandler,
      guestCheckoutHandler,
      handleKeyPressHandler,
      bityCall,
      getLinkUrl,
      VerifyUser,
      verifyOtpHandler,
    },
  };
};

