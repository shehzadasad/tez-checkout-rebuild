import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Row, Col, Form } from "react-bootstrap";
import { lazyLoad } from "../../utils/loadable";
import "../../styles/checkout.css";
import {
  CreditCardInput,
  SquarePaymentsForm,
} from "react-square-web-payments-sdk";
import * as Square from "@square/web-sdk";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import { routes } from "../../router/routes";
import { useHistory } from "react-router-dom";
import EmailOtp from "../otp/EmailOtp";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../enums/GA-messages";
import SkyFlowElements from "./SkyFlowElements";

const CardDetail = lazyLoad(() => import("./CardDetailComponent"));

interface IProps {
  qisstPaySelectionHandler: Function;
  loadQisstPay: boolean;
  loadQisstPayInSix: boolean;
  loadQisstPayInSixCC: boolean;
  loadQisstPayInThree: boolean;
  loadQisstPayInTwo: boolean;
  loadQisstPayInThreeCC: boolean;
  loadQisstPayInFourCC: boolean;
  encrypted: any;
  setNumber: Function;
  setCvc: Function;
  setName: Function;
  setExpiry: Function;
  setExpiryValidated: Function;
  setAcceptTerms: Function;
  onClickViewPaymentPlan: Function;
  halfAmountToPay: string | number;
  processingFee: string | number;
  payIn3Amount: string | number;
  prodPrice: string | number;
  method: any;
  packageSelected: string;
  merchantLogo: any;
  merchantBusinessName: any;
  paymentLimitError: boolean;
  loadQisstPayInTwelveCC: boolean;
  is4gives: boolean;
  prodsObj: any;
  setCardSelect: any;
  toggleVault: boolean;
  cardSelect: any;
}

