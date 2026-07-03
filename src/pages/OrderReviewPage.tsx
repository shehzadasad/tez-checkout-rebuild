import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import "../styles/checkout.css";
import "../styles/success.css";
import { useHistory, useLocation } from "react-router";
import { useOrderReviewHook } from "../hooks/custom/useOrderReview";
import { lazyLoad } from "../utils/loadable";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../enums/GA-messages";
import { usePaymentSelectionHook } from "../hooks/custom/usePaymentSelection";
import Globalcart from "../components/cart/Globalcart";

const Cart = lazyLoad(() => import("../components/cart/cart"));
const ShippingAddress = lazyLoad(
  () => import("../components/payment/shipping/shippingLocation")
);

const OrderReviewPage: React.FC = () => {
  let history = useHistory();

  const {
    states: { encrypted, orderId, lineItems, cartData },
    setStates: { setOrderId },
    handlers: { requestOrderHandler },
  } = useOrderReviewHook();

  const {
    states: { toggleButton },

    setStates: { setToggleButton },
  } = usePaymentSelectionHook();

  const {
    state: {
      shippingValidate,
      shippingMethods,
      shippingPrice,
      totalAmount: price,
      currency,
      taxPrice,
      productsObj,
      identityToken,
      token,
      emailValidated,
      countryCode,
      discountedAmount,
      prodAmount,
      isTez,
      is4gives,
      processingFee,
      walletBalance,
      walletToggleButtonCheck,
      GoogleAnalyticsCred,
      shipping_flag,
      mall_ID,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  useEffect(() => {
    console.log("CART DATA: ", cartData?.shippingInfo);

    // --- Google Analytics --- //
    if (GoogleAnalyticsCred?.type === "UA") {
      console.log(
        "GoogleAnalyticsCred.tracking_id => ",
        GoogleAnalyticsCred?.tracking_id
      );
      ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
      ReactGA.event({
        category: "Page",
        action: GAMessages.ORDER_DETAILS_PAGE,
      });
    }

    if (GoogleAnalyticsCred?.type === "GA4") {
      console.log(
        "GoogleAnalyticsCred.measurement_id => ",
        GoogleAnalyticsCred?.measurement_id
      );
      ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
      ReactGA4.event({
        category: "Page",
        action: GAMessages.ORDER_DETAILS_PAGE,
      });
    }
    // --- Google Analytics End --- //
  }, [GoogleAnalyticsCred]);

  useEffect(() => {
    // (global as any).analytics.page("Review Line Items");

    const search = window.location.search;

    const params = new URLSearchParams(search);

    const token = params.get("token");
    const tracking = params.get("tracking_id");
    const transactionID = params.get("order_id");
    setOrderId(transactionID!);
    requestOrderHandler(tracking!, token!);
    updateStateHandler({
      payload: {
        trackingId: tracking,
        token: token,
      },
    });
    console.log("MALL ID: ", mall_ID);
  }, []);

  return (
    <>
      <Container className="center-box">
        <div className="flex-box">
          <div className="checkout-container bg-checkout relative ">
            {!is4gives && isTez != 0 ? (
              <div className="logo-container">
                <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
              </div>
            ) : (
              !is4gives && (
                <div className="logo-container">
                  <img
                    className="tezlogo"
                    src="/assets/qisst-pay-logo.svg"
                  ></img>
                </div>
              )
            )}

            {is4gives && (
              <div>
                <div className="logo-container">
                  <img
                    className="tezlogo fourGivelogo"
                    src="/assets/Splitmo-traditional.svg"
                  ></img>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    className="tezlogo fourGivelogo"
                    src="/assets/PoweredGroup.svg"
                  ></img>
                </div>
              </div>
            )}

            <div className="content-container mb-20">
              <div className="">
                <div onClick={() => history.goBack()} className="flex pointer">
                  <img
                    className="mr-20"
                    src="/assets/backbtn.svg"
                    alt="back button"
                  />
                  <p className="main-headings ">Order Complete</p>
                </div>

                <p style={{ paddingLeft: 10 }} className="text-14px mt-20">
                  {" "}
                  No . ORDER. {orderId} |{" "}
                  <span className="base-color">ORDER COMPLETE</span>
                </p>
              </div>
            </div>

            <ShippingAddress
              identityToken={""}
              token={""}
              // shippingMethods={[
              //   {
              //     cost: encrypted?.shipping_amount,
              //     title: encrypted?.shipping_name,
              //   },
              // ]}
              shippingAdd={
                cartData?.shippingInfo?.address1
                  ? cartData?.shippingInfo?.address1
                  : encrypted?.shipping_info?.address1
              }
              // shippingAddr1={encrypted?.address}
              currency={
                cartData?.currency ? cartData?.currency : encrypted?.currency
              }
              from="review"
            />
          </div>
        </div>
        {/* {is4gives && <p className="poweredQP">Powered by Qisstpay</p>} */}
      </Container>

      {/* mall make this uncomment */}

      {/* {mall_ID === "" ? (
        ""
      ) : mall_ID === null ? ( */}
      <Cart
        countryCode={cartData?.country_code}
        currency={cartData?.currency}
        vaultPoints={"0"}
        taxPrice={Number(cartData?.tax)}
        shippingPrice={
          shipping_flag && shipping_flag === "true"
            ? Number(cartData?.shippingAmount)
            : shipping_flag && shipping_flag === "false"
            ? "0"
            : !shipping_flag && Number(cartData?.shippingAmount)
        }
        processingFee={
          (Number(prodAmount) / 100) * Number(processingFee)
            ? (Number(prodAmount) / 100) * Number(processingFee)
            : Number(encrypted?.processing_fee)
            ? Number(encrypted?.processing_fee)
            : ""
        }
        totalAmount={cartData?.totalAmount}
        productsObj={productsObj}
        discountedAmount={cartData?.discount}
      />
      {/* ) : (
        <Globalcart show={""} />
      )} */}
    </>
  );
};

export default OrderReviewPage;
