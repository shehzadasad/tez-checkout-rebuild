import { useContext, useEffect, useState } from "react";
import { Container, Col } from "react-bootstrap";
import OtpInput from "react-otp-input";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { usePhoneOtpHook } from "../hooks/custom/usePoneOtp";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";
import ProgressBar from "../components/progressBar/ProgressBar";
import "../styles/checkout.css";
import "../styles/phoneScreen.css";
import Cart from "../components/cart/cart";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { GAMessages } from "../enums/GA-messages";
import Globalcart from "../components/cart/Globalcart";
import { Dna } from "react-loader-spinner";
import OtpPhone from "./OtpPhone";

const PhoneOtpPage: React.FC = () => {
  const {
    states: { onLoad, otpCode, error },
    setStates: { setOtpCode },
    handlers: { verifyOtpHandler, resendOtpCodeHandler, MyTimerHandler },
  } = usePhoneOtpHook();

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
      MerchantUserId,
      rudderStackID,
      customerId,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  useEffect(() => {
    // --- Google Analytics --- //
    if (GoogleAnalyticsCred?.type === "UA") {
      // console.log(
      //   "GoogleAnalyticsCred.tracking_id => ",
      //   GoogleAnalyticsCred?.tracking_id
      // );
      ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
      ReactGA.event({
        category: "Page",
        action: GAMessages.OTP_PAGE,
      });
    }

    if (GoogleAnalyticsCred?.type === "GA4") {
      // console.log(
      //   "GoogleAnalyticsCred.measurement_id => ",
      //   GoogleAnalyticsCred?.measurement_id
      // );
      ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
      ReactGA4.event({
        category: "Page",
        action: GAMessages.OTP_PAGE,
      });
    }
    // --- Google Analytics End --- //
  }, [GoogleAnalyticsCred]);

  const history = useHistory();
  const time = new Date();
  time.setSeconds(time.getSeconds() + 30); // 30 seconds timer

  useEffect(() => {
    // (global as any).analytics.page("Enter OTP ");
  }, []);
  // console.log(phoneNumberUrl, "#############################################");

  /**
   * @description opt on change handler
   * * update the otp state
   * * hit verify otp api if otp code length is equal to 4
   * @param otp
   */
  const optCodeChangeHandler = (otp: string) => {
    setOtpCode(otp);
    if (otp.length == 4) {
      verifyOtpHandler(
        otp,
        intlNumber,
        (updatedContext: any, redirectionUrl: string) => {
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

  // Hello

  useEffect(() => {
    // @ts-ignore:next-line
    // nid('stateChange', 'phone-otp');
  }, []);
  function handleBackArrow() {
    const currentUrl = window.location.href;
    // Check if the current URL includes "phone-otp"
    if (currentUrl.includes("phone-otp")) {
      (global as any).rudderanalytics?.track(
        "back_button_click_otp",
        {},
        {
          time_stamp: time_stamp,
          user_id: customerId,
          mobileNumber: intlNumber,
          merchantId: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
      // If yes, remove "phone-otp" from the URL and push the updated URL onto the history
      const updatedUrl = window.location.pathname.replace("phone-otp", "");
      history.push(updatedUrl);
      history.push(phoneNumberUrl);
      window.location.reload();
    } else {
      // If "phone-otp" is not present, push phoneNumberUrl onto the history
      history.push(phoneNumberUrl);
    }
  }
  return (
    <>
      <Container className="center-box">
        <div className="flex-box">
          <div className="checkout-container-otp bg-checkout relative">
            {onLoad && (
              <div className="loader-screen">
                <Dna
                  visible={onLoad}
                  wrapperStyle={{
                    textAlign: "center",
                    position: "absolute",
                    top: " 50%",
                    left: "35%",
                  }}
                  height={120}
                  width={120}
                  wrapperClass="dna-wrapper"
                />
              </div>
            )}
            <ProgressBar />
            <div className=" mt-40 otpBody">
              <div>
                <Box display="flex">
                  <ArrowBackIcon
                    sx={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => handleBackArrow()}
                  />

                  <h5 className="otpVerfication">
                    {is4gives ? <>OTP Verification</> : <>OTP ki tasdeeq</>}
                  </h5>
                </Box>

                <p className=" mb-40 enterOtpSentTo">
                  {is4gives ? (
                    <>
                      Enter the OTP sent to
                      <span
                        style={{ lineHeight: "26px" }}
                        className="color-111 font-bold"
                      >
                        {" "}
                        {phoneNumber}{" "}
                      </span>
                      {/* <img
                    className="editIcon"
                    onClick={() => history.replace(routes.phonePage)}
                    src="assets/editIcon.svg"
                  ></img> */}
                    </>
                  ) : (
                    <>
                      <span
                        style={{ lineHeight: "26px" }}
                        className="color-111 font-bold"
                      >
                        {" "}
                        {phoneNumber}{" "}
                      </span>{" "}
                      per bheja gya OTP shamil karain
                    </>
                  )}
                </p>

                <Col lg={12} md={12} className="col-12 col-md-12 mb-20">
                  <OtpPhone />
                </Col>
              </div>

              {error != "" && (
                <div className="w-100 mt-20 flex">
                  <img style={{ alignSelf: "center" }} src="assets/error.svg" />
                  <p className="pl-10 error-msg">{error}</p>
                </div>
              )}
              <div className="mb-20 mt-20">
                <p className="otp-text ResendCodetext">
                  {is4gives ? (
                    <>
                      Resend code <MyTimerHandler expiryTimestamp={time} />{" "}
                    </>
                  ) : (
                    <>
                      OTP code dubara bhejain{" "}
                      <MyTimerHandler expiryTimestamp={time} />
                    </>
                  )}
                </p>
              </div>
              <div>
                <button
                  disabled={
                    mall_ID &&
                    mall_ID !== null &&
                    globalCartObject.length === 0 &&
                    true
                  }
                  type="button"
                  className={
                    mall_ID && mall_ID !== null && globalCartObject.length === 0
                      ? "disable-btn"
                      : "basic-btn-new"
                  }
                  onClick={() => optCodeChangeHandler(otpCode)}
                >
                  {is4gives ? <>Submit</> : <>Agla Step</>}
                </button>
              </div>
              {/* {is4gives && <p className="poweredQP">Powered by Qisstpay</p>} */}
            </div>
          </div>
        </div>
      </Container>

      {/* mall make this uncomment */}

      {/* {mall_ID === "" ? (
        ""
      ) : mall_ID === null ? ( */}
      {/* <Cart
        countryCode={countryCode}
        currency={currency}
        taxPrice={taxPrice}
        vaultPoints={"0"}
        processingFee={""}
        shippingPrice={"0"}
        totalAmount={totalAmount}
        productsObj={productsObj}
        discountedAmount={discountedAmount}
      /> */}
      {/* ) : (
        <Globalcart show={""} />
      )} */}
    </>
  );
};

export default PhoneOtpPage;
