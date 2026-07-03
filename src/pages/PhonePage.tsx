import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import IntlTelInput from "react-intl-tel-input";
// import { lazyLoad } from "../utils/loadable";
import "react-intl-tel-input/dist/main.css";
import { usePhoneHook } from "../hooks/custom/usePhone";
import { useFacebookHook } from "../hooks/custom/useFacebookPixel";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../router/routes";
import { Row, Col, Form } from "react-bootstrap";
import { ReactNotifications, Store } from "react-notifications-component";
// import Cart from "../components/cart/cart";
import "../styles/phoneScreen.css";
import "../styles/checkout.css";
import { generalService } from "../services/general.service";
// import { generalServiceTwo } from "../services/generalTwo.service";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { EEventName } from "../enums/event-name.enum";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { GAMessages } from "../enums/GA-messages";
import PhoneSvg from "../assets/Images/SVG/phoneSvg";
import { Dna } from "react-loader-spinner";
import * as math from "mathjs";
import HelpUsModal from "../components/modals/HelpUsModal";
import usePaymentDetailHook from "../hooks/custom/usePaymentDetail";
import { percentageHelper } from "../utils/helper";
import CurrencyFormat from "react-currency-format";
import { getCurrencySymbol } from "../utils/get-currency-symbol.helper";
import axios from "axios";

// import Upsell3 from "../components/Upsell/Upsell3";
const Globalcart = React.lazy(() => import("../components/cart/Globalcart"));
let executedOnce = false;
let executedOnceEvent = false;

