import React, { useContext, useEffect, useState } from "react";
// import { TailSpin } from "react-loader-spinner";
import IntlTelInput from "react-intl-tel-input";
import { lazyLoad } from "../utils/loadable";
import "react-intl-tel-input/dist/main.css";
import { usePhoneHook } from "../hooks/custom/usePhone";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../router/routes";

const HelpUsModal = lazyLoad(() => import("../components/modals/HelpUsModal"));

const PhonePage: React.FC = () => {
  const {
    states: { onLoad, showHelpUs, error },
    setStates: { setPhoneValidity },
    handlers: {
      getCountryCodeHandler,
      closeHelpUsModalHandler,
      showHelpUsModalHandler,
      sendOtpHandler,
      updatePhoneNumberHandler,
    },
  } = usePhoneHook();

  const {
    state: { countryCode, intlNumber, phoneNumber, identityToken },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const location = useLocation();

  useEffect(() => {
    getCountryCodeHandler();
    linkDecodeHandler();
  }, []);

  /**
   * @description
   * * decode url and parse its data according to different conditions
   * * update the identity-token and other fields in checkout context
   */
  const linkDecodeHandler = () => {
    // (global as any).rudderanalytics?.track("Checkout 1-Click Started");
    // (global as any).analytics.page("Enter Mobile Number");

    const search = location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const token = params.get("identity-token");
    const newUrl = params.get("queryUrl");
    const returnCase = params.get("return");

    //states on context we are going to update
    const updatedState = {
      shippingValidate: false,
      productsObj: [],
      shippingMethods: [],
      totalAmount: 0,
      shippingPrice: "",
      taxPrice: "",
      identityToken: "",
      productId: "",
      productName: "",
      productQuantity: "",
      productPrice: "",
      src: "",
      url: "",
      currency: "",
    };

    // new changes (decoded data in url)
    if (newUrl != null) {
      // console.log("new params" + window.atob(newUrl));
      let decode = window.atob(newUrl);

      let newParams = new URLSearchParams(decode);
      // console.log(decode);
      updatedState.productsObj = JSON.parse(newParams.get("products")!);
      updatedState.shippingMethods = JSON.parse(
        newParams.get("shipping_methods")!
      );

      if (updatedState.shippingMethods && updatedState.shippingMethods.length) {
        updatedState.shippingValidate = true;
      }

      updatedState.shippingPrice = newParams.get("shipping_total")!;
      updatedState.taxPrice = newParams.get("tax")!;

      updatedState.productId = params.get("product_id")!;
      updatedState.productName = params.get("title")!;
      updatedState.productQuantity = newParams.get("quantity")!;
      updatedState.productPrice = newParams.get("price")!;
      updatedState.src = newParams.get("src")!;
      updatedState.currency = newParams.get("currency")!;
      updatedState.url = newParams.get("url")!;
    } else {
      updatedState.productsObj = JSON.parse(params.get("products")!);
      // console.log("old url" + updatedState.productsObj);

      updatedState.shippingPrice = params.get("shipping_total")!;
      updatedState.taxPrice = params.get("tax")!;
      updatedState.productId = params.get("product_id")!;
      updatedState.productName = params.get("title")!;
      updatedState.productQuantity = params.get("quantity")!;
      updatedState.productPrice = params.get("price")!;
      updatedState.src = params.get("src")!;
      updatedState.currency = params.get("currency")!;
      updatedState.url = params.get("url")!;

      updatedState.shippingValidate = true;
    }

    let total = 0;
    if (updatedState.productsObj != null) {
      updatedState.productsObj.map((product: any) => {
        let totalPerProduct = Number(product.price * product.quantity);
        total = total + Number(totalPerProduct);
      });
    }
    updatedState.totalAmount = total;

    updatedState.identityToken = identityToken != "" ? identityToken : token!;
    updateStateHandler({
      payload: { ...updatedState },
    });
  };

  return (
    <>
      <div className="center-box">
        <h3 className="topHeading">Sign Up</h3>

        <div className="flex-box">
          <div className="checkout-container bg-checkout relative">
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
              <div className="input-number-group relative">
                <p className="number-text mb-30 text-16">
                  Please enter your mobile number.
                </p>

                {countryCode != "" && (
                  <IntlTelInput
                    containerClassName="intl-tel-input w-100"
                    inputClassName="single-input-card outline-color-base w-100 h-60 text-16"
                    fieldId="input"
                    defaultValue={phoneNumber}
                    autoPlaceholder
                    defaultCountry={countryCode}
                    preferredCountries={["pk", "us"]}
                    value={phoneNumber}
                    autoFocus
                    onSelectFlag={(e) => {
                      updateStateHandler({
                        payload: {
                          phoneNumber: "",
                          intlNumber: "",
                        },
                      });
                    }}
                    onPhoneNumberChange={(
                      isValid,
                      value,
                      countryData,
                      intlNumber
                    ) => {
                      updatePhoneNumberHandler(
                        isValid,
                        value,
                        intlNumber,
                        countryData
                      );
                    }}
                    onPhoneNumberBlur={(isValid) => {
                      setPhoneValidity(isValid);
                    }}
                  />
                )}
                {error != "" && (
                  <div className="w-100 mt-10 flex align-center absolute number-err">
                    <img src="/assets/error.svg" />
                    <p className="pl-10 error-msg text-start">{error}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="btn-container mt-30">
              <button
                type="button"
                disabled={["", null].includes(identityToken)}
                className={
                  ["", null].includes(identityToken)
                    ? "disable-btn"
                    : "basic-btn"
                }
                onClick={sendOtpHandler}
              >
                Send Code
              </button>
              <p
                onClick={showHelpUsModalHandler}
                className="text-center mt-30 base-color pointer"
              >
                <img
                  style={{
                    width: "15px",
                    marginRight: "5px",
                    marginTop: "-3px",
                  }}
                  src="/assets/!.svg"
                ></img>
                How it Works ?
              </p>
            </div>
          </div>
        </div>

        <HelpUsModal show={showHelpUs} handleClose={closeHelpUsModalHandler} />
      </div>
    </>
  );
};

export default PhonePage;