const QisstpayMethodCard: React.FC<IProps> = (props: IProps) => {
  const {
    state: {
      currency,
      emailValidated,
      shippingPrice,
      taxPrice,
      isGuest,
      walletBalance,
      discountedAmount,
      merchantWalletIsEnabled,
      time_stamp,
      GoogleAnalyticsCred,
      is4gives,
      rudderStackID,
      customerId,
      MerchantUserId,
      user_type,
    },
  } = useContext(CheckoutContext);
  const history = useHistory();
  const planClicked = () => {
    (global as any).rudderanalytics?.track(
      "installment_plan_click",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    history.replace(routes.paymentDetailPage);
  };

  let payIn3Divide;
  useEffect(() => {
    let totalAm = props.payIn3Amount;
    // console.log(
    //   "=================================== EMAIL VERIFIED: ",
    //   emailValidated
    // );
    // console.log(
    //   "=================================== METHOD SELECTED: ",
    //   props.packageSelected
    // );
  }, [props.packageSelected]);

  let divisor =
    (Number(props.prodPrice) +
      Number(shippingPrice) +
      Number(taxPrice) +
      Number(props.processingFee) -
      Number(discountedAmount)) /
    Number(props.halfAmountToPay);

  let vaultSub = walletBalance / divisor;
  useEffect(() => {
    (global as any).rudderanalytics?.track(
      `payment_method_select`,
      {},
      {
        time_stamp: time_stamp,
        method: props.method.package.package_name,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
  }, [props.method.package.package_name]);
  return (
    <div className="pointer">
      <hr style={{ margin: 0 }} />

      <div className="drop-container-2">
        <div
          onClick={(e) => {
            props.qisstPaySelectionHandler(props.method.package.package_name);

            // --- Google Analytics --- //
            if (GoogleAnalyticsCred?.type === "UA") {
              // console.log(
              //   "GoogleAnalyticsCred.tracking_id => ",
              //   GoogleAnalyticsCred?.tracking_id
              // );
              ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
              ReactGA.event({
                category: "Button",
                action: GAMessages.GATEWAY_SELECTED,
              });
            }

            if (GoogleAnalyticsCred?.type === "GA4") {
              // console.log(
              //   "GoogleAnalyticsCred.measurement_id => ",
              //   GoogleAnalyticsCred?.measurement_id
              // );
              ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
              ReactGA4.event({
                category: "Button",
                action: GAMessages.GATEWAY_SELECTED,
              });
            }
            // --- Google Analytics End --- //
          }}
          className=" flex align-center"
        >
          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_4" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPay
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_4" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_2" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInTwo
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_2" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_3" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInThree
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_3" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_3_CC" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInThreeCC
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_3_CC" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_6" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInSix
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_6" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_6_CC" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInSixCC
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_6_CC" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_4_CC" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInFourCC
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_4_CC" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}

          {!props.paymentLimitError ? (
            <>
              {props.method.package.package_name == "PAY_IN_12_CC" && (
                <img
                  className="mr-20"
                  src={
                    !props.loadQisstPayInTwelveCC
                      ? "/assets/unchecked.png"
                      : "/assets/filled.png"
                  }
                ></img>
              )}
            </>
          ) : (
            <>
              {props.method.package.package_name == "PAY_IN_12_CC" && (
                <img className="mr-20" src={""}></img>
              )}
            </>
          )}
          <div className="drop-heading-container w-100">
            <p className="text-18 font-medium text-start">
              {" "}
              {!props.is4gives && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    // className={`test ${props.method.package.package_name == "PAY_IN_12_CC"
                    //   ? "width-50-percent"
                    //   : ""
                    //   }`}
                    className={`test`}
                    width={
                      props.merchantLogo &&
                      props.method.package.package_name == "PAY_IN_12_CC"
                        ? "228pt"
                        : ""
                    }
                    height={
                      props.merchantLogo &&
                      props.method.package.package_name == "PAY_IN_3"
                        ? "30pt"
                        : props.method.package.package_name == "PAY_IN_2"
                        ? "35pt"
                        : props.method.package.package_name == "PAY_IN_12_CC" ||
                          props.method.package.package_name == "PAY_IN_4_CC"
                        ? "30pt"
                        : ""
                    }
                    src={
                      props.method.package.package_name == "PAY_IN_4"
                        ? "/assets/qpTag.svg"
                        : props.method.package.package_name == "PAY_IN_2"
                        ? "/assets/Pay in 2.svg"
                        : props.method.package.package_name == "PAY_IN_4_CC"
                        ? "/assets/payin4cc.png"
                        : props.method.package.package_name == "PAY_IN_6" ||
                          props.method.package.package_name == "PAY_IN_6_CC"
                        ? "/assets/split.svg"
                        : props.method.package.package_name == "PAY_IN_3"
                        ? props.merchantLogo
                          ? props.merchantLogo
                          : "/assets/pay-in-3.svg"
                        : "/assets/qpTag01.svg"
                    }
                    alt="img"
                  ></img>

                  {props.method.package.package_name === "PAY_IN_3" &&
                    props.merchantLogo && (
                      <div
                        style={{
                          padding: "0pt 14pt",
                          border: "0.9px solid black",
                          borderRadius: "50px",
                          marginLeft: "20pt",
                        }}
                      >
                        <small style={{ fontSize: "13.5px" }}>PAY IN 3</small>
                      </div>
                    )}

                  {/* {props.method.package.package_name === "PAY_IN_2" && (
                    <>
                      <div
                        style={{
                          padding: "0pt 14pt",
                          border: "0.9px solid black",
                          borderRadius: "50px",
                          marginLeft: "20pt",
                        }}
                      >
                        <small style={{ fontSize: "13.5px" }}>PAY IN 2</small>
                      </div>
                    </>
                  )} */}
                </div>
              )}
              {props.is4gives && (
                <img
                  height="35pt"
                  src={
                    props.method.package.package_name === "PAY_IN_2" ||
                    props.method.package.package_name === "PAY_IN_2_CC"
                      ? "/assets/splitmo_pay_in_2.svg"
                      : props.method.package.package_name === "PAY_IN_4" ||
                        props.method.package.package_name === "PAY_IN_4_CC"
                      ? "/assets/splitmo_pay_in_4.svg"
                      : props.method.package.package_name === "PAY_IN_6" ||
                        props.method.package.package_name === "PAY_IN_6_CC"
                      ? "/assets/splitmo_pay_in_6.svg"
                      : ""
                  }
                  alt="img"
                ></img>
              )}
            </p>

            <img style={{ marginLeft: "5px" }} src="/assets/arrowD.png"></img>
          </div>
        </div>
        {props.packageSelected === props.method.package.package_name &&
          emailValidated === true && (
            <>
              <div className=" flex-price mt-30">
                <p
                  style={{ paddingTop: 2, fontSize: "14px" }}
                  className="order-text"
                >
                  (
                  {currency != null
                    ? currency + " "
                    : props.encrypted.currency + " "}
                  {props.method.package.package_name == "PAY_IN_3"
                    ? (
                        (Number(props.prodPrice) +
                          Number(shippingPrice) +
                          Number(taxPrice) +
                          Number(props.processingFee) -
                          Number(discountedAmount) -
                          (props.toggleVault === true
                            ? Number(walletBalance)
                            : 0)) /
                        3
                      ).toFixed(2)
                    : props.method.package.package_name == "PAY_IN_2"
                    ? (
                        (Number(props.prodPrice) +
                          Number(shippingPrice) +
                          Number(taxPrice) +
                          Number(props.processingFee) -
                          Number(discountedAmount) -
                          (props.toggleVault === true
                            ? Number(walletBalance)
                            : 0)) /
                        2
                      ).toFixed(2)
                    : Number(props.halfAmountToPay) -
                      (props.toggleVault === true ? Number(vaultSub) : 0)}
                  /Month)
                </p>
                {props.packageSelected === "PAY_IN_3" ? (
                  <p
                    style={{ paddingTop: 2, fontSize: "14px" }}
                    className="order-text"
                  >
                    Platform Fee: (
                    {currency != null ? currency : props.encrypted.currency}{" "}
                    {Number(props.processingFee).toFixed(2)})
                  </p>
                ) : (
                  ""
                )}
                {props.packageSelected === "PAY_IN_2" ? (
                  <p
                    style={{ paddingTop: 2, fontSize: "14px" }}
                    className="order-text"
                  >
                    Platform Fee: (
                    {currency != null ? currency : props.encrypted.currency}{" "}
                    {Number(props.processingFee).toFixed(2)})
                  </p>
                ) : (
                  ""
                )}

                <a
                  className="base-color font-medium"
                  style={{
                    zIndex: "1000",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() =>
                    // (e) => props.onClickViewPaymentPlan()
                    planClicked()
                  }
                >
                  {is4gives ? (
                    <>View Complete Payment Plan</>
                  ) : (
                    <>Mukammal payment plan jaaniye</>
                  )}
                </a>
              </div>

              <div className=" flex-price mt-30">
                {props.method.package.package_name == "PAY_IN_4" && (
                  <p className="text-16 font-medium text-start">
                    Add Debit/Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_6" && (
                  <p className="text-16 font-medium text-start">
                    Add Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_6_CC" && (
                  <p className="text-16 font-medium text-start">
                    Add Debit/Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_4_CC" && (
                  <p className="text-16 font-medium text-start">
                    Add Debit/Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_3" && (
                  <p className="text-16 font-medium text-start">
                    Add Debit/Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_2" && (
                  <p className="text-16 font-medium text-start">
                    {is4gives ? (
                      <>Add Debit/Credit Card</>
                    ) : (
                      <>Apna debit/credit card no darj karain</>
                    )}
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_3" && (
                  <p className="text-16 font-medium text-start">
                    Add Debit/Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_3_CC" && (
                  <p className="text-16 font-medium text-start">
                    Add Debit/Credit Card
                  </p>
                )}
                {props.method.package.package_name == "PAY_IN_12_CC" && (
                  <p className="text-16 font-medium text-start">
                    Add Credit Card
                  </p>
                )}

                <img src="/assets/visaMaster.png"></img>
              </div>
              <p className="sm-text-grey font-regular mt-05">
                {is4gives ? (
                  <>Activate your card for online transactions.</>
                ) : (
                  <>
                    Ye yaqeeni bana lein k aap k card per online transactions
                    active hain
                  </>
                )}
              </p>
              <p className="encrypted-text">
                Your card information is encrypted and protected, and we never
                store your full details. Plus, the OTP verification from your
                bank ensures an extra layer of security for every purchase. Shop
                now with confidence!
                <span>
                  <svg
                    width="15"
                    height="18"
                    viewBox="0 0 15 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="15" height="18" fill="url(#pattern0)" />
                    <defs>
                      <pattern
                        id="pattern0"
                        patternContentUnits="objectBoundingBox"
                        width="1"
                        height="1"
                      >
                        <use
                          href="#image0_1228_1863"
                          transform="matrix(0.00235722 0 0 0.00195312 -0.103448 0)"
                        />
                      </pattern>
                      <image
                        id="image0_1228_1863"
                        width="512"
                        height="512"
                        href="data:image/png;base64,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"
                      />
                    </defs>
                  </svg>
                </span>
              </p>
              {props.method.package.package_name == "PAY_IN_12_CC" && (
                <p className="sm-text-grey font-regular mt-05">
                  The first installment amount will be captured and the
                  remaining installment amount will be put on hold.
                </p>
              )}

              {/* {isGuest === true ?  */}
              <CardDetail
                setNumber={props.setNumber}
                setCvc={props.setCvc}
                setName={props.setName}
                setExpiry={props.setExpiry}
                encrypted={props.encrypted}
                setExpiryValidated={props.setExpiryValidated}
              />
              {/* : <SkyFlowElements />} */}

              {/* <div className="flex mt-10" style={{alignItems:"end"}}>
                <Form.Check
                  defaultChecked
                  className="text-16 font-regular"
                  id={`inline-${"radio"}-2`}
                  onChange={(e) => props.setAcceptTerms(e.target.checked)}
                />
                <p className="flex gap-1">
                  I agree to QisstPay{" "}
                  <a
                    href="https://www.qisstpay.com/terms-conditions"
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                  >
                    Terms & Conditions
                  </a>{" "}
                  and
                  <a
                    href="https://www.qisstpay.com/privacy-policy"
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                  >
                    {" "}
                    Privacy Policy
                  </a>
                </p>
              </div> */}
            </>
          )}
        {/* TODO EMAIL VERIFICATION FOR PAY IN 4  */}
        {props.packageSelected === props.method.package.package_name &&
          emailValidated !== true && <EmailOtp />}
      </div>
    </div>
  );
};

export default QisstpayMethodCard;
