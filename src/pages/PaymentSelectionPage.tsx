import React from "react";
import PaymentInstructionModal from "../components/modals/PaymentInstructionModal";
import { usePaymentSelectionHook } from "../hooks/custom/usePaymentSelection";
import { Container, Form, Row, Col, Modal } from "react-bootstrap";
import { Dna, RotatingLines } from "react-loader-spinner";
import { useContext, useEffect, useState } from "react";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { lazyLoad } from "../utils/loadable";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";
import CurrencyFormat from "react-currency-format";
import ProgressBar from "../components/progressBar/ProgressBar";
import "../styles/checkout.css";
import "../styles/paymentSelection.css";
import "../styles/signup.css";
import Cart from "../components/cart/cart";
import ShippingAddress from "../components/payment/shipping/shippingLocation";
import QisstpayMethodCard from "../components/payment/QisstpayMethodCardComponent";
import UpsellCard from "../components/payment/upsellCard";
import { checkBlockCitiesHelper } from "../utils/check-block-cities.helper";
import Helmet from "react-helmet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Wallet from "@mui/icons-material/Wallet";
import axios from "axios";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { Typography, Tooltip, Box, Button } from "@mui/material";
import { isEmpty } from "lodash";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { useLocation } from "react-router-dom";
import { GAMessages } from "../enums/GA-messages";
//import Skyflow from "skyflow-js";
const Globalcart = lazyLoad(() => import("../components/cart/Globalcart"));

const ShippingDetails = lazyLoad(
  () => import("../components/payment/ShippingDetailsComponent")
);

const Coupon = lazyLoad(() => import("../components/discount/coupons"));

const MethodCard = lazyLoad(
  () => import("../components/payment/MethodCardComponent")
);

const CardDetail = lazyLoad(
  () => import("../components/payment/CardDetailComponent")
);

