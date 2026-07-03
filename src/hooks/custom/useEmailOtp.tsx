import { useContext, useState } from "react";
import { otpService } from "../../services/otp.service";
import { useTimer } from "react-timer-hook";
import { EOtpType } from "../../enums/otp-type.enum";
import * as Sentry from "@sentry/react";
import { Context as CheckoutContext } from "../context/checkoutContext";

export const useEmailOtpHook = () => {
  const [error, setError] = useState<string>("");
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [timerClosed, setTimerClosed] = useState(false);

  const {
    state: {
      email,
      identityToken,
      customerId,
      checkout_url,
      rudderStackID,
      isEventsEnabled,
      is4gives,
      totalAmount,
      checkout_anonymous_id,
      MerchantUserId,
      user_type,
      intlNumber,
      time_stamp,
    },
  } = useContext(CheckoutContext);

  /**
   * @description hit verify email otp code
   * * redirect to payment selection screen if api response is true
   * @param otp
   * @param email
   * @param token
   * @param callBack
   */
  const verifyOtpHandler = async (
    otp: string,
    email: string,
    callBack: Function
  ) => {
    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    try {
      Sentry.captureMessage("Something went wrong");
      const re = /^[0-9]+$/;
      if (re.test(otp) || otp.length == 4) {
        setOnLoad(true);
        let newEmail: any = localStorage.getItem("JWTEmail");
        const response = await otpService.verifyOtpMail(
          {
            isEventsEnabled: isEventsEnabled,
            otp: otp,
            value:
              newEmail && newEmail !== "null" ? newEmail : email ? email : "",
            type: EOtpType.EMAIL,
            userId: customerId,
            segmentId: segmentId,
            checkoutUrl: checkout_url,
            signInRequestId: null,
            rs_anonymous_id: rudderStackID,
          },
          {
            headers: {
              "identity-token": identityToken,
            },
          }
        );
        if (response.success) {
          setTimeout(() => {
            setOnLoad(false);
            callBack({ emailValidated: true });
          }, 500);
        } else {
          setError("Invalid Code");
          setOnLoad(false);
        }
      }
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Something went wrong.");
      setOnLoad(false);
    }
  };

  /**
   * @description resend email otp code
   * @param token
   */
  const resendOtpCodeHandler = async (email: string) => {
    setCounter((count) => count + 1);
    (global as any).rudderanalytics?.track(
      "email_otp_resend_click",
      {},
      {
        time_stamp: time_stamp,
        entered_number: intlNumber,
        user_type: user_type,
        merchant_id: MerchantUserId,
        email: email,
        user_id: customerId,
        anonymousId: rudderStackID,
      }
    );
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
          value: email,
          type: EOtpType.EMAIL,
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
        response.success
          ? ""
          : response.message
          ? response.message
          : "Validation Error"
      );
      setOnLoad(false);
    } catch (error: any) {
      setError(error?.response?.data?.message);
      setOnLoad(false);
    }
  };

  /**
   * @description resend otp code timer and component
   * @param intlNumber
   */

  const [counter, setCounter] = useState(0);
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
              time.setSeconds(time.getSeconds() + 2);
              restart(time);
              setTimerClosed(false);
              let newEmail: any = localStorage.getItem("JWTEmail");
              resendOtpCodeHandler(newEmail ? newEmail : email ? email : "");
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
    states: { onLoad, error, otpCode },
    setStates: { setOtpCode, setError, setOnLoad },
    handlers: { resendOtpCodeHandler, verifyOtpHandler, MyTimerHandler },
  };
};
