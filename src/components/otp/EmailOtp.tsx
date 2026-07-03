import React, { useContext, useEffect, useState } from "react";
import { Container, Col, ProgressBar } from "react-bootstrap";
import "react-intl-tel-input/dist/main.css";
import "../../styles/checkout.css";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import TextField from "@mui/material/TextField";
import OtpInput from "react-otp-input";
import { useEmailOtpHook } from "../../hooks/custom/useEmailOtp";
import { Dna } from "react-loader-spinner";
import { otpService } from "../../services/otp.service";
import { EOtpType } from "../../enums/otp-type.enum";

const EmailOtp: React.FC = () => {
  const {
    states: { onLoad, otpCode, error },
    setStates: { setOtpCode, setError, setOnLoad },
    handlers: { verifyOtpHandler, resendOtpCodeHandler, MyTimerHandler },
  } = useEmailOtpHook();
  const {
    state: {
      identityToken,
      checkout_url,
      rudderStackID,
      is4gives,
      totalAmount,
      isEventsEnabled,
      checkout_anonymous_id
    },
  } = useContext(CheckoutContext);
  const [nEmail, setNEmail] = useState<string>("");
  const [changeEmail, setChangeEmail] = useState<boolean>(false);
  const [updatedEmail, setUpdatedEmail] = useState<string>("");
  useEffect(() => {
    setError("");
  }, [changeEmail]);
  useEffect(() => {
    let newEmail: any = localStorage.getItem("JWTEmail");
    setNEmail(newEmail);
    resendOtpCodeHandler(
      newEmail && newEmail !== "null" ? newEmail : email ? email : ""
    );
    // resendOtpCodeHandler("shehzad.asadullah@qisstpay.com", 1);
  }, []);

  const {
    state: { email, customerId },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  useEffect(() => {
    setUpdatedEmail(email);
  }, [updatedEmail]);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 1); // 30 seconds timer

  /**
   * @description opt on change handler
   * * update the otp state
   * * hit verify otp api if otp code length is equal to 4
   * @param otp
   */
  const optCodeChangeHandler = (otp: string) => {
    setOtpCode(otp);
    if (otp.length == 4) {
      verifyOtpHandler(otp, email, (updatedContext: any) => {
        updateStateHandler({
          payload: {
            ...updatedContext,
          },
        });
      });
    }
  };
  const [counter, setCounter] = useState(1);

  const reSendEmailHandler = async () => {
    let segmentId = "12";
    setUpdatedEmail(email);
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    setCounter((count) => count + 1);

    if (email != updatedEmail) {
      try {
        setOnLoad(true);
        const response = await otpService.sendOtp(
          {
            checkout_anonymous_id:checkout_anonymous_id,
            productTotalAmount:totalAmount,
            isEventsEnabled: isEventsEnabled,
            value: email,
            type: EOtpType.EMAIL,
            segmentId: segmentId,
            resend: counter,
            checkoutUrl: checkout_url,
            rs_anonymous_id: rudderStackID,
            userID: customerId,
            haveUpdatedEmail: true,
          },
          {
            headers: {
              "identity-token": identityToken,
            },
          }
        );
        setOnLoad(false);
        setError(
          response.success
            ? ""
            : response.message
            ? response.message
            : "Validation Error"
        );
        setChangeEmail(false);
      } catch (error: any) {
        setError(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : "Unknown Error Found"
        );
        setOnLoad(false);
      }
    } else {
      setError("Enter new Email");
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

              <div className="otpBody">
                <div>
                  <h5 className="otpVerfication">
                    {is4gives ? <>OTP Verification</> : <>OTP ki tasdeeq</>}
                  </h5>
                  <p className=" enterOtpSentTo">
                    {is4gives ? (
                      <>
                        Enter the OTP sent to{" "}
                        <span
                          style={{ lineHeight: "26px" }}
                          className="color-111 font-bold"
                        >
                          {nEmail && nEmail !== "null"
                            ? nEmail
                            : email
                            ? email
                            : ""}{" "}
                          {/* {email ? email : ""} */}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          style={{ lineHeight: "26px" }}
                          className="color-111 font-bold"
                        >
                          {nEmail && nEmail !== "null"
                            ? nEmail
                            : email
                            ? email
                            : ""}{" "}
                          {/* {email ? email : ""} */}
                        </span>{" "}
                        email per bheja gya OTP darj karain
                      </>
                    )}
                    {!changeEmail ? (
                      <span
                        onClick={() => setChangeEmail(true)}
                        className="change-mail"
                      >
                        {is4gives ? (
                          <>Change email address?</>
                        ) : (
                          <>Email tabdeel karen</>
                        )}
                      </span>
                    ) : (
                      <span
                        onClick={() => setChangeEmail(false)}
                        className="change-mail"
                      >
                        {is4gives ? <>Enter OTP?</> : <>OTP darj karain?</>}
                      </span>
                    )}
                    {/* <img className="editIcon" onClick={props.changeNumber} src="assets/editIcon.svg" ></img> */}
                  </p>
                  {changeEmail ? (
                    <Col md={10} className="mt-10 mb-10">
                      <TextField
                        size="small"
                        className="single-input"
                        id="filled-basic"
                        label="Email"
                        variant="filled"
                        style={{ width: "100%" }}
                        type="text"
                        InputProps={{
                          className: "user-input-card-",
                        }}
                        name="email"
                        value={email}
                        onChange={(e) => {
                          updateStateHandler({
                            payload: {
                              email: e.target.value,
                            },
                          });
                        }}
                      />
                      <p
                        className="submit"
                        onClick={() => reSendEmailHandler()}
                      >
                        Submit
                      </p>
                    </Col>
                  ) : null}
                  {!changeEmail ? (
                    <Col lg={12} md={12} className="col-12 col-md-12">
                      <OtpInput
                        value={otpCode}
                        onChange={optCodeChangeHandler}
                        isInputNum
                        numInputs={4}
                        separator={<span> </span>}
                        inputStyle="Otp-Fields-New"
                        // containerStyle="otp-container"
                        shouldAutoFocus={true}
                      />
                    </Col>
                  ) : null}
                </div>
                {error != "" && (
                  <div className="w-100 mt-20 flex">
                    <img src="assets/error.svg" />
                    <p className="pl-10 error-msg">{error}</p>
                  </div>
                )}
                {!changeEmail ? (
                  <div className=" mt-10">
                    {error != "" ? null : (
                      <p className="otp-text">
                        {is4gives ? (
                          <>
                            Resend code{" "}
                            <MyTimerHandler expiryTimestamp={time} />{" "}
                          </>
                        ) : (
                          <>
                            Code dubara chahiye?
                            <MyTimerHandler expiryTimestamp={time} />
                          </>
                        )}
                      </p>
                    )}{" "}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
export default EmailOtp;