const PaymentSelectionPage: React.FC = () => {
  const [show, setShow] = useState(false);
  const [cardId, setCardId] = useState("");
  const {
    states: {
      showInstructionModal,
      activeInstructionSlide,
      onLoad,
      loadCOD,
      loadCard,
      loadClover,
      loadCardPointe,
      otpPage,
      loadNift,
      loadDirectBank,
      loadEasyPaisa,
      loadVault,
      loadEasyPaisaDirect,
      loadForee,
      loadJazzCashC,
      loadSezzle,
      loadJazzCash,
      loadPayFast,
      loadGooglePay,
      loadPaypal,
      newRedirectURLAlfalah,
      loadAlfalah,
      loadUBL,
      loadQisstPay,
      payFastToggle,
      encrypted,
      others,
      hideGooglePay,
      loadKlarna,
      // loadAffirm,
      processingAmount,
      merchantPackageId,
      number,
      name,
      expiry,
      expiryValidated,
      phoneNumber,
      disable,
      qisstPay,
      merchantBusinessName,
      merchantLogo,
      codPackageID,
      paymentLimitError,
      halfAmountToPay,
      processingFee,
      loadAlfa,
      error,
      loadOrder,
      lineItems,
      cnic,
      jazzCashNumber,
      openModal,
      snippet,
      loadSquare,
      loadQisstPayInSix,
      loadQisstPayInThree,
      packageSelected,
      shippingAddress,
      addressChanged,
      merchantAccounts,
      merchantEmail,
      merchantPhone,
      upSellProducts,
      showUpSellModal,
      loadBrainTree,
      activeMethod,
      //loadUplift,
      wallet_Balance,
      loadNab,
      userID,
      loadBitPay,
      loadQisstPayInSixCC,
      loadQisstPayInThreeCC,
      loadQisstPayInTwelveCC,
      loadQisstPayInFourCC,
      loadPinWheel,
      //upliftVirtualCardAvailable,
      loadAuthorizeDotNet,
      orderID,
      sessionID,
      paymentAlfalah,
      showButton,
      customerCard,
      toggleButton,
      customerCardId,
      customerCardNumber,
      cardSelect,
      payFastOrderID,
      payFastOrderNumber,
      cardPackageID,
      TokenAvailableButton,
      expiryYear,
      //skyFlowCardID,
      //skyFlowPinID,
      loadQisstPayInTwo,
    },

    setStates: {
      setShowInstructionModal,
      setEncrypted,
      setLoadCOD,
      // setLoadAffirm,
      setLoadKlarna,
      setLoadCard,
      setLoadClover,
      setLoadCardPointe,
      setLoadPayPal,
      setLoadQisstPay,
      setCodPackageID,
      setOnLoad,
      setLoadQisstPayInSix,
      setWalletBalance,
      setLoadQisstPayInThree,
      setLoadQisstPayInFourCC,
      setLoadAlfa,
      setLoadUBL,
      setNewRedirectURLAlfalah,
      setLoadEasyPaisa,
      setLoadVault,
      setLoadEasyPaisaDirect,
      setLoadForee,
      setLoadJazzCashC,
      setLoadSezzle,
      setLoadJazzCash,
      setLoadPayFast,
      setProcessingAmount,
      setProcessingFee,
      setDirectBank,
      setMerchantPackageId,
      setLoadNift,
      setActiveMethod,
      setLoadAlfalah,
      setCvc,
      setCnic,
      setJazzCashNumber,
      setNumber,
      setName,
      setExpiry,
      setExpiryValidated,
      setPhoneNumber,
      setDisable,
      setEpNumberValidation,
      setError,
      setGooglePay,
      setAcceptTerms,
      setLoadOrder,
      setNewToken,
      setOpenModal,
      setLoadSquare,
      setPackageSelected,
      setAddressChanged,
      setShowUpSellModal,
      setLoadBrainTree,
      //setLoadUplift,
      setLoadNab,
      setLoadBitPay,
      setLoadPinWheel,
      //setUpliftVirtualCardAvailable,
      setLoadAuthorizeDotNet,
      setOrderID,
      setSessionID,
      setPayment,
      setShowButton,
      setCustomerCard,
      setToggleButton,
      setCustomerCardId,
      setCustomerCardNumber,
      setLoadQisstPayInTwelveCC,
      setCardSelect,
      setPayFastOrderID,
      setPayFastOrderNumber,
      setPayFastToggle,
      setCardPackageID,
      setTokenAvailableButton,
      setExpiryYear,
      //setSkyFlowCardID,
      //setSkyFlowPinID,
      setLoadQisstPayInTwo,
    },
    handlers: {
      closeInstructionModalHandler,
      nextSlideHandler,
      prevSlideHandler,
      qisstPaySelectionHandler,
      selectPaymentHandler,
      getLineItemsHandler,
      updateAmountHandler,
      requestOrderHandler,
      getPaymentMethodsHandler,
      deleteCustomerCard,
      getTaxesAndShippingHandler,
      squarePaymentCheckoutHandler,
      foreePaymentCheckoutHandler,
      jazzCashCPaymentCheckoutHandler,
      getShippingAddressHander,
      getUpSellHandler,
      completeOrderHandler,
      addToCartHandler,
      getBankListHandler,
      niftPaymentCheckoutHandler,
      //initUpliftHandler,
      //upliftPaymentMethodHandler,
      BigCommerceShippingMethods,
    },
  } = usePaymentSelectionHook();

  const {
    state: {
      //skyFlow,
      collectContainer,
      shippingValidate,
      shippingMethods,
      isGuest,
      totalAmount: price,
      currency,
      wordUrl,
      taxPrice,
      productsObj,
      isExistingUser,
      identityToken,
      token,
      buttonDisabled,
      countryCode,
      customerId,
      user_type,
      address,
      discountedAmount,
      shippingPrice,
      walletBalance,
      merchantWalletFeePercentage,
      merchantWalletIsEnabled,
      city,
      isTez,
      is4gives,
      MerchantUserId,
      cartSessionID,
      platForm_bigCommerce,
      walletToggleButtonCheck,
      GoogleAnalyticsCred,
      vaultPackageID,
      epValidation,
      is_headless,
      mall_ID,
      shipping_flag,
      globalCartObject,
      rudderStackID,
      placeOrderError,
      shippingdetailsAPI,
      paymentMethods,
      selectedMerchants,
      line_items,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const [mallPayMentScreenCheck, setMallPayMentScreenCheck] = useState(
    mall_ID === null ? true : true // mall make second true false
  );

  useEffect(() => {
    // --- Google Analytics --- //
    if (GoogleAnalyticsCred?.type === "UA") {
      console.log(
        "GoogleAnalyticsCred.tracking_id => ",
        GoogleAnalyticsCred?.tracking_id
      );
      ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
      ReactGA.event({
        category: "Page",
        action: GAMessages.PAYMENT_PAGE,
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
        action: GAMessages.PAYMENT_PAGE,
      });
    }
    // --- Google Analytics End --- //
  }, [GoogleAnalyticsCred]);

  const history = useHistory();
  //console.log("emial");
  //console.log(emailValidated);

  // useEffect(() => {
  //   // @ts-ignore:next-line
  //   // nid("stateChange", "payment-selection");
  // }, []);

  useEffect(() => {
    if (platForm_bigCommerce?.toLocaleUpperCase() === "BIGCOMMERCE") {
      // shippingAddress.filter((it: any) => it.is_default === true).map((item: any) => {
      //   console.log('Item ====> ', item)
      // })
      for (let i = 0; i < shippingAddress.length; i++) {
        if (shippingAddress[i].is_default === true) {
          console.log("Shipping Address ====>", shippingAddress[i]);
          if (
            shippingAddress[i].country.toLocaleUpperCase() === "UNITED STATES"
          ) {
            BigCommerceShippingMethods("US");
          } else {
            BigCommerceShippingMethods("PK");
          }
        }
      }
      // console.log('Platform ====> ', platForm_bigCommerce)
      // console.log('Shipping Address ====> ', shippingAddress)
    } else {
    }
  }, []);
  // const [trackingDone, setTrackingDone] = useState(false);
  // useEffect(() => {
  //   // Check if the error includes the specific message and tracking hasn't been done
  //   if (error && error.includes("failed to create order") && !trackingDone) {
  //     // Track the error

  //     // Set trackingDone to true to ensure it doesn't happen again
  //     setTrackingDone(true);
  //   }
  // }, [error, trackingDone]);

  useEffect(() => {
    // (global as any).affirm.checkout({
    //   merchant: {
    //     user_confirmation_url: "http://localhost:3000/success",
    //     user_cancel_url: "http://localhost:3000/failure",
    //     user_confirmation_url_action: "POST",
    //     name: "Your Customer-Facing Merchant Name",
    //   },
    //   shipping: {
    //     name: {
    //       first: "Joe",
    //       last: "Doe",
    //     },
    //     address: {
    //       line1: "633 Folsom St",
    //       line2: "Floor 7",
    //       city: "San Francisco",
    //       state: "CA",
    //       zipcode: "94107",
    //       country: "USA",
    //     },
    //     phone_number: "4153334567",
    //     email: "joedoe@123fakestreet.com",
    //   },
    //   billing: {
    //     name: {
    //       first: "Joe",
    //       last: "Doe",
    //     },
    //     address: {
    //       line1: "633 Folsom St",
    //       line2: "Floor 7",
    //       city: "San Francisco",
    //       state: "CA",
    //       zipcode: "94107",
    //       country: "USA",
    //     },
    //     phone_number: "4153334567",
    //     email: "joedoe@123fakestreet.com",
    //   },
    //   items: [
    //     {
    //       display_name: "Awesome Pants",
    //       sku: "ABC-123",
    //       unit_price: 1999,
    //       qty: 3,
    //       item_image_url: "http://merchantsite.com/images/awesome-pants.jpg",
    //       item_url: "http://merchantsite.com/products/awesome-pants.html",
    //       categories: [
    //         ["Home", "Bedroom"],
    //         ["Home", "Furniture", "Bed"],
    //       ],
    //     },
    //   ],
    //   discounts: {
    //     RETURN5: {
    //       discount_amount: 500,
    //       discount_display_name: "Returning customer 5% discount",
    //     },
    //     PRESDAY10: {
    //       discount_amount: 1000,
    //       discount_display_name: "President's Day 10% off",
    //     },
    //   },
    //   metadata: {
    //     shipping_type: "UPS Ground",
    //     mode: "modal",
    //   },
    //   order_id: "JKLMO4321",
    //   currency: "USD",
    //   financing_program: "flyus_3z6r12r",
    //   shipping_amount: 1000,
    //   tax_amount: 500,
    //   total: 100000,
    // });
    //get token and decode it

    const search = window.location.search;

    const params = new URLSearchParams(search);
    getBankListHandler();
    if (window.location.pathname == "/failure") {
      const token = params.get("token")!;
      const tracking = params.get("tracking_id")!;
      // const identityToken = params.get("identity-token")!;

      setNewToken(token ?? "");

      const postData = {
        tracking_id: tracking,
      };
      console.log("effect");
      requestOrderHandler(tracking, token);
    } else {
      let tkn: any = localStorage.getItem("JWTtoken");
      let iid: any = localStorage.getItem("JWTid");
      if (is_headless === "1" && mall_ID !== null) {
        console.log("Else 1 called");
        getShippingAddressHander(customerId, token);
        getPaymentMethodsHandler(token, identityToken, price, customerId);
        // if (!shippingPrice || shippingPrice === "0" || shippingPrice === 0) {
        //   getTaxesAndShippingHandler(token, identityToken, customerId, price);
        // }
        getUpSellHandler(identityToken);
      }
      if (
        is_headless === "1" &&
        mall_ID === null &&
        tkn !== "null" &&
        iid !== "null"
      ) {
        // console.log("Tkn: ", tkn);
        // console.log("iid: ", iid);
        // console.log("mall_ID: ", mall_ID);
        // console.log("Else 2 called");
        getShippingAddressHander(iid, tkn);
        getPaymentMethodsHandler(tkn, identityToken, price, iid);
        // if (!shippingPrice || shippingPrice === "0" || shippingPrice === 0) {
        //   getTaxesAndShippingHandler(tkn, identityToken, iid, price);
        // }
        getUpSellHandler(identityToken);
      } else {
        getShippingAddressHander(customerId, token);
        getPaymentMethodsHandler(token, identityToken, price, customerId);
        // if (!shippingPrice || shippingPrice == "0" || shippingPrice == 0) {
        //   if (
        //     token !== "" &&
        //     identityToken !== "" &&
        //     customerId !== "" &&
        //     price !== 0
        //   )
        //     getTaxesAndShippingHandler(token, identityToken, customerId, price);
        // }
        getUpSellHandler(identityToken);
      }
      if (
        is_headless === null &&
        mall_ID === null &&
        tkn === "null" &&
        iid === "null"
      ) {
        console.log("Else 4 called");
        getShippingAddressHander(customerId, token);
        getPaymentMethodsHandler(token, identityToken, price, customerId);
        // if (!shippingPrice || shippingPrice == "0" || shippingPrice == 0) {
        //   getTaxesAndShippingHandler(token, identityToken, customerId, price);
        // }
        getUpSellHandler(identityToken);
      }
    }
  }, []);
  // useEffect(() => {
  // if (addressChanged) {
  //   //   if (!shippingPrice || shippingPrice === "0" || shippingPrice === 0) {
  //   getTaxesAndShippingHandler(token, identityToken, customerId, price);
  // }
  // }

  // }, [selectedMerchants]);

  // useEffect(() => {
  //   const script = document.createElement('script')
  //   script.src = "https://test-bankalfalah.gateway.mastercard.com/checkout/version/54/checkout.js"
  //   script.type = 'text/javascript';
  //   script.async = true;
  //   script.setAttribute('data-complete', "https://stage.apis.qisstpay.com/order-service/call_back?payment_gateway=alfalah")
  //   // Add script to document body
  //   document.body.appendChild(script);
  // }, [])

  useEffect(() => {
    if (productsObj != null) {
      getLineItemsHandler(productsObj);
    }
  }, [productsObj]);
  useEffect(() => {
    updateStateHandler({
      payload: {
        placeOrderError: error,
      },
    });
  }, [error]);
  useEffect(() => {
    if (openModal) {
      var checkoutContainer = document.getElementById("my-checkout-container");
      if (checkoutContainer) {
        checkoutContainer.innerHTML = snippet;
        var scriptsTags = checkoutContainer.getElementsByTagName("script");
        // This is necessary otherwise the scripts tags are not going to be evaluated
        for (var i = 0; i < scriptsTags.length; i++) {
          var parentNode = scriptsTags[i].parentNode!;
          var newScriptTag = document.createElement("script");
          newScriptTag.type = "text/javascript";
          newScriptTag.text = scriptsTags[i].text;
          parentNode.removeChild(scriptsTags[i]);
          parentNode.appendChild(newScriptTag);
        }
      }
    }
  }, [openModal]);

  useEffect(() => {
    if (price) {
      if (packageSelected === "PAY_IN_4") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          4
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_4",
          },
        });
      } else if (packageSelected === "PAY_IN_6") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          6
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_6",
          },
        });
      } else if (packageSelected === "PAY_IN_3") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          3
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_3",
          },
        });
      } else if (packageSelected === "PAY_IN_2") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          2
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_2",
          },
        });
      } else if (activeMethod === "PAYFAST" && packageSelected === "") {
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAYFAST",
          },
        });
      } else if (packageSelected === "PAY_IN_6_CC") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          6
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_6_CC",
          },
        });
      } else if (packageSelected === "PAY_IN_4_CC") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          4
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_4_CC",
          },
        });
      } else if (packageSelected === "PAY_IN_12_CC") {
        updateAmountHandler(
          Number(price) + Number(taxPrice) + Number(shippingPrice),
          12
        );
        updateStateHandler({
          payload: {
            packageSelectedQP: "PAY_IN_12_CC",
          },
        });
      }
    }
  }, [packageSelected, encrypted?.total_amount]);

  // const callAlfalah = async () => {
  //   console.log(sessionID, orderID, paymentAlfalah);

  //   let jSon = {
  //     merchant: 'TESTQISSTPAY1',//merchant ID
  //     session: {
  //       id: sessionID
  //     },
  //     order: {
  //       amount: paymentAlfalah,
  //       currency: 'PKR',
  //       description: 'Ordered goods',
  //       id: orderID
  //     },
  //     interaction: {
  //       operation: 'PURCHASE', // set this field to 'PURCHASE' for <<checkout>> to perform a Pay Operation.
  //       merchant: {
  //         name: 'Bank Alfalah',
  //         address: {
  //           line1: '200 Sample St',
  //           line2: '1234 Example Town'
  //         }
  //       }
  //     }
  //   };
  //   await (window as any).Checkout.configure(
  //     jSon
  //   )
  //     (window as any).Checkout.showPaymentPage();
  // }

  const [timerAlfalahURL, setTimerAlfalahURL] = useState<number>(0);
  const [alfalahURL, setAlfalahURL] = useState<any>("");
  const urlParams = new URLSearchParams(wordUrl);
  const shippingTootal = Number(urlParams.get("shipping_total"));
  const wordTax = Number(urlParams.get("tax"));
  useEffect(() => {
    console.log(selectedMerchants, "testing glitch");
  }, [selectedMerchants]);
  const handleButtonClick = () => {
    if (shippingTootal == 0 && wordTax == 0) {
      if (
        line_items.length != selectedMerchants.length ||
        shippingTootal == 0
      ) {
        if (line_items.length != selectedMerchants.length) {
          if (
            shippingdetailsAPI[0]?.data?.length == 0 ||
            shippingdetailsAPI.length == 0
          ) {
            setError("");
            if (cardSelect) {
              setOnLoad(true);
              completeOrderHandler("TOKEN_CARD", cardPackageID.toString(), "");
            } else {
              if (loadCard === true && isGuest === false) {
                selectPaymentHandler();
              } else {
                selectPaymentHandler();
              }
            }
          } else {
            console.log(
              selectedMerchants,
              shippingdetailsAPI,
              "second cond truee"
            );
            if (
              selectedMerchants.length ==
              shippingdetailsAPI[0].data.length
            ) {
              setError("");
              if (cardSelect) {
                setOnLoad(true);
                completeOrderHandler(
                  "TOKEN_CARD",
                  cardPackageID.toString(),
                  ""
                );
              } else {
                if (loadCard === true && isGuest === false) {
                  selectPaymentHandler();
                } else {
                  selectPaymentHandler();
                } 
              }
            } else {
              setError("Please Select Shipping");
              setOnLoad(false);
              setDisable(false);
            }
          }
        } else {
          setError("");
          if (cardSelect) {
            setOnLoad(true);
            completeOrderHandler("TOKEN_CARD", cardPackageID.toString(), "");
          } else {
            if (loadCard === true && isGuest === false) {
              selectPaymentHandler();
            } else {
              selectPaymentHandler();
            }
          }
        }
      } else {
        setError("");
        if (cardSelect) {
          setOnLoad(true);
          completeOrderHandler("TOKEN_CARD", cardPackageID.toString(), "");
        } else {
          if (loadCard === true && isGuest === false) {
            selectPaymentHandler();
          } else {
            selectPaymentHandler();
          }
        }
      }
    } else {
      setError("");
      if (cardSelect) {
        setOnLoad(true);
        completeOrderHandler("TOKEN_CARD", cardPackageID.toString(), "");
      } else {
        if (loadCard === true && isGuest === false) {
          selectPaymentHandler();
        } else {
          selectPaymentHandler();
        }
      }
    }
  };

  useEffect(() => {
    if (alfalahURL === "" || alfalahURL == null || alfalahURL === undefined) {
      setTimeout(() => {
        setTimerAlfalahURL((count) => count + 1);
        setAlfalahURL(window.localStorage.getItem("alfalahRedirectURL"));
      }, 5000);
    } else {
      window.localStorage.removeItem("alfalahRedirectURL");
      const a = document.createElement("a");
      a.href = alfalahURL;
      a.click();
    }
    // console.log("LocalStorage Timer: ", timerAlfalahURL);
  }, [timerAlfalahURL]);
  const handleClose = () => setShow(false);
  const handleShow = (id: any) => (setShow(true), setCardId(id));
  const handleCardDelete = (cardId: string | number) => {
    deleteCustomerCard(token, customerId, cardId);
    handleClose();
  };

  useEffect(() => {}, [customerCard]);
  const handleSelectedCard = (
    id: any,
    cardNumber: any,
    month: any,
    year: any
  ) => {
    // --- Google Analytics --- //
    if (GoogleAnalyticsCred?.type === "UA") {
      console.log(
        "GoogleAnalyticsCred.tracking_id => ",
        GoogleAnalyticsCred?.tracking_id
      );
      ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
      ReactGA.event({
        category: "Page",
        action: GAMessages.GATEWAY_SELECTED,
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
        action: GAMessages.GATEWAY_SELECTED,
      });
    }
    // --- Google Analytics End --- //

    setCardSelect(true);
    setDisable(false);
    setCustomerCardId(id);
    setCustomerCardNumber(cardNumber);
    setLoadCOD(false);
    setLoadCard(false);
    setLoadClover(false);
    setLoadEasyPaisa(false);
    setLoadVault(false);
    setLoadAlfalah(false);
    setLoadQisstPayInTwo(false);
    setLoadQisstPayInThree(false);
    setLoadQisstPayInSix(false);
    setLoadQisstPayInFourCC(false);
    setLoadQisstPayInTwelveCC(false);
    setActiveMethod("tokenize customer cards");
    setLoadQisstPay(false);
    setProcessingFee("");
    setLoadPayPal(false);
    setLoadCardPointe(false);
    setLoadEasyPaisaDirect(false);
    setDirectBank(false);
    setLoadKlarna(false);
    // setLoadAffirm(false);
    setLoadSquare(false);
    setLoadForee(false);
    setLoadJazzCashC(false);
    setLoadPayFast(false);
    setLoadAlfa(false);
    setLoadUBL(false);
    setLoadSezzle(false);
    setLoadJazzCash(false);
    setLoadNift(false);
    //setLoadUplift(false);
    setLoadNab(false);
    setLoadBrainTree(false);
    setLoadBitPay(false);
    setLoadPinWheel(false);
    //setUpliftVirtualCardAvailable(false);
    setLoadAuthorizeDotNet(false);
  };
  useEffect(() => {
    // console.log(
    //   "================================================== ACTIVE METHOD:",
    //   packageSelected
    // );

    if (merchantWalletIsEnabled === true) {
      const URL =
        process.env.REACT_APP_GET_WALLET_BALANCE +
        customerId +
        "/balance?occ=true";
      try {
        axios
          .get(URL, {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Accept-Language": "en-US,en;q=0.9",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              user_id: `${customerId}`,
            },
          })
          .then((response: any) => {
            setWalletBalance(Number(response.data.body.balance));
            // setWalletBalance(0)
            updateStateHandler({
              payload: {
                walletBalance: Number(response.data.body.balance),
              },
            });
            // updateStateHandler({
            //   payload: {
            //     walletBalance: Number('0'),
            //   },
            // })
            // console.log(
            //   "==========================================",
            //   Number(response.data.body.balance)
            // );
          })
          .catch((error: any) => {
            console.log("========================================", error);
          });
      } catch (error) {
        console.log(
          "=========================================== WALLET ERROR: ",
          error
        );
      }
    }
  }, []);

  useEffect(() => {
    setToggleButton(false);
    updateStateHandler({
      payload: {
        walletToggleButtonCheck: "FALSE",
      },
    });
  }, []);

  const [Bol, setBol] = useState<any>("1");
  const [Lock, setLock] = useState<any>(false);
  const [vaultEnable, setVaultEnable] = useState<boolean>(false);
  useEffect(() => {
    others.map((item: any) => {
      {
        /*console.log(
          "item.package.package_name.toLocaleUpperCase() === ",
          item.package.package_name.toLocaleUpperCase() === "UPLIFT"
        );*/
      }
      if (
        item.package.package_name.toLocaleUpperCase() === "UPLIFT" &&
        Bol !== true
      ) {
        setBol(true);
        setLock(true);
      } else {
        if (Lock !== true) setBol(false);
      }

      if (item.package.package_name.toLocaleUpperCase() === "VAULT") {
        setVaultEnable(true);
      }
    });
  }, [Bol, others]);

  /*useEffect(() => {
    const url: any = process.env.REACT_APP_SKYFLOW_URL;
    let skyFlow: any;
    let collectContainer: any;
    skyFlow = Skyflow.init({
      vaultID: process.env.REACT_APP_SKYFLOW_VAULT_ID,
      vaultURL: process.env.REACT_APP_SKYFLOW_VAULT_URL,

      getBearerToken: () => {
        return new Promise((resolve, reject) => {
          axios
            .get(url)
            .then((response: any) => {
              // console.log(response)
              resolve(response.data.BearerToken);
            })
            .catch((error: any) => {
              // console.log(error)
              reject("Some Error occurred while fetching Bearer Token!");
            });
        });
      },
      options: {
        logLevel: Skyflow.LogLevel.ERROR,
        env: Skyflow.Env.PROD,
      },
    });
    collectContainer = skyFlow.container(Skyflow.ContainerType.COLLECT);

    updateStateHandler({
      payload: {
        collectContainer: collectContainer,
        skyFlow: skyFlow,
      },
    });
    // await collectContainer.collect().then((res: any) => {
    //   console.log(res)
    // }).catch((error: any) => {
    //   console.log(error);
    // })
  }, []);

  const callSkyFlow = async () => {};*/
  const handleClick = () => {
    // Track analytics event
    (global as any).rudderanalytics?.track(
      "back_button_click_payment",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchantId: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    if (mall_ID === null) {
      history.goBack();
    } else if (mallPayMentScreenCheck === true) {
      setMallPayMentScreenCheck(false);
      updateStateHandler({
        payload: {
          backButtonClickedEmailOtp: true,
          cardSelect: false,
          activeMethod: "",
          disable: false,
        },
      });
    }
  };
  return (
    <>
      <Container className="center-box">
        <div className="">
          <div className="flex-box">
            <div className="checkout-container pb-20 bg-checkout relative">
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
              <ProgressBar from="paymentMethod" />

              {/* onClick={() => setShowInstructionModal(true)} */}
              <div className="">
                <div className="mt-20">
                  <div className="flex">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Box display={"flex"} flexDirection="column">
                          <p className="phoneScreenText mb-10 text-20">
                            {isExistingUser === true && (
                              <>
                                <ArrowBackIcon
                                  sx={{
                                    marginRight: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleClick()}
                                />
                              </>
                            )}
                            {mall_ID !== null ? "Review and Pay" : "Payment"}
                          </p>

                          <p className="phone-sm-text mb-10">
                            {is4gives ? (
                              <>
                                Select your payment method, all transactions are
                                secure and encrypted.
                              </>
                            ) : (
                              <>
                                Peson ki adaygi k tareeqay ka intekhab kijiye,
                                aapki tamam maloomat mehfooz rahein geen{" "}
                              </>
                            )}
                          </p>
                        </Box>

                        {mall_ID !== null && (
                          <img src="/assets/pci.svg" alt="pci" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drop down Components */}
              {/* {mall_ID === null && ( */}
              <ShippingAddress
                setEncrypted={setEncrypted}
                encrypted={encrypted}
                address={address}
                shippingAddress={shippingAddress}
                setAddressChanged={setAddressChanged}
                setError={setError}
              />
              {/* )} */}

              {/* mall make this uncommented and remove upper comments */}

              {/* {mall_ID !== null && !mallPayMentScreenCheck && (
                <ShippingAddress
                  setEncrypted={setEncrypted}
                  encrypted={encrypted}
                  address={address}
                  shippingAddress={shippingAddress}
                  setAddressChanged={setAddressChanged}
                  setError={setError}
                />
              )} */}

              {others[0]?.package?.package_name !== "Payfast" &&
                !paymentLimitError &&
                mallPayMentScreenCheck === true && (
                  <>
                    {/* Wallet */}
                    {others.map((methods: any) => {
                      if (
                        methods.package.package_name === "Vault" &&
                        isExistingUser === true &&
                        isGuest === false
                      ) {
                        return (
                          <div
                            className={`methods-container ${
                              mallPayMentScreenCheck !== true ? "" : "mt-20"
                            } p-3`}
                          >
                            <Row>
                              <Col className="col-8 text-start">
                                <p className="fw-bold">
                                  <Wallet
                                    sx={{
                                      marginTop: "-2px",
                                      cursor: "pointer",
                                    }}
                                  />{" "}
                                  Use Vault Q-Points
                                </p>
                                <p className="order-text mt-1 ms-1">
                                  {wallet_Balance === 0
                                    ? "You are out of balance."
                                    : "Available " +
                                      Math.round(Number(wallet_Balance))}
                                </p>
                              </Col>

                              <Col className="col-4 mt-1 justify-content-end text-end">
                                {wallet_Balance === 0 ? (
                                  ""
                                ) : (
                                  <>
                                    <BootstrapSwitchButton
                                      onstyle="success"
                                      offstyle="secondary"
                                      onChange={(checked: boolean) => {
                                        console.log(
                                          "======================= BUTTON CHECKED: ",
                                          checked
                                        );
                                        setToggleButton(checked);
                                        updateStateHandler({
                                          payload: {
                                            walletToggleButtonCheck:
                                              checked === true
                                                ? "TRUE"
                                                : "FALSE",
                                          },
                                        });
                                      }}
                                    />
                                  </>
                                )}
                              </Col>
                            </Row>
                          </div>
                        );
                      }
                    })}

                    {/* Others 0 */}
                    {vaultEnable === true &&
                    merchantWalletIsEnabled === true &&
                    isGuest === false &&
                    Number(walletBalance) === 0 ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /* setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadClover={setLoadClover}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /* upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}

                          <div className="">
                            {qisstPay.length > 0 &&
                              !paymentLimitError &&
                              qisstPay.map((pack: any) => (
                                <QisstpayMethodCard
                                  qisstPaySelectionHandler={
                                    qisstPaySelectionHandler
                                  }
                                  loadQisstPay={loadQisstPay}
                                  loadQisstPayInSixCC={loadQisstPayInSixCC}
                                  loadQisstPayInFourCC={loadQisstPayInFourCC}
                                  loadQisstPayInThreeCC={loadQisstPayInThreeCC}
                                  loadQisstPayInTwelveCC={
                                    loadQisstPayInTwelveCC
                                  }
                                  loadQisstPayInSix={loadQisstPayInSix}
                                  loadQisstPayInThree={loadQisstPayInThree}
                                  loadQisstPayInTwo={loadQisstPayInTwo}
                                  encrypted={encrypted}
                                  setNumber={setNumber}
                                  setCvc={setCvc}
                                  merchantLogo={merchantLogo}
                                  merchantBusinessName={merchantBusinessName}
                                  setName={setName}
                                  setExpiry={setExpiry}
                                  payIn3Amount={processingAmount}
                                  setExpiryValidated={setExpiryValidated}
                                  setAcceptTerms={setAcceptTerms}
                                  onClickViewPaymentPlan={() => {}}
                                  halfAmountToPay={halfAmountToPay}
                                  processingFee={(price / 100) * processingFee}
                                  method={pack}
                                  prodPrice={price}
                                  packageSelected={packageSelected}
                                  paymentLimitError={paymentLimitError}
                                  is4gives={is4gives}
                                  prodsObj={
                                    encrypted?.line_items ?? productsObj
                                  }
                                  setCardSelect={setCardSelect}
                                  cardSelect={cardSelect}
                                  toggleVault={toggleButton}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Others 1 */}
                    {vaultEnable === true &&
                    merchantWalletIsEnabled === true &&
                    isGuest === false &&
                    Number(walletBalance) > 0 &&
                    Number(walletBalance) <
                      Number(price) +
                        Number(taxPrice) +
                        (Number(price) / 100) * Number(processingFee) +
                        Number(shippingPrice) -
                        Number(discountedAmount) ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*PaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}

                          <div className="">
                            {qisstPay.length > 0 &&
                              !paymentLimitError &&
                              qisstPay.map((pack: any) => (
                                <QisstpayMethodCard
                                  qisstPaySelectionHandler={
                                    qisstPaySelectionHandler
                                  }
                                  loadQisstPay={loadQisstPay}
                                  loadQisstPayInSixCC={loadQisstPayInSixCC}
                                  loadQisstPayInFourCC={loadQisstPayInFourCC}
                                  loadQisstPayInThreeCC={loadQisstPayInThreeCC}
                                  loadQisstPayInTwelveCC={
                                    loadQisstPayInTwelveCC
                                  }
                                  loadQisstPayInSix={loadQisstPayInSix}
                                  loadQisstPayInThree={loadQisstPayInThree}
                                  loadQisstPayInTwo={loadQisstPayInTwo}
                                  encrypted={encrypted}
                                  setNumber={setNumber}
                                  setCvc={setCvc}
                                  merchantLogo={merchantLogo}
                                  merchantBusinessName={merchantBusinessName}
                                  setName={setName}
                                  setExpiry={setExpiry}
                                  payIn3Amount={processingAmount}
                                  setExpiryValidated={setExpiryValidated}
                                  setAcceptTerms={setAcceptTerms}
                                  onClickViewPaymentPlan={() => {}}
                                  halfAmountToPay={halfAmountToPay}
                                  processingFee={(price / 100) * processingFee}
                                  method={pack}
                                  prodPrice={price}
                                  packageSelected={packageSelected}
                                  paymentLimitError={paymentLimitError}
                                  is4gives={is4gives}
                                  prodsObj={
                                    encrypted?.line_items ?? productsObj
                                  }
                                  setCardSelect={setCardSelect}
                                  cardSelect={cardSelect}
                                  toggleVault={toggleButton}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Others 2 */}
                    {vaultEnable === true &&
                    merchantWalletIsEnabled === true &&
                    isGuest === false &&
                    toggleButton === false &&
                    Number(walletBalance) > 0 &&
                    Number(walletBalance) >
                      Number(price) +
                        Number(taxPrice) +
                        (Number(price) / 100) * Number(processingFee) +
                        Number(shippingPrice) -
                        Number(discountedAmount) ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Others 4 => Guest Case */}
                    {vaultEnable === true && isGuest === true ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {vaultEnable !== true && isGuest === true ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*PaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {vaultEnable !== true && isGuest === false ? (
                      <>
                        {customerCard ? (
                          <Box className="methods-container" marginTop={"20px"}>
                            {customerCard?.creditCards?.map((data: any) => {
                              return (
                                <>
                                  <Box
                                    padding="10px 10px"
                                    display={"flex"}
                                    justifyContent="space-between"
                                    alignItems={"center"}
                                    onClick={() =>
                                      handleSelectedCard(
                                        data?.id,
                                        data?.cardNumber,
                                        data?.expMonth,
                                        data?.expYear
                                      )
                                    }
                                  >
                                    <Box display={"flex"} alignItems="center">
                                      <Box display={"flex"} alignItems="center">
                                        <img
                                          style={{ marginRight: "14px" }}
                                          src={
                                            data?.id == customerCardId &&
                                            cardSelect
                                              ? "/assets/filled.png"
                                              : "/assets/unchecked.png"
                                          }
                                          alt="radio_image"
                                        />

                                        {data.cardForm === "Visa" ? (
                                          <img
                                            src="/assets/visa.png"
                                            alt="visa"
                                            height="50px"
                                            width={"52px"}
                                          />
                                        ) : (
                                          <img
                                            src="/assets/mastercard.svg"
                                            alt="master"
                                            height="30px"
                                          />
                                        )}
                                      </Box>
                                      <Typography sx={{ ml: "20px" }}>
                                        ****{data?.cardNumber} <br /> Expires{" "}
                                        {data.expMonth}/{data.expYear}
                                      </Typography>
                                      {data?.defaultCheck && (
                                        <Box
                                          sx={{
                                            border: "1px solid #000",
                                            marginLeft: "20px",
                                            borderRadius: "20px",
                                            padding: "2px 10px",
                                          }}
                                        >
                                          <Typography>Active Card</Typography>
                                        </Box>
                                      )}
                                    </Box>
                                    <Tooltip
                                      title={
                                        data?.defaultCheck === true
                                          ? "Default card cannnot be deleted"
                                          : ""
                                      }
                                    >
                                      <Box display={"flex"}>
                                        <Button
                                          sx={{
                                            backgroundColor: "#F9FAFB",
                                            width: "59px",
                                            color: "#374151",
                                            fontSize: "12px",
                                            height: "28px",
                                          }}
                                          onClick={() => handleShow(data?.id)}
                                          disabled={
                                            data.defaultCheck === true
                                              ? true
                                              : false
                                          }
                                        >
                                          Delete
                                        </Button>

                                        <Modal
                                          id="deleteModal"
                                          show={show}
                                          onHide={handleClose}
                                          // size="xs"
                                          centered
                                        >
                                          <Modal.Body
                                            style={{ maxHeight: "60pt" }}
                                          >
                                            <p>
                                              Are you sure you want to delete
                                              card ****
                                              {data.cardNumber}?
                                            </p>

                                            <p>{error && error}</p>
                                          </Modal.Body>
                                          <Modal.Footer>
                                            <Button
                                              onClick={handleClose}
                                              className="cancelBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                                marginRight: "20px",
                                              }}
                                            >
                                              No
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleCardDelete(cardId)
                                              }
                                              className="deleteBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                              }}
                                            >
                                              Yes
                                            </Button>
                                          </Modal.Footer>
                                        </Modal>
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                  <hr style={{ margin: 0 }} />
                                </>
                              );
                            })}
                            {customerCard?.debitCards?.map((data: any) => {
                              return (
                                <>
                                  <Box
                                    padding="10px 10px"
                                    display={"flex"}
                                    justifyContent="space-between"
                                    alignItems={"center"}
                                    onClick={() =>
                                      handleSelectedCard(
                                        data?.id,
                                        data?.cardNumber,
                                        data?.expMonth,
                                        data?.expYear
                                      )
                                    }
                                  >
                                    <Box display={"flex"} alignItems="center">
                                      <Box>
                                        <img
                                          style={{ marginRight: "14px" }}
                                          src={
                                            data?.id == customerCardId &&
                                            cardSelect
                                              ? "/assets/filled.png"
                                              : "/assets/unchecked.png"
                                          }
                                          alt="radio_image"
                                        />

                                        {data.cardForm === "Visa" ? (
                                          <img
                                            src="/assets/visa.png"
                                            alt="visa"
                                            height="50px"
                                            width={"52px"}
                                          />
                                        ) : (
                                          <img
                                            src="/assets/mastercard.svg"
                                            alt="master"
                                            height="30px"
                                          />
                                        )}
                                      </Box>
                                      <Typography sx={{ ml: "20px" }}>
                                        ****{data?.cardNumber} <br /> Expires{" "}
                                        {data.expMonth}/{data.expYear}
                                      </Typography>
                                      {data?.defaultCheck && (
                                        <Box
                                          sx={{
                                            border: "1px solid #000",
                                            marginLeft: "20px",
                                            borderRadius: "20px",
                                            padding: "2px 10px",
                                          }}
                                        >
                                          <Typography>Active Card</Typography>
                                        </Box>
                                      )}
                                    </Box>
                                    <Tooltip
                                      title={
                                        data?.defaultCheck === true
                                          ? "Default card cannnot be deleted"
                                          : ""
                                      }
                                    >
                                      <Box display={"flex"}>
                                        <Button
                                          sx={{
                                            backgroundColor: "#F9FAFB",
                                            width: "59px",
                                            color: "#374151",
                                            fontSize: "12px",
                                            height: "28px",
                                          }}
                                          onClick={() => handleShow(data?.id)}
                                          disabled={
                                            data.defaultCheck === true
                                              ? true
                                              : false
                                          }
                                        >
                                          Delete
                                        </Button>

                                        <Modal
                                          id="deleteModal"
                                          show={show}
                                          onHide={handleClose}
                                          // size="xs"
                                          centered
                                        >
                                          <Modal.Body
                                            style={{ maxHeight: "60pt" }}
                                          >
                                            <p>
                                              Are you sure you want to delete
                                              card ****
                                              {data.cardNumber}?
                                            </p>

                                            <p>{error && error}</p>
                                          </Modal.Body>
                                          <Modal.Footer>
                                            <Button
                                              onClick={handleClose}
                                              className="cancelBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                                marginRight: "20px",
                                              }}
                                            >
                                              No
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleCardDelete(cardId)
                                              }
                                              className="deleteBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                              }}
                                            >
                                              Yes
                                            </Button>
                                          </Modal.Footer>
                                        </Modal>
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                  <hr style={{ margin: 0 }} />
                                </>
                              );
                            })}
                          </Box>
                        ) : (
                          ""
                        )}

                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*VirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}

                          <div className="">
                            {qisstPay.length > 0 &&
                              !paymentLimitError &&
                              qisstPay.map((pack: any) => (
                                <QisstpayMethodCard
                                  qisstPaySelectionHandler={
                                    qisstPaySelectionHandler
                                  }
                                  loadQisstPay={loadQisstPay}
                                  loadQisstPayInSixCC={loadQisstPayInSixCC}
                                  loadQisstPayInFourCC={loadQisstPayInFourCC}
                                  loadQisstPayInThreeCC={loadQisstPayInThreeCC}
                                  loadQisstPayInTwelveCC={
                                    loadQisstPayInTwelveCC
                                  }
                                  loadQisstPayInSix={loadQisstPayInSix}
                                  loadQisstPayInThree={loadQisstPayInThree}
                                  loadQisstPayInTwo={loadQisstPayInTwo}
                                  encrypted={encrypted}
                                  setNumber={setNumber}
                                  setCvc={setCvc}
                                  merchantLogo={merchantLogo}
                                  merchantBusinessName={merchantBusinessName}
                                  setName={setName}
                                  setExpiry={setExpiry}
                                  payIn3Amount={processingAmount}
                                  setExpiryValidated={setExpiryValidated}
                                  setAcceptTerms={setAcceptTerms}
                                  onClickViewPaymentPlan={() => {}}
                                  halfAmountToPay={halfAmountToPay}
                                  processingFee={(price / 100) * processingFee}
                                  method={pack}
                                  prodPrice={price}
                                  packageSelected={packageSelected}
                                  paymentLimitError={paymentLimitError}
                                  is4gives={is4gives}
                                  prodsObj={
                                    encrypted?.line_items ?? productsObj
                                  }
                                  setCardSelect={setCardSelect}
                                  cardSelect={cardSelect}
                                  toggleVault={toggleButton}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
              {paymentMethods[0]?.package?.package_name !== "PAY_IN_2" &&
                mallPayMentScreenCheck === true && (
                  <>
                    {/* Wallet */}
                    {others.map((methods: any) => {
                      if (
                        methods.package.package_name === "Vault" &&
                        isExistingUser === true &&
                        isGuest === false
                      ) {
                        return (
                          <div
                            className={`methods-container ${
                              mallPayMentScreenCheck !== true ? "" : "mt-20"
                            } p-3`}
                          >
                            <Row>
                              <Col className="col-8 text-start">
                                <p className="fw-bold">
                                  <Wallet
                                    sx={{
                                      marginTop: "-2px",
                                      cursor: "pointer",
                                    }}
                                  />{" "}
                                  Use Vault Q-Points
                                </p>
                                <p className="order-text mt-1 ms-1">
                                  {wallet_Balance === 0
                                    ? "You are out of balance."
                                    : "Available " +
                                      Math.round(Number(wallet_Balance))}
                                </p>
                              </Col>

                              <Col className="col-4 mt-1 justify-content-end text-end">
                                {wallet_Balance === 0 ? (
                                  ""
                                ) : (
                                  <>
                                    <BootstrapSwitchButton
                                      onstyle="success"
                                      offstyle="secondary"
                                      onChange={(checked: boolean) => {
                                        console.log(
                                          "======================= BUTTON CHECKED: ",
                                          checked
                                        );
                                        setToggleButton(checked);
                                        updateStateHandler({
                                          payload: {
                                            walletToggleButtonCheck:
                                              checked === true
                                                ? "TRUE"
                                                : "FALSE",
                                          },
                                        });
                                      }}
                                    />
                                  </>
                                )}
                              </Col>
                            </Row>
                          </div>
                        );
                      }
                    })}

                    {/* Others 0 */}
                    {vaultEnable === true &&
                    merchantWalletIsEnabled === true &&
                    isGuest === false &&
                    Number(walletBalance) === 0 ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /* setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadClover={setLoadClover}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /* upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}

                          <div className="">
                            {qisstPay.length > 0 &&
                              !paymentLimitError &&
                              qisstPay.map((pack: any) => (
                                <QisstpayMethodCard
                                  qisstPaySelectionHandler={
                                    qisstPaySelectionHandler
                                  }
                                  loadQisstPay={loadQisstPay}
                                  loadQisstPayInSixCC={loadQisstPayInSixCC}
                                  loadQisstPayInFourCC={loadQisstPayInFourCC}
                                  loadQisstPayInThreeCC={loadQisstPayInThreeCC}
                                  loadQisstPayInTwelveCC={
                                    loadQisstPayInTwelveCC
                                  }
                                  loadQisstPayInSix={loadQisstPayInSix}
                                  loadQisstPayInThree={loadQisstPayInThree}
                                  loadQisstPayInTwo={loadQisstPayInTwo}
                                  encrypted={encrypted}
                                  setNumber={setNumber}
                                  setCvc={setCvc}
                                  merchantLogo={merchantLogo}
                                  merchantBusinessName={merchantBusinessName}
                                  setName={setName}
                                  setExpiry={setExpiry}
                                  payIn3Amount={processingAmount}
                                  setExpiryValidated={setExpiryValidated}
                                  setAcceptTerms={setAcceptTerms}
                                  onClickViewPaymentPlan={() => {}}
                                  halfAmountToPay={halfAmountToPay}
                                  processingFee={(price / 100) * processingFee}
                                  method={pack}
                                  prodPrice={price}
                                  packageSelected={packageSelected}
                                  paymentLimitError={paymentLimitError}
                                  is4gives={is4gives}
                                  prodsObj={
                                    encrypted?.line_items ?? productsObj
                                  }
                                  setCardSelect={setCardSelect}
                                  cardSelect={cardSelect}
                                  toggleVault={toggleButton}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Others 1 */}
                    {vaultEnable === true &&
                    merchantWalletIsEnabled === true &&
                    isGuest === false &&
                    Number(walletBalance) > 0 &&
                    Number(walletBalance) <
                      Number(price) +
                        Number(taxPrice) +
                        (Number(price) / 100) * Number(processingFee) +
                        Number(shippingPrice) -
                        Number(discountedAmount) ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*PaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}

                          <div className="">
                            {qisstPay.length > 0 &&
                              !paymentLimitError &&
                              qisstPay.map((pack: any) => (
                                <QisstpayMethodCard
                                  qisstPaySelectionHandler={
                                    qisstPaySelectionHandler
                                  }
                                  loadQisstPay={loadQisstPay}
                                  loadQisstPayInSixCC={loadQisstPayInSixCC}
                                  loadQisstPayInFourCC={loadQisstPayInFourCC}
                                  loadQisstPayInThreeCC={loadQisstPayInThreeCC}
                                  loadQisstPayInTwelveCC={
                                    loadQisstPayInTwelveCC
                                  }
                                  loadQisstPayInSix={loadQisstPayInSix}
                                  loadQisstPayInThree={loadQisstPayInThree}
                                  loadQisstPayInTwo={loadQisstPayInTwo}
                                  encrypted={encrypted}
                                  setNumber={setNumber}
                                  setCvc={setCvc}
                                  merchantLogo={merchantLogo}
                                  merchantBusinessName={merchantBusinessName}
                                  setName={setName}
                                  setExpiry={setExpiry}
                                  payIn3Amount={processingAmount}
                                  setExpiryValidated={setExpiryValidated}
                                  setAcceptTerms={setAcceptTerms}
                                  onClickViewPaymentPlan={() => {}}
                                  halfAmountToPay={halfAmountToPay}
                                  processingFee={(price / 100) * processingFee}
                                  method={pack}
                                  prodPrice={price}
                                  packageSelected={packageSelected}
                                  paymentLimitError={paymentLimitError}
                                  is4gives={is4gives}
                                  prodsObj={
                                    encrypted?.line_items ?? productsObj
                                  }
                                  setCardSelect={setCardSelect}
                                  cardSelect={cardSelect}
                                  toggleVault={toggleButton}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Others 2 */}
                    {vaultEnable === true &&
                    merchantWalletIsEnabled === true &&
                    isGuest === false &&
                    toggleButton === false &&
                    Number(walletBalance) > 0 &&
                    Number(walletBalance) >
                      Number(price) +
                        Number(taxPrice) +
                        (Number(price) / 100) * Number(processingFee) +
                        Number(shippingPrice) -
                        Number(discountedAmount) ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Others 4 => Guest Case */}
                    {vaultEnable === true && isGuest === true ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {vaultEnable !== true && isGuest === true ? (
                      <>
                        <Box className="methods-container" marginTop={"20px"}>
                          {customerCard ? (
                            <>
                              {customerCard?.creditCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box
                                          display={"flex"}
                                          alignItems="center"
                                        >
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                              {customerCard?.debitCards?.map((data: any) => {
                                return (
                                  <>
                                    <Box
                                      padding="10px 10px"
                                      display={"flex"}
                                      justifyContent="space-between"
                                      alignItems={"center"}
                                      onClick={() =>
                                        handleSelectedCard(
                                          data?.id,
                                          data?.cardNumber,
                                          data?.expMonth,
                                          data?.expYear
                                        )
                                      }
                                    >
                                      <Box display={"flex"} alignItems="center">
                                        <Box>
                                          <img
                                            style={{ marginRight: "14px" }}
                                            src={
                                              data?.id == customerCardId &&
                                              cardSelect
                                                ? "/assets/filled.png"
                                                : "/assets/unchecked.png"
                                            }
                                            alt="radio_image"
                                          />

                                          {data.cardForm === "Visa" ? (
                                            <img
                                              src="/assets/visa.png"
                                              alt="visa"
                                              height="50px"
                                              width={"52px"}
                                            />
                                          ) : (
                                            <img
                                              src="/assets/mastercard.svg"
                                              alt="master"
                                              height="30px"
                                            />
                                          )}
                                        </Box>
                                        <Typography sx={{ ml: "20px" }}>
                                          ****{data?.cardNumber} <br /> Expires{" "}
                                          {data.expMonth}/{data.expYear}
                                        </Typography>
                                        {data?.defaultCheck && (
                                          <Box
                                            sx={{
                                              border: "1px solid #000",
                                              marginLeft: "20px",
                                              borderRadius: "20px",
                                              padding: "2px 10px",
                                            }}
                                          >
                                            <Typography>Active Card</Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      <Tooltip
                                        title={
                                          data?.defaultCheck === true
                                            ? "Default card cannnot be deleted"
                                            : ""
                                        }
                                      >
                                        <Box display={"flex"}>
                                          <Button
                                            sx={{
                                              backgroundColor: "#F9FAFB",
                                              width: "59px",
                                              color: "#374151",
                                              fontSize: "12px",
                                              height: "28px",
                                            }}
                                            onClick={() => handleShow(data?.id)}
                                            disabled={
                                              data.defaultCheck === true
                                                ? true
                                                : false
                                            }
                                          >
                                            Delete
                                          </Button>

                                          <Modal
                                            id="deleteModal"
                                            show={show}
                                            onHide={handleClose}
                                            // size="xs"
                                            centered
                                          >
                                            <Modal.Body
                                              style={{ maxHeight: "60pt" }}
                                            >
                                              <p>
                                                Are you sure you want to delete
                                                card ****
                                                {data.cardNumber}?
                                              </p>

                                              <p>{error && error}</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button
                                                onClick={handleClose}
                                                className="cancelBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                  marginRight: "20px",
                                                }}
                                              >
                                                No
                                              </Button>
                                              <Button
                                                onClick={() =>
                                                  handleCardDelete(cardId)
                                                }
                                                className="deleteBtn"
                                                sx={{
                                                  backgroundColor: "#F9FAFB",
                                                  width: "59px",
                                                  color: "#374151",
                                                  fontSize: "12px",
                                                  height: "28px",
                                                  border: "1px solid",
                                                }}
                                              >
                                                Yes
                                              </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </Box>
                                      </Tooltip>
                                    </Box>
                                    <hr style={{ margin: 0 }} />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            ""
                          )}
                        </Box>
                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*setUpliftVirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*PaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {vaultEnable !== true && isGuest === false ? (
                      <>
                        {customerCard ? (
                          <Box className="methods-container" marginTop={"20px"}>
                            {customerCard?.creditCards?.map((data: any) => {
                              return (
                                <>
                                  <Box
                                    padding="10px 10px"
                                    display={"flex"}
                                    justifyContent="space-between"
                                    alignItems={"center"}
                                    onClick={() =>
                                      handleSelectedCard(
                                        data?.id,
                                        data?.cardNumber,
                                        data?.expMonth,
                                        data?.expYear
                                      )
                                    }
                                  >
                                    <Box display={"flex"} alignItems="center">
                                      <Box display={"flex"} alignItems="center">
                                        <img
                                          style={{ marginRight: "14px" }}
                                          src={
                                            data?.id == customerCardId &&
                                            cardSelect
                                              ? "/assets/filled.png"
                                              : "/assets/unchecked.png"
                                          }
                                          alt="radio_image"
                                        />

                                        {data.cardForm === "Visa" ? (
                                          <img
                                            src="/assets/visa.png"
                                            alt="visa"
                                            height="50px"
                                            width={"52px"}
                                          />
                                        ) : (
                                          <img
                                            src="/assets/mastercard.svg"
                                            alt="master"
                                            height="30px"
                                          />
                                        )}
                                      </Box>
                                      <Typography sx={{ ml: "20px" }}>
                                        ****{data?.cardNumber} <br /> Expires{" "}
                                        {data.expMonth}/{data.expYear}
                                      </Typography>
                                      {data?.defaultCheck && (
                                        <Box
                                          sx={{
                                            border: "1px solid #000",
                                            marginLeft: "20px",
                                            borderRadius: "20px",
                                            padding: "2px 10px",
                                          }}
                                        >
                                          <Typography>Active Card</Typography>
                                        </Box>
                                      )}
                                    </Box>
                                    <Tooltip
                                      title={
                                        data?.defaultCheck === true
                                          ? "Default card cannnot be deleted"
                                          : ""
                                      }
                                    >
                                      <Box display={"flex"}>
                                        <Button
                                          sx={{
                                            backgroundColor: "#F9FAFB",
                                            width: "59px",
                                            color: "#374151",
                                            fontSize: "12px",
                                            height: "28px",
                                          }}
                                          onClick={() => handleShow(data?.id)}
                                          disabled={
                                            data.defaultCheck === true
                                              ? true
                                              : false
                                          }
                                        >
                                          Delete
                                        </Button>

                                        <Modal
                                          id="deleteModal"
                                          show={show}
                                          onHide={handleClose}
                                          // size="xs"
                                          centered
                                        >
                                          <Modal.Body
                                            style={{ maxHeight: "60pt" }}
                                          >
                                            <p>
                                              Are you sure you want to delete
                                              card ****
                                              {data.cardNumber}?
                                            </p>

                                            <p>{error && error}</p>
                                          </Modal.Body>
                                          <Modal.Footer>
                                            <Button
                                              onClick={handleClose}
                                              className="cancelBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                                marginRight: "20px",
                                              }}
                                            >
                                              No
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleCardDelete(cardId)
                                              }
                                              className="deleteBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                              }}
                                            >
                                              Yes
                                            </Button>
                                          </Modal.Footer>
                                        </Modal>
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                  <hr style={{ margin: 0 }} />
                                </>
                              );
                            })}
                            {customerCard?.debitCards?.map((data: any) => {
                              return (
                                <>
                                  <Box
                                    padding="10px 10px"
                                    display={"flex"}
                                    justifyContent="space-between"
                                    alignItems={"center"}
                                    onClick={() =>
                                      handleSelectedCard(
                                        data?.id,
                                        data?.cardNumber,
                                        data?.expMonth,
                                        data?.expYear
                                      )
                                    }
                                  >
                                    <Box display={"flex"} alignItems="center">
                                      <Box>
                                        <img
                                          style={{ marginRight: "14px" }}
                                          src={
                                            data?.id == customerCardId &&
                                            cardSelect
                                              ? "/assets/filled.png"
                                              : "/assets/unchecked.png"
                                          }
                                          alt="radio_image"
                                        />

                                        {data.cardForm === "Visa" ? (
                                          <img
                                            src="/assets/visa.png"
                                            alt="visa"
                                            height="50px"
                                            width={"52px"}
                                          />
                                        ) : (
                                          <img
                                            src="/assets/mastercard.svg"
                                            alt="master"
                                            height="30px"
                                          />
                                        )}
                                      </Box>
                                      <Typography sx={{ ml: "20px" }}>
                                        ****{data?.cardNumber} <br /> Expires{" "}
                                        {data.expMonth}/{data.expYear}
                                      </Typography>
                                      {data?.defaultCheck && (
                                        <Box
                                          sx={{
                                            border: "1px solid #000",
                                            marginLeft: "20px",
                                            borderRadius: "20px",
                                            padding: "2px 10px",
                                          }}
                                        >
                                          <Typography>Active Card</Typography>
                                        </Box>
                                      )}
                                    </Box>
                                    <Tooltip
                                      title={
                                        data?.defaultCheck === true
                                          ? "Default card cannnot be deleted"
                                          : ""
                                      }
                                    >
                                      <Box display={"flex"}>
                                        <Button
                                          sx={{
                                            backgroundColor: "#F9FAFB",
                                            width: "59px",
                                            color: "#374151",
                                            fontSize: "12px",
                                            height: "28px",
                                          }}
                                          onClick={() => handleShow(data?.id)}
                                          disabled={
                                            data.defaultCheck === true
                                              ? true
                                              : false
                                          }
                                        >
                                          Delete
                                        </Button>

                                        <Modal
                                          id="deleteModal"
                                          show={show}
                                          onHide={handleClose}
                                          // size="xs"
                                          centered
                                        >
                                          <Modal.Body
                                            style={{ maxHeight: "60pt" }}
                                          >
                                            <p>
                                              Are you sure you want to delete
                                              card ****
                                              {data.cardNumber}?
                                            </p>

                                            <p>{error && error}</p>
                                          </Modal.Body>
                                          <Modal.Footer>
                                            <Button
                                              onClick={handleClose}
                                              className="cancelBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                                marginRight: "20px",
                                              }}
                                            >
                                              No
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleCardDelete(cardId)
                                              }
                                              className="deleteBtn"
                                              sx={{
                                                backgroundColor: "#F9FAFB",
                                                width: "59px",
                                                color: "#374151",
                                                fontSize: "12px",
                                                height: "28px",
                                                border: "1px solid",
                                              }}
                                            >
                                              Yes
                                            </Button>
                                          </Modal.Footer>
                                        </Modal>
                                      </Box>
                                    </Tooltip>
                                  </Box>
                                  <hr style={{ margin: 0 }} />
                                </>
                              );
                            })}
                          </Box>
                        ) : (
                          ""
                        )}

                        <div className="methods-container mt-20">
                          {Bol !== "1" &&
                            others
                              .filter(
                                (it: any) =>
                                  it.package?.package_name
                                    ?.toString()
                                    .toLocaleUpperCase() !== "VAULT"
                              )
                              .map((methods: any, index: any) => {
                                if (
                                  !(
                                    methods.package.package_name
                                      .toString()
                                      .toLocaleUpperCase() === "GOOGLEPAY" &&
                                    hideGooglePay
                                  )
                                ) {
                                  if (
                                    !(
                                      methods.package.package_name
                                        .toString()
                                        .toLocaleUpperCase() === "CARD" && Bol
                                    )
                                  ) {
                                    return (
                                      <div>
                                        <MethodCard
                                          /*VirtualCardAvailable={
                                          setUpliftVirtualCardAvailable
                                        }*/
                                          squarePaymentCheckoutHandler={
                                            squarePaymentCheckoutHandler
                                          }
                                          foreePaymentCheckoutHandler={
                                            foreePaymentCheckoutHandler
                                          }
                                          jazzCashCPaymentCheckoutHandler={
                                            jazzCashCPaymentCheckoutHandler
                                          }
                                          niftPaymentCheckoutHandler={
                                            niftPaymentCheckoutHandler
                                          }
                                          setLoadAuthorizeDotNet={
                                            setLoadAuthorizeDotNet
                                          }
                                          loadAuthorizeDotNet={
                                            loadAuthorizeDotNet
                                          }
                                          setLoadCOD={setLoadCOD}
                                          otpPage={otpPage}
                                          nauman={"mnn"}
                                          loadCOD={loadCOD}
                                          cnic={cnic}
                                          account_number={number}
                                          loadBrainTree={loadBrainTree}
                                          paypal={loadPaypal}
                                          //loadUplift={loadUplift}
                                          loadNab={loadNab}
                                          loadBitPay={loadBitPay}
                                          loadPinWheel={loadPinWheel}
                                          setLoadBitPay={setLoadBitPay}
                                          //setLoadUplift={setLoadUplift}
                                          setLoadNab={setLoadNab}
                                          setLoadPinWheel={setLoadPinWheel}
                                          loadCard={loadCard}
                                          loadClover={loadClover}
                                          setLoadClover={setLoadClover}
                                          loadCardPointe={loadCardPointe}
                                          loadEasyPaisa={loadEasyPaisa}
                                          loadVault={loadVault}
                                          loadEasyPaisaDirect={
                                            loadEasyPaisaDirect
                                          }
                                          loadNift={loadNift}
                                          loadDirectBank={loadDirectBank}
                                          loadKlarna={loadKlarna}
                                          // loadAffirm={loadAffirm}
                                          loadSquare={loadSquare}
                                          loadForee={loadForee}
                                          loadJazzCashC={loadJazzCashC}
                                          loadSezzle={loadSezzle}
                                          loadUBL={loadUBL}
                                          setLoadUBL={setLoadUBL}
                                          loadAlfa={loadAlfa}
                                          loadAlfalah={loadAlfalah}
                                          loadQisstPayInThree={
                                            loadQisstPayInThree
                                          }
                                          loadQisstPayInTwo={loadQisstPayInTwo}
                                          setLoadQisstPayInTwo={
                                            setLoadQisstPayInTwo
                                          }
                                          setLoadAlfalah={setLoadAlfalah}
                                          setLoadAlfa={setLoadAlfa}
                                          loadJazzCash={loadJazzCash}
                                          loadPayFast={loadPayFast}
                                          payFastToggle={payFastToggle}
                                          payFastOrderID={payFastOrderID}
                                          payFastOrderNumber={
                                            payFastOrderNumber
                                          }
                                          setPayFastOrderID={setPayFastOrderID}
                                          setPayFastOrderNumber={
                                            setPayFastOrderNumber
                                          }
                                          setPayFastToggle={setPayFastToggle}
                                          // setLoadAffirm={setLoadAffirm}
                                          setLoadNift={setLoadNift}
                                          setLoadBrainTree={setLoadBrainTree}
                                          setLoadKlarna={setLoadKlarna}
                                          setLoadCard={setLoadCard}
                                          setLoadCardPointe={setLoadCardPointe}
                                          setLoadPayPal={setLoadPayPal}
                                          setLoadQisstPay={setLoadQisstPay}
                                          setLoadQisstPayInSix={
                                            setLoadQisstPayInSix
                                          }
                                          setLoadQisstPayInThree={
                                            setLoadQisstPayInThree
                                          }
                                          setLoadEasyPaisa={setLoadEasyPaisa}
                                          setLoadVault={setLoadVault}
                                          setLoadEasyPaisaDirect={
                                            setLoadEasyPaisaDirect
                                          }
                                          setLoadDirectBank={setDirectBank}
                                          setLoadSquare={setLoadSquare}
                                          setLoadForee={setLoadForee}
                                          setLoadJazzCashC={setLoadJazzCashC}
                                          setLoadSezzle={setLoadSezzle}
                                          setLoadJazzCash={setLoadJazzCash}
                                          setLoadPayFast={setLoadPayFast}
                                          merchantPackageId={(
                                            id: string,
                                            ext: any
                                          ) => setMerchantPackageId(id)}
                                          activeMethod={setActiveMethod}
                                          parentActiveMethod={(
                                            method: string
                                          ) =>
                                            updateStateHandler({
                                              payload: {
                                                activeMethod: method,
                                              },
                                            })
                                          }
                                          encrypted={encrypted}
                                          merchantAccounts={merchantAccounts}
                                          merchantEmail={merchantEmail}
                                          merchantPhone={merchantPhone}
                                          methods={methods}
                                          key={methods.package.package_name}
                                          id={methods.package.package_name
                                            .toString()
                                            .toLocaleUpperCase()}
                                          price={
                                            encrypted?.total_amount ?? price
                                          }
                                          setCvc={setCvc}
                                          setCnic={setCnic}
                                          setJazzCashNumber={setJazzCashNumber}
                                          setNumber={setNumber}
                                          setName={setName}
                                          setExpiry={setExpiry}
                                          setProcessingAmount={
                                            setProcessingAmount
                                          }
                                          setProcessingFee={setProcessingFee}
                                          setExpiryValidated={
                                            setExpiryValidated
                                          }
                                          setPhoneNumber={setPhoneNumber}
                                          phoneNumber={phoneNumber}
                                          setDisable={setDisable}
                                          setEpValidation={
                                            setEpNumberValidation
                                          }
                                          setError={setError}
                                          setPackageSelected={
                                            setPackageSelected
                                          }
                                          /*upliftPaymentMethodHandler={
                                          upliftPaymentMethodHandler
                                        }
                                        initUpliftHandler={initUpliftHandler}*/
                                          setCardSelect={setCardSelect}
                                        />
                                        <div>
                                          {index < others.length - 1 &&
                                            (encrypted?.total_amount ??
                                              price) <= methods.max &&
                                            (encrypted?.total_amount ??
                                              price) >= methods.min && (
                                              <hr style={{ margin: 0 }} />
                                            )}
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              })}

                          <div className="">
                            {qisstPay.length > 0 &&
                              !paymentLimitError &&
                              qisstPay.map((pack: any) => (
                                <QisstpayMethodCard
                                  qisstPaySelectionHandler={
                                    qisstPaySelectionHandler
                                  }
                                  loadQisstPay={loadQisstPay}
                                  loadQisstPayInSixCC={loadQisstPayInSixCC}
                                  loadQisstPayInFourCC={loadQisstPayInFourCC}
                                  loadQisstPayInThreeCC={loadQisstPayInThreeCC}
                                  loadQisstPayInTwelveCC={
                                    loadQisstPayInTwelveCC
                                  }
                                  loadQisstPayInSix={loadQisstPayInSix}
                                  loadQisstPayInThree={loadQisstPayInThree}
                                  loadQisstPayInTwo={loadQisstPayInTwo}
                                  encrypted={encrypted}
                                  setNumber={setNumber}
                                  setCvc={setCvc}
                                  merchantLogo={merchantLogo}
                                  merchantBusinessName={merchantBusinessName}
                                  setName={setName}
                                  setExpiry={setExpiry}
                                  payIn3Amount={processingAmount}
                                  setExpiryValidated={setExpiryValidated}
                                  setAcceptTerms={setAcceptTerms}
                                  onClickViewPaymentPlan={() => {}}
                                  halfAmountToPay={halfAmountToPay}
                                  processingFee={(price / 100) * processingFee}
                                  method={pack}
                                  prodPrice={price}
                                  packageSelected={packageSelected}
                                  paymentLimitError={paymentLimitError}
                                  is4gives={is4gives}
                                  prodsObj={
                                    encrypted?.line_items ?? productsObj
                                  }
                                  setCardSelect={setCardSelect}
                                  cardSelect={cardSelect}
                                  toggleVault={toggleButton}
                                />
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
            </div>
          </div>

          {/* coupns */}
          {isTez !== 0 && (
            <div>
              <Coupon />
            </div>
          )}

          <Col md={12} lg={12}>
            <div id="message">
              {error && (
                <div className="w-100 mt-20  flex align-center">
                  <img src="assets/error.svg" alt="error" />
                  <p className="pl-10 error-msg">{error}</p>
                </div>
              )}
            </div>
          </Col>

          {merchantWalletIsEnabled === true &&
          toggleButton === true &&
          packageSelected === "" &&
          activeMethod === "" &&
          Number(wallet_Balance) >
            Number(price) +
              Number(taxPrice) +
              (price / 100) * processingFee +
              Number(shippingPrice) -
              Number(discountedAmount) ? (
            <button
              onClick={async (e) => {
                setDisable(false);
                setError("");
                // selectPaymentHandler();
                console.log(merchantPackageId, "merchant package ID");
                // setToggleButton(false)
                setOnLoad(true);
                completeOrderHandler(
                  "WALLET_COD",
                  vaultPackageID.toString(),
                  ""
                );
              }}
              type="button"
              className={`basic-btn margin-top-0 ${
                onLoad === true ? "d-none" : ""
              }`}
              disabled={checkBlockCitiesHelper(
                identityToken,
                encrypted?.shipping_info?.city ?? city
              )}
            >
              <div>
                <p>{is4gives ? <>Pay </> : <>Shop </>}Now</p>
              </div>
            </button>
          ) : (
            ""
          )}

          {onLoad && (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10pt",
                  marginBottom: "10pt",
                  color: "#E82E81",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Please wait your order is being processed
              </div>
            </>
          )}

          <div className="mb-10 mt-10 ">
            {!["SQUARE", "NIFT", "UPLIFT", ""].includes(activeMethod) &&
              !disable && (
                <button
                  onClick={() => handleButtonClick()}
                  type="button"
                  // disable-btn
                  className={"basic-btn margin-top-0"}
                  // className={
                  //   epValidation == "false"
                  //     ? "disable-btn margin-top-0"
                  //     : "basic-btn margin-top-0"
                  // }
                  //cities allowed only
                  disabled={checkBlockCitiesHelper(
                    identityToken,
                    encrypted?.shipping_info?.city ?? city
                  )}
                >
                  {activeMethod != "COD" ||
                  cardSelect ||
                  activeMethod.toLocaleUpperCase() === "EASYPAISA" ? (
                    <div>
                      <p>{is4gives ? <>Pay </> : <>Shop </>} Now</p>
                    </div>
                  ) : (
                    <div>
                      <p>Order Now</p>
                    </div>
                  )}
                </button>
              )}
            {/* {showButton === true ? <a target={"_blank"}> <button type='submit' onClick={() => { callAlfalah(sessionID, orderID, paymentAlfalah) }}>Click Me</button> </a> : null} */}

            {/*{activeMethod === "UPLIFT" &&
              !upliftVirtualCardAvailable &&
              !disable && (
                <>
                  <button
                    onClick={async (e) => {
                      const res = await (
                        window as any
                      ).Uplift.Payments.getToken();
                      console.log("res", res);
                      // setTimeout(() => {
                      //   upliftPaymentMethodHandler()
                      // }, 1000)
                    }}
                    type="button"
                    className={
                      disable || TokenAvailableButton === false
                        ? "disable-btn margin-top-0"
                        : "basic-btn margin-top-0"
                    }
                    disabled={
                      checkBlockCitiesHelper(
                        identityToken,
                        encrypted?.shipping_info?.city ?? city
                      ) || TokenAvailableButton === false
                    }
                  >
                    <div>
                      <p>
                        {TokenAvailableButton === false
                          ? "Complete Booking"
                          : "I agree & Complete Purchase"}
                      </p>
                    </div>
                  </button>
                </>
                        )}*/}
            {/* {activeMethod === "UPLIFT" &&
              upliftVirtualCardAvailable &&
              !disable && (
                <button
                  onClick={(e) => {
                    setTimeout(() => {
                      upliftPaymentMethodHandler();
                    }, 1000);
                  }}
                  type="button"
                  className={
                    disable
                      ? "disable-btn margin-top-0"
                      : "basic-btn margin-top-0"
                  }
                  disabled={checkBlockCitiesHelper(
                    identityToken,
                    encrypted?.shipping_info?.city ?? city
                  )}
                >
                  <div>
                    <p>I agree & Complete Purchase</p>
                  </div>
                </button>
              )} */}
            {/*{activeMethod === "UPLIFT" &&
              upliftVirtualCardAvailable &&
              !disable && (
                <button
                  onClick={async (e) => {
                    // await upliftPaymentMethodHandler();
                    // selectPaymentHandler();
                  }}
                  type="button"
                  className={"disable-btn margin-top-0"}
                  disabled={checkBlockCitiesHelper(
                    identityToken,
                    encrypted?.shipping_info?.city ?? city
                  )}
                >
                  <div>
                    <p>Processing your payment...</p>
                  </div>
                </button>
              )}*/}
            {disable &&
              activeMethod !== "SQUARE" &&
              activeMethod !== "FOREE" &&
              activeMethod !== "JAZZCASH_C" &&
              activeMethod !== "EASYPAISA" &&
              activeMethod !== "CARDPOINTE" &&
              activeMethod !== "SEZZLE" && (
                <button type="button" className="disable-btn margin-top-0">
                  <RotatingLines
                    strokeColor="#E82E81"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="40"
                    visible={true}
                  />
                </button>
              )}
          </div>
          {mall_ID === null && (
            <div className="securecheckout">
              <img
                style={{ paddingBottom: "4px" }}
                src="/assets/securecheckout.svg"
                alt="securecheckout"
              />

              <img src="/assets/pci.svg" alt="pci" />
            </div>
          )}
        </div>

        <Modal
          backdrop="static"
          keyboard={false}
          size={"lg"}
          show={openModal}
          onHide={() => setOpenModal(false)}
        >
          <Modal.Header style={{ border: "none" }} closeButton></Modal.Header>
          <div id="my-checkout-container"></div>
        </Modal>

        <PaymentInstructionModal
          show={showInstructionModal}
          onHide={closeInstructionModalHandler}
          nextSlide={nextSlideHandler}
          prevSlide={prevSlideHandler}
          activeSlide={activeInstructionSlide}
        />

        {/* {is4gives && <p className="poweredQP">Powered by Qisstpay</p>} */}

        {upSellProducts.length > 0 && (
          <UpsellCard
            products={upSellProducts}
            show={showUpSellModal}
            onHide={() => setShowUpSellModal(false)}
            addToCart={addToCartHandler}
            cartItems={lineItems}
          />
        )}
      </Container>

      {/* {
        mallPayMentScreenCheck && mall_ID !== null && <div style={{ margin: "0pt 10pt 20pt 10pt" }}>
          <button
            onClick={() => {
              completeOrderHandler()
            }}
            type="button"
            className={`basic-btn margin-top-0`}

          >
            <p style={{ fontWeight: "700" }}>Pay Now</p>
          </button>
        </div>
      } */}

      {/* mall changes in the global cart and display the lower button proceed one */}

      {/* <div className={`${mall_ID !== null ? "" : "mt-30"}`}>
        {mall_ID !== "" && mall_ID !== null ? (
          <Globalcart
            show={"show"}
            mallPayMentScreenCheck={mallPayMentScreenCheck}
          />
        ) : ( */}
      <Cart
        countryCode={encrypted?.country_code ?? countryCode}
        currency={encrypted?.currency ?? currency}
        processingFee={(price / 100) * processingFee}
        taxPrice={encrypted?.tax_amount ?? taxPrice}
        shippingPrice={
          shipping_flag && shipping_flag === "true"
            ? shippingPrice
            : shipping_flag && shipping_flag === "false"
            ? "0"
            : !shipping_flag && shippingPrice
        }
        totalAmount={encrypted?.total_amount ?? price}
        vaultPoints={toggleButton === true ? wallet_Balance : "0"}
        productsObj={encrypted?.line_items ?? productsObj}
        discountedAmount={discountedAmount}
      />
      {/* )}
      </div> */}

      {/* {!mallPayMentScreenCheck && mall_ID !== null && (
        <div style={{ margin: "20pt 10pt 40pt 10pt" }}>
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
                ? "disable-btn margin-top-0"
                : "basic-btn margin-top-0"
            }
            onClick={() => {
              setMallPayMentScreenCheck(true);
              window.scrollTo(0, 0);
            }}
          >
            <p style={{ fontWeight: "700" }}>Proceed to Payment</p>
          </button>
        </div>
      )} */}
    </>
  );
};

export default PaymentSelectionPage;