const PhonePage: React.FC = (props) => {
  const [fourGiveLoader, setFourGiveLoader] = useState(true);
  const [wordPhone, setWordPhone] = useState("");
  const [poweredBy, setPoweredBy] = useState<string>("");
  // const [uniqueRSID, setUniqueRSID] = useState<string>("");

  const {
    states: {
      onLoad,
      showHelpUs,
      error,
      phoneValidity,
      acceptTerms,
      shortURL,
      timeLeft,
    },
    setStates: { setPhoneValidity, setAcceptTerms, setTimeLeft },
    handlers: {
      getCountryCodeHandler,
      closeHelpUsModalHandler,
      showHelpUsModalHandler,
      updatePhoneNumberHandler,
      // guestCheckoutHandler,
      handleKeyPressHandler,
      bityCall,
      VerifyUser,
      sendOtpHandler,
      verifyOtpHandler,
      generateSignInRequestId,
    },
  } = usePhoneHook();

  const {
    handlers: { getMerchantScripts },
  } = useFacebookHook();

  const {
    state: {
      countryCode,
      productsObj,
      phoneNumber,
      identityToken,
      customerId,
      isTez,
      GoogleAnalyticsCred,
      min,
      max,
      signIn1cAuthStatus,
      SignInRequestId,
      intlNumber,
      mall_ID,
      signIn1cAuthcheck,
      globalCartObject,
      phone_number_mall,
      // guest_checkout,
      url,
      rudderStackID,
      phoneNumberUrl,
      totalAmount,
      currency,
      shippingPrice,
      taxPrice,
      packageSelectedQP,
      processingFee,
      is4gives,
      walletBalance,
      discountedAmount,
      walletToggleButtonCheck,
      taxes,
      meta,
      ipAddress,
      MerchantUserId,
      checkout_url,
      time_stamp,
    },

    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const history = useHistory();

  useEffect(() => {
    // --- Google Analytics --- //
    if (GoogleAnalyticsCred?.type === "UA") {
      ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
      ReactGA.event({
        category: "Page",
        action: GAMessages.PHONE_PAGE,
      });
    }

    if (GoogleAnalyticsCred?.type === "GA4") {
      ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
      ReactGA4.event({
        category: "Page",
        action: GAMessages.PHONE_PAGE,
      });
    }
    // --- Google Analytics End --- //
  }, [GoogleAnalyticsCred]);

  // useEffect(() => {
  //   setUniqueRSID(generateRandomNumber());
  // }, []);

  // const initializeRA = () => {
  //   (global as any).rudderanalytics.ready(() => {
  //     console.log("we are all set!!!");
  //   });
  // };

  // useEffect(() => {
  //   initializeRA();
  // }, []);
  const [loadingTime, setLoadingTime] = useState<number | null>(null);
  let executedOnceEvent = false;
  const location = useLocation();
  const [responseEvent, setResponseEvent] = useState(0);
  const searh = location.search; // could be '?foo=bar'
  const param = new URLSearchParams(searh);
  let queryurl: any = param.get("identity-token");
  let decodedURLL: any = window.atob(queryurl);
  let conditionalIdentityToken = decodedURLL.includes("mall.qisstpay");
  useEffect(() => {
    if (ipAddress == "") {
      fetch("https://api64.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          updateStateHandler({
            payload: {
              ipAddress: data.ip,
            },
          });
        })
        .catch((error) => console.error("Error fetching IP address:", error));
    }
  }, [ipAddress]);
  useEffect(() => {
    const search = location.search; // could be '?foo=bar'

    const params = new URLSearchParams(search);
    const newUrl = params.get("queryUrl");

    let prodIds = [];
    let totalQty = 0;
    let totalPrice = 0;
    let contentNames = [];

    if (newUrl != null) {
      let decode = window.atob(newUrl);
      let newParams = new URLSearchParams(decode);
      // let prods = JSON.parse(newParams.get("products")!);
      const productsString = newParams.get("products")!;
      const products_encoded: any = newParams.get("products_encoded")!;
      // console.log("ENCODED: ", products_encoded);
      var prods: any = null;

      if (
        products_encoded &&
        (products_encoded === "1" || products_encoded === 1)
      ) {
        const decodeProducts = atob(productsString);
        const jsonParse = JSON.parse(decodeProducts);
        // console.log("DECODED DATA: ", decodeProducts);
        // console.log("PARSED DATA: ", jsonParse);
        prods = jsonParse;
      } else {
        prods = JSON.parse(newParams.get("products")!);
      }

      let curr = newParams.get("currency")!;

      for (let i = 0; i < prods.length; i++) {
        if (prods[i]) {
          totalPrice =
            totalPrice +
            (prods[i].price ? prods[i].price : null) *
              (prods[i].quantity ? prods[i].quantity : null);
          prodIds.push(prods[i].id);
          contentNames.push(prods[i].title);
          totalQty = totalQty + (prods[i].quantity ? prods[i].quantity : 1);
        }
      }

      if (typeof window !== "undefined") {
        if ((window as any).fbq) {
          (window as any).fbq("track", "InitiateCheckout", {
            content_type: "product",
            content_ids: prodIds,
            content_name: contentNames,
            value: totalPrice ? totalPrice : null,
            currency: curr ? curr : null,
            num_items: totalQty,
          });
        }
      }
    }
  }, [(window as any).fbq]);

  const getIsFourGivesValue = async () => {
    // try {
    //   const search = location.search; // could be '?foo=bar'
    //   const params = new URLSearchParams(search);
    //   const token = params.get("identity-token");
    //   const checkout_url = window.location.href;
    //   let response = await generalServiceTwo.fourGives({
    //     headers: {
    //       "identity-token": token!,
    //     },
    //   });
    //   let updatedState = {
    //     is4gives: false,
    //   };
    //   if (response.data && response.data.has_custom_credit_card) {
    //     updatedState.is4gives = true;
    //     setPoweredBy("4gives");
    //   } else {
    //     updatedState.is4gives = false;
    //     setPoweredBy("QisstPay");
    //   }
    //   updateStateHandler({
    //     payload: { ...updatedState },
    //   });
    //   setFourGiveLoader(false);
    // } catch (e) {
    //   setPoweredBy("QisstPay");
    //   setFourGiveLoader(false);
    // }
  };
  useEffect(() => {
    if (!executedOnce) {
      // getCountryCodeHandler();
      // bityCall(window.location.href);
      const search = location.search;
      const params = new URLSearchParams(search);
      const token = params.get("identity-token");
      const newUrl = params.get("queryUrl");
      if (token !== null && newUrl !== null) {
        linkDecodeHandler();
        if (ipAddress != "") {
          getIsFourGivesValue();
        }
      }
      executedOnce = true;
    }
    updateStateHandler({
      payload: {
        phoneNumberUrl: history.location.search,
      },
    });
  }, []);
  useEffect(() => {
    localStorage.removeItem("card_number");
    localStorage.removeItem("card_expiry_year");
    localStorage.removeItem("card_expiry_month");
    localStorage.removeItem("card_cvv");
    localStorage.removeItem("card_skyflow_id");
    localStorage.removeItem("card_pin_id");
  }, []);

  /**
   * @description
   * * decode url and parse its data according to different conditions
   * * update the identity-token and other fields in checkout context
   */
  const flagCheckEvent = (countryName: any) => {
    console.log("Selected Country Flag:", countryName);
    if (MerchantUserId != 0) {
      (global as any).rudderanalytics?.track(
        "country_code_changed",
        {},
        {
          time_stamp: time_stamp,
          countryFlag: countryName,
          checkout_url: checkout_url,
          anonymousId: conditionalIdentityToken
            ? (global as any).rudderanalytics.getAnonymousId()
            : rudderStackID,
          MerchantUserId: MerchantUserId,
        }
      );
    }
  };

  const linkDecodeHandler = () => {
    // setOnLoad(true);
    // (global as any).analytics.page("Enter Mobile Number");
    const checkout_url = window.location.href;

    // console.log("checkout_url" + checkout_url);
    const search = location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const token = params.get("identity-token");
    // const is4givesP = params.get("is4gives");
    const newUrl = params.get("queryUrl");
    const meta = params.get("meta");
    const returnCase = params.get("return");
    // if (checkout_url != "" && !shortURL) {
    //   bityCall(checkout_url);
    // }
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
      place_order_on_merchant_site: "",
      is_headless: "",
      phone_number_mall: "",
      bigCommerceURL: "",
      merchant_call_back_url: "",
      meta: meta ?? "",
      queryString: search,
      checkout_url: checkout_url,
      isTez: 2,
      storeType: "",
      callBackUrl: "",
      redirectUrl: "",
      merchantEndRequest: "",
      merchantOrderId: "",
      phoneNumber: "",
      name: "",
      lastName: "",
      email: "",
      sku: "",
      cart_id: "",
      platForm_bigCommerce: "",
      discountedAmount: "",
      mall_ID: "",
      store_type: "",
      invoiceId: "",
      invoice_id: "",
      headless_url: "",
      shipping_flag: "",
      tax_flag: "",
      link_id: "",
      // guest_checkout: "",
      // is4gives: is4givesP??false
    };

    // new changes (decoded data in url)
    if (newUrl != null) {
      let decode = window.atob(newUrl);
      let newParams = new URLSearchParams(decode);
      // console.log("NEW PARAMS: ", newParams);
      if (newParams.get("merchant_end_request")) {
        let merchantEndRequest = JSON.parse(
          newParams.get("merchant_end_request")!
        );
        updatedState.phoneNumber = merchantEndRequest.customer_phone_number;
        updatedState.name = merchantEndRequest.first_name;
        updatedState.lastName = merchantEndRequest.last_name;
        updatedState.email = merchantEndRequest.email;
      }

      const productsString = newParams.get("products")!;
      const products_encoded: any = newParams.get("products_encoded")!;
      // console.log("ENCODED: ", products_encoded);
      var p: any = null;

      if (
        products_encoded &&
        (products_encoded === "1" || products_encoded === 1)
      ) {
        const decodeProducts = atob(productsString);
        const jsonParse = JSON.parse(decodeProducts);
        // console.log("DECODED DATA: ", decodeProducts);
        // console.log("PARSED DATA: ", jsonParse);
        p = jsonParse;
      } else {
        p = JSON.parse(newParams.get("products")!);
      }

      updatedState.productsObj = p;

      //---------------- Shipping Check for Wordpress and other

      const pQuantity: any = [];
      p.map((item: any) => {
        pQuantity.push(Number(item.quantity));
      });
      const quantitySum = pQuantity.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue,
        0
      );

      const getQueryParam = (queryString: any, param: any) => {
        const params = queryString.split("&");
        for (const paramStr of params) {
          const [name, value] = paramStr.split("=");
          if (decodeURIComponent(name) === param) {
            return decodeURIComponent(value);
          }
        }
        return null;
      };

      const shippingMethodsParam = getQueryParam(decode, "shipping_methods")!;
      const shipMethods = JSON.parse(shippingMethodsParam);

      const evaluateExpression = (expression: any, qty: any) => {
        const replacedExpression = expression.replace(/\[qty\]/g, qty);
        const cleanedExpression = replacedExpression.replace(/\s/g, "");
        const result = math.evaluate(cleanedExpression);
        return result;
      };

      const updatedShippingMethods =
        shipMethods &&
        shipMethods.map((method: any) => {
          if (
            shipMethods &&
            typeof method.cost === "string" &&
            method.cost.includes("[qty]")
          ) {
            evaluateExpression(method.cost, quantitySum);
            const numericCost: any = evaluateExpression(
              method.cost,
              p[0].quantity
            );
            return { ...method, cost: numericCost };
          } else {
            return { ...method };
          }
        });

      updatedState.shippingMethods = updatedShippingMethods;
      if (updatedState.shippingMethods && updatedState.shippingMethods.length) {
        updatedState.shippingValidate = true;
      }

      // ----------------------------------------------

      //(!) means this value will always come.
      updatedState.shippingPrice = newParams.get("shipping_total")!;
      updatedState.place_order_on_merchant_site = newParams.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.cart_id = newParams.get("cartId")!;
      // updatedState.productsObj = JSON.parse(newParams.get("products")!);
      updatedState.platForm_bigCommerce = newParams.get("platForm")!;
      updatedState.mall_ID = newParams.get("mall_id")!;
      updatedState.discountedAmount = newParams.get("discountedAmount")!;
      updatedState.is_headless = newParams.get("is_headless")!;
      updatedState.headless_url = newParams.get("headless_url")!;
      updatedState.shipping_flag = newParams.get("shipping_charges")!;
      updatedState.tax_flag = newParams.get("tax_charges")!;
      updatedState.link_id = newParams.get("link_id")!;
      // updatedState.guest_checkout = newParams.get("guest_checkout")!;
      updatedState.phone_number_mall = newParams.get("phone_number")!;
      updatedState.store_type = newParams.get("store_type")!;
      updatedState.invoice_id = newParams.get("invoice_id")!;

      let tp = newParams.get("tax")!;
      updatedState.taxPrice = tp != undefined && tp != "undefined" ? tp : "0";

      updatedState.productId = params.get("product_id")!;
      updatedState.productName = params.get("title")!;
      updatedState.place_order_on_merchant_site = newParams.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.cart_id = newParams.get("cartId")!;
      // updatedState.productsObj = JSON.parse(newParams.get("products")!);
      updatedState.platForm_bigCommerce = newParams.get("platForm")!;
      updatedState.mall_ID = newParams.get("mall_id")!;
      updatedState.discountedAmount = newParams.get("discountedAmount")!;
      updatedState.productQuantity = newParams.get("quantity")!;
      updatedState.productPrice = newParams.get("price")!;
      updatedState.place_order_on_merchant_site = newParams.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.cart_id = newParams.get("cartId")!;
      // updatedState.productsObj = JSON.parse(newParams.get("products")!);
      updatedState.platForm_bigCommerce = newParams.get("platForm")!;
      updatedState.mall_ID = newParams.get("mall_id")!;
      updatedState.discountedAmount = newParams.get("discountedAmount")!;
      updatedState.is_headless = newParams.get("is_headless")!;
      updatedState.headless_url = newParams.get("headless_url")!;
      updatedState.shipping_flag = newParams.get("shipping_charges")!;
      updatedState.tax_flag = newParams.get("tax_charges")!;
      updatedState.link_id = newParams.get("link_id")!;
      // updatedState.guest_checkout = newParams.get("guest_checkout")!;
      updatedState.phone_number_mall = newParams.get("phone_number")!;
      updatedState.store_type = newParams.get("store_type")!;
      updatedState.invoice_id = newParams.get("invoice_id")!;

      updatedState.productQuantity = newParams.get("quantity")!;
      updatedState.productPrice = newParams.get("price")!;
      updatedState.place_order_on_merchant_site = newParams.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.is_headless = newParams.get("is_headless")!;
      updatedState.headless_url = newParams.get("headless_url")!;
      updatedState.shipping_flag = newParams.get("shipping_charges")!;
      updatedState.tax_flag = newParams.get("tax_charges")!;
      updatedState.link_id = newParams.get("link_id")!;
      // updatedState.guest_checkout = newParams.get("guest_checkout")!;
      updatedState.phone_number_mall = newParams.get("phone_number")!;
      updatedState.store_type = newParams.get("store_type")!;
      updatedState.invoice_id = newParams.get("invoice_id")!;
      updatedState.bigCommerceURL = newParams.get("url")!;
      updatedState.merchant_call_back_url = newParams.get(
        "merchant_call_back_url"
      )!;
      // updatedState.is4gives = newParams.get("is4gives")!;
      updatedState.src = newParams.get("src")!;
      updatedState.currency = newParams.get("currency")!;
      updatedState.url = newParams.get("url")!;
      if (newParams.get("is_tez") != null) {
        updatedState.isTez = Number(newParams.get("is_tez")!);
        updatedState.storeType = newParams.get("store_type")!;
        updatedState.invoiceId = newParams.get("invoice_id")!;
        updatedState.callBackUrl = newParams.get("call_back_url")!;
        updatedState.place_order_on_merchant_site = newParams.get(
          "place_order_on_merchant_site"
        )!;
        updatedState.cart_id = newParams.get("cartId")!;
        updatedState.productsObj = JSON.parse(newParams.get("products")!);
        updatedState.platForm_bigCommerce = newParams.get("platForm")!;
        updatedState.mall_ID = newParams.get("mall_id")!;
        updatedState.discountedAmount = newParams.get("discountedAmount")!;
        updatedState.is_headless = newParams.get("is_headless")!;
        updatedState.headless_url = newParams.get("headless_url")!;
        updatedState.shipping_flag = newParams.get("shipping_charges")!;
        updatedState.tax_flag = newParams.get("tax_charges")!;
        updatedState.link_id = newParams.get("link_id")!;
        // updatedState.guest_checkout = newParams.get("guest_checkout")!;
        updatedState.phone_number_mall = newParams.get("phone_number")!;
        updatedState.store_type = newParams.get("store_type")!;
        updatedState.invoice_id = newParams.get("invoice_id")!;

        updatedState.redirectUrl = newParams.get("redirect_url")!;

        let merchantEndRequest = newParams.get("merchant_end_request")!;

        updatedState.merchantEndRequest = newParams.get(
          "merchant_end_request"
        )!;

        if (merchantEndRequest) {
          let merchantEndRequest1 = JSON.parse(merchantEndRequest);

          if (merchantEndRequest1.customer_phone_number) {
            updatedState.phoneNumber =
              merchantEndRequest1.customer_phone_number;
          }
        }

        updatedState.merchantOrderId = newParams.get("merchant_order_id")!;
      }
    } else {
      updatedState.productsObj = JSON.parse(params.get("products")!);
      //console.log("old url" + updatedState.productsObj);

      updatedState.shippingPrice = params.get("shipping_total")!;
      updatedState.place_order_on_merchant_site = params.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.cart_id = params.get("cartId")!;
      updatedState.platForm_bigCommerce = params.get("platForm")!;
      updatedState.mall_ID = params.get("mall_id")!;
      updatedState.discountedAmount = params.get("discountedAmount")!;
      updatedState.is_headless = params.get("is_headless")!;
      updatedState.headless_url = params.get("headless_url")!;
      updatedState.shipping_flag = params.get("shipping_charges")!;
      updatedState.tax_flag = params.get("tax_charges")!;
      updatedState.link_id = params.get("link_id")!;
      // updatedState.guest_checkout = params.get("guest_checkout")!;
      updatedState.phone_number_mall = params.get("phone_number")!;
      updatedState.store_type = params.get("store_type")!;
      updatedState.invoice_id = params.get("invoice_id")!;

      let tp = params.get("tax")!;
      updatedState.taxPrice = tp != undefined && tp != "undefined" ? tp : "0";
      updatedState.productId = params.get("product_id")!;
      updatedState.productName = params.get("title")!;
      updatedState.productQuantity = params.get("quantity")!;
      updatedState.place_order_on_merchant_site = params.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.cart_id = params.get("cartId")!;
      updatedState.platForm_bigCommerce = params.get("platForm")!;
      updatedState.mall_ID = params.get("mall_id")!;
      updatedState.discountedAmount = params.get("discountedAmount")!;
      updatedState.productPrice = params.get("price")!;
      updatedState.place_order_on_merchant_site = params.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.cart_id = params.get("cartId")!;
      updatedState.platForm_bigCommerce = params.get("platForm")!;
      updatedState.mall_ID = params.get("mall_id")!;
      updatedState.discountedAmount = params.get("discountedAmount")!;
      updatedState.is_headless = params.get("is_headless")!;
      updatedState.headless_url = params.get("headless_url")!;
      updatedState.shipping_flag = params.get("shipping_charges")!;
      updatedState.tax_flag = params.get("tax_charges")!;
      updatedState.link_id = params.get("link_id")!;
      // updatedState.guest_checkout = params.get("guest_checkout")!;
      updatedState.phone_number_mall = params.get("phone_number")!;
      updatedState.store_type = params.get("store_type")!;
      updatedState.invoice_id = params.get("invoice_id")!;

      updatedState.productPrice = params.get("price")!;
      updatedState.place_order_on_merchant_site = params.get(
        "place_order_on_merchant_site"
      )!;
      updatedState.is_headless = params.get("is_headless")!;
      updatedState.headless_url = params.get("headless_url")!;
      updatedState.shipping_flag = params.get("shipping_charges")!;
      updatedState.tax_flag = params.get("tax_charges")!;
      updatedState.link_id = params.get("link_id")!;
      // updatedState.guest_checkout = params.get("guest_checkout")!;
      updatedState.phone_number_mall = params.get("phone_number")!;
      updatedState.store_type = params.get("store_type")!;
      updatedState.invoice_id = params.get("invoice_id")!;

      updatedState.bigCommerceURL = params.get("url")!;
      updatedState.merchant_call_back_url = params.get(
        "merchant_call_back_url"
      )!;
      updatedState.src = params.get("src")!;
      updatedState.currency = params.get("currency")!;
      updatedState.url = params.get("url")!;

      updatedState.shippingValidate = true;
    }

    let total = 0;
    if (updatedState.productsObj != null) {
      updatedState.productsObj?.map((product: any) => {
        let totalPerProduct = 0;
        if (isTez == 0) {
          totalPerProduct = Number(product.price);
        } else {
          totalPerProduct =
            Number(
              product.price
                ? product.price
                : product.amount
                ? product.amount
                : 0
            ) * Number(product.quantity ?? 1);
        }

        total = total + Number(totalPerProduct);
      });
    }
    updatedState.totalAmount = total;

    let tArray: any = [];
    updatedState.identityToken = identityToken != "" ? identityToken : token!;

    if (updatedState.mall_ID !== null) {
      let pArray: any = [];
      let array: any = [];

      updatedState.productsObj.map((item: any) => {
        if (!pArray.includes(item.merchant_user_id)) {
          pArray.push(item.merchant_user_id);
        }
      });

      pArray.map((item: any) => {
        array.push({
          shipping: [],
          coupon: false,
          items: [],
        });
      });

      // updateStateHandler({
      //   payload: {
      //     globalCartObject: array,
      //   },
      // })

      pArray.map((item: any, i: any) => {
        updatedState.productsObj.map((item2: any, j: any) => {
          if (item === item2.merchant_user_id) {
            array[i].items.push(item2);
          }
        });
      });

      updateStateHandler({
        payload: {
          globalCartObject: array,
        },
      });
    }
    updateStateHandler({
      payload: { ...updatedState },
    });

    const generateRandomNumber = () => {
      const min = 100000000000;
      const max = 999999999999;
      return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    };
    const rudderStackAnonymousID: any = generateRandomNumber();
    updateStateHandler({
      payload: {
        rudderStackID: conditionalIdentityToken
          ? (global as any).rudderanalytics.getAnonymousId()
          : rudderStackAnonymousID,
        checkout_anonymous_id: rudderStackAnonymousID,
      },
    });
    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    setTimeout(async () => {
      try {
        const response = await generalService.createSegmentEvent(
          EEventName.CHECKOUT_STARTED,
          {
            ip_address: ipAddress,
            rs_anonymous_id: (global as any).rudderanalytics.getAnonymousId(),
            checkout_anonymous_id: rudderStackAnonymousID,
            checkout_url: checkout_url,
            checkout_type: "1-Click",
            affiliation: "",
            subtotal: Number(updatedState.totalAmount),
            total:
              Number(updatedState.totalAmount) +
              Number(updatedState.shippingPrice) +
              Number(updatedState.taxPrice),
            revenue: 0,
            shipping: Number(updatedState.shippingPrice) ?? 0,
            tax: Number(updatedState.taxPrice) ?? 0,
            discount: 0,
            coupon: "",
            currency: updatedState.currency,
            country: "Pakistan",
            locale: "EN",
            product: updatedState.productsObj?.map((product: any) => {
              return {
                sku: product.src,
                category: null,
                name: product.title,
                brand: "NA",
                variant: "NA",
                price: Number(product.price),
                quantity: Number(product.quantity),
                coupon: null,
              };
            }),

            segment_id: segmentId,
          },
          {
            headers: {
              "identity-token": token!,
            },
          }
        );
        if (response) {
          setResponseEvent(1);
        }
        updateStateHandler({
          payload: {
            isStackBuilderEnabled: response.data.isStackBuilderEnabled,
            isEventsEnabled:
              response?.data?.isEventsEnabled == "true" ? true : false,
          },
        });

        localStorage.setItem(
          "isStackBuilderEnabled",
          response.data.isStackBuilderEnabled
        );
        // console.log(response, "res");
        let updatedStatee = {
          is4gives: false,
        };
        if (response.data.hasCustomCreditCard == "true") {
          updatedStatee.is4gives = true;
          setPoweredBy("4gives");
        } else {
          updatedStatee.is4gives = false;
          setPoweredBy("QisstPay");
        }
        setFourGiveLoader(false);
        updateStateHandler({
          payload: { ...updatedStatee },
        });
      } catch (error) {
        setResponseEvent(2);
      }
    }, 0);

    getMerchantScripts(identityToken != "" ? identityToken : token);
  };
  useEffect(() => {
    if (MerchantUserId != 0) {
      if (responseEvent == 1) {
        (global as any).rudderanalytics?.track(
          "checkout_open_success",
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
      } else if (responseEvent == 2) {
        (global as any).rudderanalytics?.track(
          "checkout_open_fail",
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
    }
  }, [responseEvent, MerchantUserId]);
  useEffect(() => {
    const search = location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    let queryurl: any = params.get("queryUrl");
    let decodedURL: any = window.atob(queryurl);
    let newParams = new URLSearchParams(decodedURL);
    let isheadless = newParams.get("is_headless");
    localStorage.removeItem("JWTid");
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("JWTEmail");
    localStorage.removeItem("JWTPhone");
    if (isheadless === "1") {
      const userid: any = params.get("userID");
      const usertoken: any = params.get("userToken");
      const userEmail: any = params.get("email");
      const userPhone: any = params.get("phoneNumber");
      localStorage.setItem("JWTid", userid);
      localStorage.setItem("JWTtoken", usertoken);
      localStorage.setItem("JWTEmail", userEmail);
      localStorage.setItem("JWTPhone", userPhone);

      updateStateHandler({
        customerId: userid ?? userid,
        token: usertoken ?? usertoken,
        email: userEmail,
        phoneNumber: userPhone,
        intlNumber: userPhone,
      });

      if (userid && usertoken && userEmail && userPhone) {
        history.push(routes.paymentSelectionPage);
      }
    }
  }, []);
  useEffect(() => {
    if (MerchantUserId != 0) {
      if (responseEvent == 1) {
        if (acceptTerms) {
          (global as any).rudderanalytics.track(
            "terms_checked",
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
        } else {
          (global as any).rudderanalytics.track(
            "terms_unchecked",
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
      }
    }
  }, [MerchantUserId, acceptTerms, responseEvent]);
  useEffect(() => {
    const search = location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    let queryurl: any = params.get("queryUrl");
    let decodedURL: any = window.atob(queryurl);
    // Check if the decodedURL object has the customer_phone field
    if (decodedURL && decodedURL.includes("customer_phone")) {
      // Extract the customer_phone value from the decodedURLString
      const regex = /"customer_phone":"([^"]*)"/;
      const match = decodedURL.match(regex);
      if (match) {
        const customerPhone = match[1];
        // Set the wordPhone state to the extracted customer_phone value
        setWordPhone(customerPhone);
      }
    }
    updateStateHandler({
      payload: { wordUrl: decodedURL },
    });
  }, []);
  function setStateFunc(value: any) {
    if (value) {
      // const index: number = shippingStates.findIndex(
      //   (data) => value.stateId == data.stateId
      // );
      // if (index > -1) {
      //   // setStateIndex(index);
      // }
      // findShippingStateByIdHandler(value.stateId.toString());
    }
  }

  const [termAndConditions, setTermAndConditions] = useState<boolean>(false);
  useEffect(() => {
    if (signIn1cAuthcheck !== -1) {
      setTimeout(() => {
        if (signIn1cAuthStatus === "PENDING") {
          fetch(
            `${process.env.REACT_APP_AUTHENTICATION_MS_API_KEY}/sign-in/${SignInRequestId}`,
            {
              method: "GET",
              redirect: "follow",
            }
          )
            .then((response) => response.json())
            .then((result) => {
              if (result.status === "APPROVED") {
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

                // updateStateHandler({
                //   payload: {
                //     signIn1cAuthStatus: result.status,
                //   },
                // });
              } else {
                updateStateHandler({
                  payload: {
                    signIn1cAuthcheck: signIn1cAuthcheck + 1,
                  },
                });
              }
            })
            .catch((error) => console.log("error", error));
        }
      }, 3000);
    }
  }, [signIn1cAuthStatus, signIn1cAuthcheck]);

  useEffect(() => {
    if (MerchantUserId != 0) {
      if (termAndConditions == true) {
        (global as any).rudderanalytics?.track(
          "terms_opened",
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
        setTermAndConditions(false);
      }
    }
  }, [termAndConditions, MerchantUserId]);

  useEffect(() => {
    if (timeLeft !== 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setTimeLeft(0);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (is4gives) {
      updateStateHandler({
        payload: {
          countryCode: "ph",
        },
      });
    } else {
      updateStateHandler({
        payload: {
          countryCode: "pk",
        },
      });
    }
  }, [is4gives]);
  // useEffect(() => {
  //   console.log(fourGiveLoader, onLoad, countryCode, "aaaa");
  // }, [fourGiveLoader, onLoad, countryCode]);
  const {
    setStates: {},
    handlers: { updateAmountHandler },
  } = usePaymentDetailHook();
  const [loadOrder, setLoadOrder] = useState(false);
  interface LineItem {
    id: string;
    src: string;
    sku: string;
    name: string;
    type: string;
    quantity: number;
    category: number | null;
    subcategory: number | string;
    description: string;
    color: string;
    size: string;
    brand: string;
    unit_price: number;
    amount: number;
    attributes: any; // You might want to replace `any` with a more specific type
    tax_rate: number;
    total_discount_amount: number;
    total_tax_amount: number;

    shipping_attributes: {
      weight: string;
      dimensions: {
        height: string;
        width: string;
        length: string;
      };
    };
  }

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  useEffect(() => {
    // (global as any).analytics.page("Payment Schedule ");
  }, []);

  useEffect(() => {
    let totalPrice =
      Number(totalAmount) + Number(taxPrice) + Number(shippingPrice);
    updateAmountHandler(String(totalPrice));

    // if (packageSelectedQP === "PAY_IN_3") {
    //   let totalPrice =
    //     Number(totalAmount) + Number(taxPrice) + Number(shippingPrice);
    //   let newPAyInThreePrice = totalPrice + totalPrice * processingFee / 100

    //   console.log("==================================== NEW PAY IN 3 PRICE: ", newPAyInThreePrice)
    //   updateAmountHandler(String(newPAyInThreePrice));
    // }

    // if (props.selectedPaymentPackage == "SPLIT_PAY") {
    //   setTabPay6(true);
    //   setTabPay4(false);
    // }
    // if (props.selectedPaymentPackage == "PAY_IN_4") {
    //   setTabPay4(true);
    //   setTabPay6(false);
    // }
  }, [totalAmount]);

  useEffect(() => {
    getlineItems();
  }, [productsObj]);

  // useEffect(() => {
  // console.log(props.processingFee, "PLATFORM FEE");
  // console.log(
  //   merchantWalletIsEnabled,
  //   Number(props.vaultPoints),
  //   calculateTotalAmount(),
  //   Number(props.processingFee),
  //   "CONDITION"
  // );
  // }, []);

  const getlineItems = async () => {
    let lineItem: any[] = []; // Initialize lineItems as an empty array

    await productsObj?.map((item) => {
      // console.log("ITEM");
      // console.log(item);
      // const decodedName = item.title ? decodeURIComponent(item.title) : "NA";
      // const decodedSrc = item.src ? decodeURIComponent(item.src) : "NA";
      lineItem.push({
        id: String(item.id ?? ""),
        src: item.src,
        sku: String(item.id),
        name: item.title,
        type: "NA",
        quantity: Number(item.quantity),
        category: Number(item?.category) ?? null,
        subcategory: Number(item?.subcategory) ?? "NA",
        description: item?.description ?? "NA",
        color: item?.color ?? "NA",
        size: item?.size ?? "NA",
        brand: item?.brand ?? "NA",
        unit_price: isTez == 0 ? Number(item.unit_price) : Number(item.price),
        amount:
          isTez == 0
            ? Number(item.price)
            : Number(item.price) * Number(item.quantity),
        attributes: item.attributes,
        tax_rate: 1,
        total_discount_amount: 0,
        total_tax_amount: 1,

        shipping_attributes: {
          weight: "NA",
          dimensions: {
            height: "NA",
            width: "NA",
            length: "NA",
          },
        },
      });
    });

    setLineItems(lineItem);
  };

  const calculateTotalAmount = () => {
    return meta == ""
      ? Number(totalAmount) +
          Number(taxPrice) +
          Number(shippingPrice) -
          Number(discountedAmount)
      : Number(totalAmount) +
          Number(200 + Number(percentageHelper(2.6, Number(totalAmount)))) -
          Number(discountedAmount);
  };
  // const limitError=()=>{

  // }
  return (
    <>
      <ReactNotifications />
      {fourGiveLoader || onLoad || countryCode === "" ? (
        <>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Dna
              visible={true}
              height="120"
              width="120"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        </>
      ) : (
        <>
          {/* <iframe src="demo_iframe.htm" height="200" width="300" title="Iframe Example"></iframe> */}
          <div className="center-box">
            <div className="flex-box">
              <div
                className={`${
                  signIn1cAuthStatus === "PENDING" ? "" : "checkout-container"
                } bg-checkout relative`}
                style={{
                  paddingTop: `${
                    signIn1cAuthStatus === "PENDING" ? "40px" : ""
                  }`,
                }}
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
                {!fourGiveLoader && !is4gives && isTez != 0 ? (
                  <div className="logo-container">
                    <img
                      rel="preload"
                      className="tezlogo"
                      src="/assets/qisst-pay-logo.svg"
                      width="200px"
                      height="43.15px"
                    ></img>
                  </div>
                ) : (
                  !fourGiveLoader &&
                  !is4gives && (
                    <div className="logo-container">
                      <img
                        rel="preload"
                        className="tezlogo"
                        src="/assets/qisst-pay-logo.svg"
                        width="200px"
                        height="43.15px"
                      ></img>
                    </div>
                  )
                )}

                {!fourGiveLoader && is4gives && (
                  <div>
                    <div className="logo-container">
                      <img
                        rel="preload"
                        className="tezlogo fourGivelogo"
                        src="/assets/Splitmo-traditional.svg"
                      ></img>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img
                        className="tezlogo fourGivelogo"
                        rel="preload"
                        src="/assets/PoweredGroup.svg"
                      ></img>
                    </div>
                  </div>
                )}

                {isTez != 0 && (
                  <div className="logo-container mt-20">
                    <img
                      rel="preload"
                      className="tezlogo"
                      src="/assets/1step-1.svg"
                      width="200px"
                      height="39.65px"
                    ></img>
                  </div>
                )}

                {signIn1cAuthStatus === "PENDING" ? (
                  <div className="">
                    <div className="input-number-div relative">
                      <p className="phoneScreenText mb-10 text-20">
                        Welcome back! Kindly check QP <br />
                        notification on your mobile.
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "20px",
                        }}
                      >
                        <PhoneSvg />
                      </div>

                      <p
                        className="phoneScreenText2"
                        style={{ marginTop: "20px" }}
                      >
                        Once you authenticate it, you will proceed <br />
                        to next screen.
                      </p>

                      <div
                        className="sendOTPText"
                        style={{ textAlign: "center" }}
                      >
                        <p
                          className="mb-10"
                          style={{ marginTop: "30px", cursor: "pointer" }}
                          onClick={sendOtpHandler}
                        >
                          or Send OTP on my number
                        </p>

                        <button
                          onClick={() => {
                            generateSignInRequestId(customerId);
                          }}
                          className={
                            timeLeft !== 0 ? "disable-btn" : "basic-btn-new"
                          }
                          disabled={timeLeft !== 0 ? true : false}
                        >
                          Resend Notification {timeLeft === 0 ? "" : timeLeft}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="">
                      <div className="input-number-div relative">
                        <p className="phoneScreenText mb-10 text-20">
                          {is4gives ? (
                            <>
                              Enter your phone number to <br />
                              checkout
                            </>
                          ) : (
                            <>
                              Check out karnay k liye apna phone number darj
                              karain
                            </>
                          )}
                        </p>
                        {/* <p className="phone-sm-text mb-10">
                          {is4gives ? (
                            <>We’ll send you a verification code via SMS.</>
                          ) : (
                            <>
                              Apko sms k zariye ek verification code bheja
                              jayega
                            </>
                          )}
                        </p> */}
                        <Row>
                          <Col
                            lg={7}
                            md={7}
                            sm={7}
                            xs={8}
                            onKeyPress={handleKeyPressHandler}
                          >
                            {countryCode != "" && (
                              <IntlTelInput
                                containerClassName="intl-tel-input w-100"
                                inputClassName="single-input-card2 outline-color-base2 w-100 h-50 text-16"
                                fieldId="input"
                                autoFocus={true}
                                // defaultValue={
                                //   phoneNumber
                                //     ? phoneNumber
                                //     : phone_number_mall
                                //     ? phone_number_mall
                                //     :  ""
                                // }
                                autoPlaceholder
                                format={true}
                                disabled={phone_number_mall && true}
                                defaultCountry={is4gives ? "ph" : countryCode}
                                preferredCountries={["pk", "us"]}
                                onlyCountries={["pk", "us", "ph"]}
                                value={
                                  phoneNumber
                                    ? phoneNumber
                                    : phone_number_mall
                                    ? phone_number_mall
                                    : wordPhone
                                    ? wordPhone
                                    : ""
                                }
                                onSelectFlag={(e, countryData) => {
                                  // Log the flag information
                                  flagCheckEvent(countryData.name);

                                  // Your existing logic
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
                                  setPhoneValidity(false);
                                  setWordPhone(value);
                                  // if (value.length == 12) {
                                  //   // setPhoneValidity(false);
                                  //   console.log("Good");
                                  // } else if (value.length <= 11) {
                                  //   // setLimitError(true);
                                  //   console.log(
                                  //     "Please correct your number or format e.g : 0301 1234567"
                                  //   );
                                  // } else if (value.length > 12) {
                                  // }
                                  // updatePhoneNumberHandler(
                                  //   isValid,
                                  //   value,
                                  //   intlNumber,
                                  //   countryData
                                  // );
                                  if (countryData.name == "Philippines") {
                                    setPhoneValidity(false);
                                    var regex =
                                      /((\+[0-9]{2})|0)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/;
                                    if (
                                      intlNumber === "" ||
                                      !regex.test(intlNumber)
                                    ) {
                                      setPhoneValidity(false);
                                    } else {
                                      setPhoneValidity(true);
                                    }
                                  } else {
                                    // Adjust the regular expression for Pakistan phone numbers
                                    var regexPakistan =
                                      /((\+[0-9]{2})|0)[.\- ]?3[0-9]{2}[.\- ]?[0-9]{7}/;
                                    if (
                                      intlNumber === "" ||
                                      !regexPakistan.test(intlNumber)
                                    ) {
                                      setPhoneValidity(false);
                                    } else {
                                      setPhoneValidity(true);
                                    }
                                  }
                                  updatePhoneNumberHandler(
                                    isValid,
                                    value,
                                    intlNumber,
                                    countryData
                                  );
                                  // console.log("Country Data: ", countryData);
                                  // console.log("Country Code Data: ", countryCode)
                                  // setCountryCode(countryData.iso2);
                                  // props.setCountryCode(countryData.iso2);
                                }}
                                onPhoneNumberBlur={(
                                  isValid,
                                  value,
                                  countryData,
                                  intlNumber
                                ) => {
                                  if (countryData.name == "Philippines") {
                                    setPhoneValidity(false);
                                    var regex =
                                      /((\+[0-9]{2})|0)[.\- ]?9[0-9]{2}[.\- ]?[0-9]{3}[.\- ]?[0-9]{4}/;
                                    if (
                                      intlNumber === "" ||
                                      !regex.test(intlNumber)
                                    ) {
                                      setPhoneValidity(false);
                                    } else {
                                      setPhoneValidity(true);
                                    }
                                  } else {
                                    // Adjust the regular expression for Pakistan phone numbers
                                    var regexPakistan =
                                      /((\+[0-9]{2})|0)[.\- ]?3[0-9]{2}[.\- ]?[0-9]{7}/;
                                    if (
                                      intlNumber === "" ||
                                      !regexPakistan.test(intlNumber)
                                    ) {
                                      setPhoneValidity(false);
                                    } else {
                                      setPhoneValidity(true);
                                    }
                                  }
                                }}
                              />
                            )}
                          </Col>
                          {!fourGiveLoader && !is4gives && isTez != 0 && (
                            <Col
                              style={{
                                alignSelf: "center",
                                margin: "0px",
                                padding: "0px",
                              }}
                              lg={5}
                              md={5}
                              sm={5}
                              xs={4}
                            >
                              <p
                                onClick={showHelpUsModalHandler}
                                className="blue-text howitworks pointer"
                              >
                                {is4gives ? (
                                  <>What is this used for?</>
                                ) : (
                                  <>Iska kya maqsad ha?</>
                                )}
                              </p>
                            </Col>
                          )}
                        </Row>
                      </div>
                    </div>
                    {/* <Upsell3 /> */}
                    {!is4gives && (
                      <div className="cashback-container">
                        {is4gives ? (
                          <>
                            Haasil karein{" "}
                            <span className="per-cashback">5% Cashback</span> 😍
                            Har dafa Installments timely waapis kar k!
                          </>
                        ) : (
                          <>
                            Har bar waqt per qisst ada karein aur haasil karain
                            5% pesay😍 wapis
                          </>
                        )}
                      </div>
                    )}
                    <div
                      onKeyPress={handleKeyPressHandler}
                      className="flex mb-20"
                      style={{ marginLeft: 20 }}
                    >
                      <Form.Check
                        className="text-16 font-regular"
                        id={`inline-${"radio"}-2`}
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                      <p
                        style={{ alignSelf: "center" }}
                        className="privacy-text"
                      >
                        {is4gives ? (
                          <>
                            Accept {poweredBy}'s
                            <a
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                color: "#18a0fb",
                              }}
                              onClick={() => setTermAndConditions(true)}
                              href="https://www.qisstpay.com/terms-conditions"
                              target="_blank"
                            >
                              {" "}
                              Terms of Service
                            </a>
                            .
                          </>
                        ) : (
                          <>
                            Mai {poweredBy} ki{" "}
                            <a
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                color: "#18a0fb",
                              }}
                              onClick={() => setTermAndConditions(true)}
                              href="https://www.qisstpay.com/terms-conditions"
                              target="_blank"
                            >
                              {" "}
                              sharaait o zawabit
                            </a>{" "}
                            se muttafiq houn
                          </>
                        )}
                      </p>
                    </div>
                    <div className="btn-container ">
                      <button
                        type="button"
                        disabled={
                          ["", null].includes(identityToken) ||
                          !phoneValidity ||
                          !acceptTerms ||
                          (mall_ID &&
                            mall_ID !== null &&
                            globalCartObject.length === 0)
                        }
                        className={
                          ["", null].includes(identityToken) ||
                          !phoneValidity ||
                          !acceptTerms ||
                          (mall_ID &&
                            mall_ID !== null &&
                            globalCartObject.length === 0)
                            ? "disable-btn"
                            : "basic-btn-new"
                        }
                        onClick={() => {
                          VerifyUser();
                        }}
                      >
                        {is4gives ? <>Checkout</> : <>Agla Step</>}
                      </button>
                      {/* {is4gives && is4gives === true && isTez !== 0 && (
                        <>
                          <button
                            disabled={
                              mall_ID !== null &&
                              globalCartObject.length === 0 &&
                              true
                            }
                            type="button"
                            // disabled={
                            //   ["", null].includes(identityToken) || !phoneValidity
                            // }
                            onClick={guestCheckoutHandler}
                            className="basic-outline-btn mt-20"
                          >
                            Guest Checkout
                          </button>
                        </>
                      )} */}

                      {is4gives && (
                        <p className="poweredQP">Powered by QisstPay</p>
                      )}
                      {error != "" && (
                        <div className="w-100 mt-10 flex align-center  number-err">
                          <img rel="preload" src="/assets/error.svg" />
                          <p className="pl-10 error-msg text-start">{error}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

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
            <HelpUsModal
              show={showHelpUs}
              handleClose={closeHelpUsModalHandler}
            />
          </div>
        </>
      )}
      {/* <div className="input-container-no-m mt-10 mb-50  no-border-radius  pointer">
        <div className="drop-container pointer">
          <div
            onClick={(e) => {
              setLoadOrder(!loadOrder);
            }}
            className="  align-center"
          >
            <Row>
              <Col className="align-self-center" xs={10} lg={10} md={10}>
                <p className="item-cart">Item Cart</p>
              </Col>

              <Col
                className="align-self-center"
                style={{ textAlign: "end" }}
                xs={2}
                lg={2}
                md={2}
              >
                <img
                  className={`${!loadOrder ? "loadLoader-arrow" : null}`}
                  src="/assets/arrow.svg"
                  width="24px"
                  height="24px"
                ></img>
              </Col>
            </Row>
          </div>
          {loadOrder && (
            <div className="mt-10 overflow-scroll promoCode-content">
              <Row>
                {lineItems &&
                  lineItems?.map((item) => (
                    <Row className="g-4">
                      <Col style={{ paddingRight: 0 }} xs={4} md={4} lg={4}>
                        <img
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "6px",
                          }}
                          src={item?.src}
                        ></img>
                      </Col>
                      <Col
                        className="flex align-center quantity-price-con"
                        xs={8}
                        md={8}
                        lg={8}
                      >
                        <div className="w-100">
                          <p className="item-text">{item?.name} </p>
                          <p
                            style={{ textAlign: "end" }}
                            className="text-14 price-text price-con"
                          >
                            <CurrencyFormat
                              value={
                                currency === "PKR"
                                  ? isNaN(Number(item?.unit_price))
                                    ? Number(totalAmount).toFixed(2)
                                    : Number(item?.unit_price).toFixed(2)
                                  : isNaN(Number(item?.unit_price))
                                  ? Number(totalAmount).toFixed(2)
                                  : Number(item?.unit_price).toFixed(2)
                              }
                              displayType={"text"}
                              thousandSeparator={true}
                              suffix={
                                currency === "PKR"
                                  ? ""
                                  : Number.isInteger(calculateTotalAmount()) ===
                                    true
                                  ? ".00"
                                  : ""
                              }
                              prefix={
                                currency === "PKR"
                                  ? getCurrencySymbol(currency) + " "
                                  : getCurrencySymbol(currency)
                              }
                            />
                          </p>
                          <div className="mt-10">
                            <p className="item-text">QTY: {item?.quantity}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ))}
              </Row>
            </div>
          )}
        </div>
      </div> */}
    </>
  );
};

export default PhonePage;
