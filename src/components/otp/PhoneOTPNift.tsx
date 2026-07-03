import React, { useContext, useEffect, useState } from "react";
import { Container, Col, ProgressBar } from "react-bootstrap";
import "react-intl-tel-input/dist/main.css";
import "../../styles/checkout.css";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";

import OtpInput from "react-otp-input";
import { useEmailOtpHook } from "../../hooks/custom/useEmailOtp";
import { Dna } from "react-loader-spinner";
import { orderService } from "../../services/order.service";
import { routes } from "../../router/routes";
import { useHistory } from "react-router-dom";

const PhoneOtp: React.FC = () => {
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const history = useHistory();

  const {
    state: { intlNumber, orderId, selectedBank, token, trackingId },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 30); // 30 seconds timer

  /**
   * @description opt on change handler
   * * update the otp state
   * * hit verify otp api if otp code length is equal to 4
   * @param otp
   */
  const optCodeChangeHandler = async (otp: string) => {
    try {
      setOtpCode(otp);
      if (otp.length == 6) {
        setOnLoad(true);
        const response = await orderService.verifyNiftOtpCode({
          order_id: orderId,
          otp: otp,
          gateway: "nift",
          bank_id: selectedBank,
        });
        setOnLoad(false);
        if (response.success) {
          history.push(
            `${routes.paymentSuccessPage}/?tracking_id=${trackingId}&token=${token}&order_id=${orderId}`
          );
        }
      }
    } catch (err: any) {
      console.log(err);
      setOnLoad(false);
      setError(err?.response?.data?.message ?? "Something went wrong.");
    }
  };

  return (
    <>
      <div>
        <Container className="center-box">
          <div className="flex-box">
            <div
              style={{ paddingBottom: "20px" }}
              className="checkout-container-otp bg-checkout relative"
            >
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

              <div className="  otpBody">
                <div>
                  <h5 className="otpVerfication">OTP Verification</h5>
                  <p className=" enterOtpSentTo">
                    Enter the OTP sent to mobile number linked to your bank
                    account
                    <span
                      style={{ lineHeight: "26px" }}
                      className="color-111 font-bold"
                    >
                      {" "}
                      {/* {intlNumber}{" "} */}
                    </span>
                    {/* <img className="editIcon" onClick={props.changeNumber} src="assets/editIcon.svg" ></img> */}
                  </p>
                  <Col lg={12} md={12} className="col-12 col-md-12">
                    <OtpInput
                      value={otpCode}
                      onChange={optCodeChangeHandler}
                      isInputNum
                      numInputs={6}
                      separator={<span> </span>}
                      inputStyle="Otp-Fields-New"
                      // containerStyle="otp-container"
                      shouldAutoFocus={true}
                    />
                  </Col>
                </div>
                {error != "" && (
                  <div className="w-100 mt-20 flex">
                    <img src="assets/error.svg" />
                    <p className="pl-10 error-msg">{error}</p>
                  </div>
                )}
                {/* <div className=" mt-20">
                  <p className="otp-text ">
                    Resend code <MyTimerHandler expiryTimestamp={time} />{" "}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
export default PhoneOtp;
