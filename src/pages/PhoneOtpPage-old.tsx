import { useContext, useEffect, useState } from "react";
import { Container, Col } from "react-bootstrap";
// import { TailSpin } from "react-loader-spinner";
import OtpInput from "react-otp-input";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { usePhoneOtpHook } from "../hooks/custom/usePoneOtp";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";

const PhoneOtpPage: React.FC = () => {
  const {
    states: { onLoad, otpCode, error },
    setStates: { setOtpCode },
    handlers: { verifyOtpHandler, resendOtpCodeHandler },
  } = usePhoneOtpHook();

  const {
    state: { intlNumber, phoneNumber },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const history = useHistory();

  useEffect(() => {
    // (global as any).analytics.page("Enter OTP ");
  }, []);

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
            },
          });
          history.push(redirectionUrl);
        }
      );
    }
  };

  return (
    <Container className="center-box">
      <h3 className="topHeading">Sign Up</h3>

      <div className="flex-box">
        <div className="checkout-container-otp bg-checkout relative">
          {onLoad && (
            <div className="loader-screen">
              {/* <TailSpin
                visible={onLoad}
                wrapperStyle={{
                  textAlign: "center",
                  position: "absolute",
                  top: " 50%",
                  left: "44%",
                }}
                color="#e93a7d"
                height={50}
                width={50}
              /> */}
            </div>
          )}
          <div className="logo-container">
            <img className="tezlogo" src="/assets/oneClick2x.png"></img>
          </div>
          <div className="input-container">
            <div className="input-number-group">
              <p className=" mb-40 ">
                We have sent you a text message to <br></br>
                <span
                  style={{ lineHeight: "26px" }}
                  className="color-111 font-bold"
                >
                  {" "}
                  {phoneNumber}{" "}
                </span>
              </p>

              <Col lg={12} md={12} className="col-12 col-md-12 mb-40">
                <OtpInput
                  value={otpCode}
                  onChange={optCodeChangeHandler}
                  isInputNum
                  numInputs={4}
                  separator={<span> </span>}
                  inputStyle="Otp-Fields"
                  containerStyle="otp-container"
                  shouldAutoFocus={true}
                />

                {error != "" && (
                  <div className="w-100 mt-20 flex">
                    <img src="assets/error.svg" />
                    <p className="pl-10 error-msg">{error}</p>
                  </div>
                )}
              </Col>

              <p
                style={{ alignItems: "center", display: "flex" }}
                className="otp-text"
              >
                Resend Code in
              </p>
              <p
                style={{ marginTop: "-20px" }}
                className="color-111 font-medium"
              >
                <CountdownCircleTimer
                  size={80}
                  strokeWidth={0}
                  isPlaying={true}
                  duration={30}
                  colors={["#E72E80", "#cc3300"]}
                  colorsTime={[30, 10]}
                >
                  {({ remainingTime }) =>
                    remainingTime != 0 ? (
                      remainingTime
                    ) : (
                      <a
                        className="base-color"
                        style={{ zIndex: "1000", cursor: "pointer" }}
                        onClick={() => resendOtpCodeHandler(intlNumber)}
                      >
                        Click here
                      </a>
                    )
                  }
                </CountdownCircleTimer>
              </p>
              <p
                onClick={() => history.replace(routes.phonePage)}
                className="otp-text base-color pointer"
              >
                Change Mobile Number
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PhoneOtpPage;
