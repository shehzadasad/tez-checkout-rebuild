import { useContext, useEffect } from "react";
import { Container, Col } from "react-bootstrap";
import { Dna } from "react-loader-spinner";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useEmailOtpHook } from "../hooks/custom/useEmailOtp";
import OtpInput from "react-otp-input";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";

const EmailOtpPage = () => {
  const {
    states: { error, onLoad, otpCode },
    setStates: { setOtpCode },
    handlers: { resendOtpCodeHandler, verifyOtpHandler },
  } = useEmailOtpHook();
  const {
    state: { email, token, isTez },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const history = useHistory();

  useEffect(() => {
    // (global as any).analytics.page("Enter Email OTP ");
  }, []);

  /**
   * @description update context state emailValidated to false
   * * redirect to user detail page
   */
  const changeEmailHandler = () => {
    updateStateHandler({
      payload: {
        emailValidated: false,
      },
    });
    history.replace(routes.userDetailPage);
  };

  /**
   * @description opt on change handler
   * * update the otp state
   * * hit verify otp api if otp code length is equal to 4
   * @param otp
   */
  const optCodeChangeHandler = (otp: string) => {
    setOtpCode(otp);
    if (otp.length == 4) {
      verifyOtpHandler(otp, email, () => {
        history.push(routes.paymentSelectionPage);
      });
    }
  };

  // useEffect(() => {
  //   // @ts-ignore:next-line
  //   // nid('stateChange', 'email-otp');
  // }, [])

  return (
    <Container className="center-box">
      <h3 className="topHeading">Sign Up</h3>

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
          {isTez != 0 ? (
            <div className="logo-container">
              <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
            </div>
          ) : (
            <div className="logo-container">
              <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
            </div>
          )}
          <div className="input-container">
            <div className="input-number-group">
              <p className="otp-text mb-40 ">
                We have sent you an email to <br></br>
                <span className="color-111 font-regular">
                  {" "}
                  {email}
                  {""}
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
                        onClick={() => resendOtpCodeHandler(token)}
                      >
                        Click here
                      </a>
                    )
                  }
                </CountdownCircleTimer>
              </p>
              <p
                onClick={changeEmailHandler}
                className="otp-text base-color pointer"
              >
                Change Email Address
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EmailOtpPage;
