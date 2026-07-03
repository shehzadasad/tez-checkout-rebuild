import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { lazyLoad } from "../../utils/loadable";
import "../../styles/checkout.css";
import {
  CreditCardInput,
  SquarePaymentsForm,
} from "react-square-web-payments-sdk";
import * as Square from "@square/web-sdk";
import Skyflow from "skyflow-js";
import { usePaymentSelectionHook } from "../../hooks/custom/usePaymentSelection";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import CardDetailNift from "./MethodNift";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../enums/GA-messages";
import OtpInput from "react-otp-input";
import { useHistory } from "react-router-dom";
import PayFast from "./PayFast";

const CardDetail = lazyLoad(() => import("./CardDetailComponent"));

interface IProps {
  setLoadCOD: Function;
  loadCOD: boolean;
  loadBrainTree: boolean;
  cnic: any;
  account_number: any;
  paypal: boolean;
  loadCard: boolean;
  loadCardPointe: boolean;
  loadSquare: boolean;
  loadQisstPayInThree: boolean;
  loadQisstPayInTwo: boolean;
  loadForee: boolean;
  loadJazzCashC: boolean;
  loadPayFast: boolean;
  loadSezzle: boolean;
  loadJazzCash: boolean;
  payFastToggle: boolean;
  loadEasyPaisa: boolean;
  loadVault: boolean;
  loadEasyPaisaDirect: boolean;
  loadDirectBank: boolean;
  loadAlfalah: boolean;
  loadAlfa: boolean;
  loadKlarna: boolean;
  loadNift: boolean;
  loadUplift: boolean;
  loadNab: boolean;
  loadBitPay: boolean;
  loadClover: boolean;
  setLoadBitPay: Function;
  setLoadClover: Function;
  // loadAffirm: boolean;
  // setLoadAffirm: Function;
  setLoadKlarna: Function;
  setLoadCard: Function;
  setLoadAlfalah: Function;
  setLoadAlfa: Function;
  setLoadCardPointe: Function;
  setLoadPayPal: Function;
  setLoadQisstPay: Function;
  setLoadEasyPaisa: Function;
  setLoadVault: Function;
  setLoadEasyPaisaDirect: Function;
  setLoadDirectBank: Function;
  setLoadSquare: Function;
  setLoadForee: Function;
  setLoadJazzCashC: Function;
  setLoadPayFast: Function;
  setLoadSezzle: Function;
  setLoadJazzCash: Function;
  // setLoadUplift: Function;
  setLoadNab: Function;
  setProcessingAmount: Function;
  setProcessingFee: Function;
  merchantPackageId: Function;
  activeMethod: Function;
  parentActiveMethod: Function;
  encrypted: any;
  methods: any;
  merchantAccounts: any;
  merchantEmail: any;
  merchantPhone: any;
  key: any;
  id: any;
  price: number;
  setCvc: Function;
  setCnic: Function;
  setJazzCashNumber: Function;
  setNumber: Function;
  setName: Function;
  setExpiry: Function;
  setExpiryValidated: Function;
  setPhoneNumber: Function;
  phoneNumber: string;
  setDisable: Function;
  setEpValidation: Function;
  setError: Function;
  squarePaymentCheckoutHandler: Function;
  foreePaymentCheckoutHandler: Function;
  jazzCashCPaymentCheckoutHandler: Function;
  setLoadQisstPayInSix: Function;
  setLoadQisstPayInThree: Function;
  setLoadQisstPayInTwo: Function;
  setPackageSelected: Function;
  setLoadNift: Function;
  setLoadBrainTree: Function;
  niftPaymentCheckoutHandler: Function;
  otpPage: boolean;
  initUpliftHandler: Function;
  upliftPaymentMethodHandler: Function;
  setLoadPinWheel: Function;
  loadPinWheel: boolean;
  // setUpliftVirtualCardAvailable: Function;
  setLoadAuthorizeDotNet: Function;
  loadAuthorizeDotNet: boolean;
  prodsObj: any;
  setCardSelect: any;
  payFastOrderID: any;
  payFastOrderNumber: any;
  setPayFastOrderID: any;
  setPayFastOrderNumber: any;
  setPayFastToggle: any;
  loadUBL: any;
  setLoadUBL: any;
  cardSelect: any;
}

const MethodCard: React.FC<IProps> = (props: IProps) => {
  // const {
  //   states: { processingAmount, processingFee, payFastToggle },

  //   setStates: { setProcessingFee, setProcessingAmount, setPayFastToggle },
  //   handlers: { },
  // } = usePaymentSelectionHook();

  const [isExpanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cnic, setCnic] = useState<string>("");
  const [jazzCashNumber, setJazzCashNumber] = useState<string>("");
  const [otpValue, setOtpValue] = useState<any>("");
  const history = useHistory();
  const {
    state: {
      currency,
      countryCode,
      address,
      city,
      name,
      lastName,
      email,
      identityToken: ctxIdentiyToken,
      token,
      intlNumber,
      productsObj,
      AuthToken,
      RequestHash,
      ChannelId,
      Currency,
      ReturnURL,
      MerchantId,
      StoreId,
      IsBIN,
      MerchantHash,
      MerchantUsername,
      MerchantPassword,
      TransactionTypeId,
      TransactionReferenceNumber,
      TransactionAmount,
      GoogleAnalyticsCred,
      isGuest,
      rudderStackID,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const methods = props.methods;
  const price = props.price;
  const accounts = props.merchantAccounts;
  const merchantEmail = props.merchantEmail;
  const merchantPhone = props.merchantPhone;

  // useEffect(() => {
  //   validatePhoneNumberHandler(props.phoneNumber);
  // }, [props.phoneNumber]);

  // useEffect(() => {
  //   if (props.loadCOD == true && props.methods.package.package_name == "COD") {
  //     if (
  //       props.price <= props.methods.max &&
  //       props.price >= props.methods.min
  //     ) {
  //       //console.log(methods.merchant_package_id);
  //       props.setLoadCOD(true);
  //       props.setLoadPayPal(false);
  //       props.setLoadCard(false);
  //       props.setLoadQisstPay(false);
  //       props.setLoadQisstPayInSix(false);
  //       props.setPackageSelected("");
  //       props.setLoadEasyPaisa(false);
  //       props.setLoadDirectBank(false);
  //       props.setLoadKlarna(false);
  //       props.setLoadAffirm(false);
  //       props.setLoadNift(false);
  //       // (global as any).rudderanalytics?.track("COD Selected");
  //       (global as any).rudderanalytics?.track("1C COD Selected - FB");
  //       // (global as any).rudderanalytics?.track("Payment method selected", {
  //       //   payment_method: 'COD'
  //       // });

  //       props.encrypted.merchant_package_id = methods.merchant_package_id;
  //       props.merchantPackageId(methods.merchant_package_id, "");
  //       props.activeMethod("COD");
  //       props.setError("");
  //       props.setDisable(false);

  //       //  if (props.parentActiveMethod != "") {
  //       props.parentActiveMethod("COD");
  //       //  }
  //     } else {
  //       props.activeMethod("");
  //     }
  //   }
  // }, [props.loadCOD]);

  /**
   * @description validate the phone number and set the error & EpValidation & disable parent state
   * @param number
   */
  const validatePhoneNumberHandler = (number: string) => {
    let re = /^(\+92|0|92)[0-9]{10}$/;
    if (re.test(number)) {
      props.setEpValidation(true);
      props.setError("");
      props.setDisable(false);
      // updateStateHandler({
      //   payload: {
      //     epValidation: "true",
      //   },
      // });
      // props.setDisable(false);
    } else {
      if (number != "") {
        props.setError("Number is not valid");
        props.setDisable(false);
      }
      updateStateHandler({
        payload: {
          epValidation: "false",
        },
      });
    }
  };

  /**
   * @description set the diff payment methods load state & activeMethods & error & disable & merchantPackageId
   * @param package_name
   */
  const toggleExpanded = (package_name: any) => {
    if (props.id == "COD") {
      //console.log("COD");
      //console.log(methods.merchant_package_id);
      // let newAmount = processingAmount - processingAmount * processingFee / 100
      // console.log("NEW DEDUCTED AMOUNT: ", newAmount);
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(true);
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadUBL(false);
      props.setLoadAlfa(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("COD Selected");
      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "COD",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }

      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'COD'
      // });
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("COD");
      props.setError("");
      props.setDisable(false);

      //  if (props.parentActiveMethod != "") {
      props.parentActiveMethod("COD");
      //  }
    } else if (props.id == "PAYPAL") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadPayPal(true);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      setExpanded(!isExpanded);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "PAYPAL",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("PAYPAL Selected");
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'PAYPAL'
      // });
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.merchantPackageId(methods.merchant_package_id, "");
      //console.log("methods.merchant_package_id");

      //console.log(methods.merchant_package_id);
      props.encrypted.package_name = package_name;
      props.activeMethod("PAYPAL");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("PAYPAL");
      // }
    } else if (props.id == "CARD") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setDisable(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadCard(true);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadSquare(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      setExpanded(!isExpanded);
      // (global as any).rudderanalytics?.track("CARD Selected");
      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "CARD",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'CARD'
      // });
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("CARD");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("CARD");
      // }
    } else if (props.id == "CLOVER") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setDisable(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadCard(false);
      props.setLoadClover(true);
      props.setLoadCardPointe(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadSquare(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      setExpanded(!isExpanded);
      // (global as any).rudderanalytics?.track("CARD Selected");
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "CLOVER",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'CARD'
      // });
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("CLOVER");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("CLOVER");
      // }
    } else if (props.id == "CARDPOINTE") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setDisable(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(true);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadSquare(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      setExpanded(!isExpanded);
      // (global as any).rudderanalytics?.track("CARD Selected");
    if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "CARDPOINTE",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'CARD'
      // });
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("CARDPOINTE");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("CARDPOINTE");
      // }
    } else if (props.id == "EASYPAISA") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadEasyPaisa(true);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setDisable(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      props.setError("");
      // (global as any).rudderanalytics?.track("EASYPAISA Selected");
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "EASYPAISA",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }

      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'EASYPAISA'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("EASYPAISA");
      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("EASYPAISA");
      props.setDisable(false);
      props.setError("");

      // }
    } else if (props.id == "VAULT") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(true);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setDisable(true);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      props.setError("");
      // (global as any).rudderanalytics?.track("EASYPAISA Selected");
      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "VAULT",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }

      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'EASYPAISA'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("VAULT");
      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("VAULT");
      // }
    } else if (props.id == "DIRECT_BANK_TRANSFER") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(true);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadJazzCash(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      setExpanded(!isExpanded);
      // (global as any).rudderanalytics?.track("DIRECT BANK TRANSFER Selected");
      (global as any).rudderanalytics?.track(
        "1C_DIRECT_BANK_TRANSFER_SELECTED",
        {},
        {
          anonymousId: rudderStackID,
        }
      );

      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "DIRECT_BANK_TRANSFER",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }

      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'DIRECT BANK TRANSFER'
      // });
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("DIRECT_BANK_TRANSFER");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("DIRECT_BANK_TRANSFER");

      // }
    } else if (props.id == "EASYPAISA_DIRECT") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadEasyPaisaDirect(true);
      props.setLoadDirectBank(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadJazzCash(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      setExpanded(!isExpanded);
      // (global as any).rudderanalytics?.track("DIRECT BANK TRANSFER Selected");
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "EASYPAISA_DIRECT",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }

      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'DIRECT BANK TRANSFER'
      // });
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("EASYPAISA_DIRECT");
      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("EASYPAISA_DIRECT");
      props.setDisable(false);
      // }
    } else if (props.id == "KLARNA") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      // props.setLoadAffirm(false);
      props.setLoadKlarna(true);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      setExpanded(!isExpanded);
      // (global as any).rudderanalytics?.track("KLARNA Selected");
      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "KLARNA",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'KLARNA'
      // });
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("KLARNA");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("KLARNA");
      // }
    }
    // else if (props.id == "AFFIRM") {
    //   props.setCardSelect(false);
    //   props.setProcessingAmount(price);
    //   props.setProcessingFee("");
    //   props.setLoadCOD(false);
    //   props.setLoadQisstPay(false);
    //   props.setLoadQisstPayInSix(false);
    //   props.setLoadQisstPayInThree(false);
    //   props.setLoadQisstPayInTwo(false);
    //   props.setPackageSelected("");
    //   props.setLoadPayPal(false);
    //   props.setLoadCard(false);
    //   props.setLoadClover(false);
    //   props.setLoadCardPointe(false);
    //   props.setLoadEasyPaisa(false);
    //   props.setLoadVault(false);
    //   props.setLoadEasyPaisaDirect(false);
    //   props.setLoadDirectBank(false);
    //   props.setLoadKlarna(false);
    //   props.setLoadAffirm(true);
    //   props.setLoadSquare(false);
    //   props.setLoadForee(false);
    //   props.setLoadJazzCashC(false);
    //   props.setLoadPayFast(false);
    //   props.setLoadAlfalah(false);
    //   props.setLoadAlfa(false);
    //   props.setLoadUBL(false);
    //   props.setLoadSezzle(false);
    //   props.setLoadJazzCash(false);
    //   props.setLoadNift(false);
    //   props.setLoadUplift(false);
    //   props.setLoadNab(false);
    //   props.setLoadBrainTree(false);
    //   props.setLoadBitPay(false);
    //   props.setLoadPinWheel(false);
    //   props.setUpliftVirtualCardAvailable(false);
    //   props.setLoadAuthorizeDotNet(false);
    //   // (global as any).rudderanalytics?.track("AFFIRM Selected");
    //   (global as any).rudderanalytics?.track(
    //     "1C AFFIRM Selected",
    //     {},
    //     {
    //       anonymousId: rudderStackID,
    //     }
    //   );

    //   if (typeof window !== "undefined") {
    //     console.log((window as any).fbq);
    //     // console.log(global.fbq);
    //     if ((window as any).fbq) {
    //       let prodObj = [...productsObj];
    //       let prodIds = [];
    //       let totalQty = 0;
    //       let totalPrice = 0;
    //       let contentNames = [];

    //       // console.log("PRODS obj");
    //       // console.log(productsObj);

    //       for (let i = 0; i < prodObj.length; i++) {
    //         let prd = prodObj[i];
    //         if (prd) {
    //           totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
    //           totalPrice =
    //             totalPrice +
    //             (prd.price ? prd.price : null) *
    //               (prd.quantity ? prd.quantity : null);
    //           prodIds.push(prodObj[i].id);
    //           contentNames.push(prd.title);
    //         }
    //       }

    //       (window as any).fbq("track", "AddPaymentInfo", {
    //         content_type: "product",
    //         content_ids: prodIds,
    //         content_category: "AFFIRM",
    //         num_items: totalQty,
    //         value: totalPrice,
    //         currency: currency ? currency : null,
    //         content_name: contentNames,
    //       });
    //     }
    //   }
    //   // (global as any).rudderanalytics?.track("Payment method selected", {
    //   //   payment_method: 'AFFIRM'
    //   // });
    //   setExpanded(!isExpanded);
    //   //   props.encrpted.merchant_package_id = methods.merchant_package_id;
    //   props.encrypted.merchant_package_id = methods.merchant_package_id;
    //   props.encrypted.package_name = package_name;
    //   props.merchantPackageId(methods.merchant_package_id, "");
    //   props.activeMethod("AFFIRM");
    //   props.setError("");
    //   props.setDisable(false);

    //   // if (props.parentActiveMethod != "") {
    //   props.parentActiveMethod("AFFIRM");
    //   // }
    // }
    else if (props.id == "SQUARE") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(true);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "SQUARE",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("SQUARE");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("SQUARE");
      // }
    } else if (props.id == "FOREE") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(true);
      props.setLoadJazzCashC(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadPayFast(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "FOREE",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("FOREE");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("FOREE");
      // props.foreePaymentCheckoutHandler()
      // }
    } else if (props.id == "JAZZCASH_C") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(true);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "JazzCash_C",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("JazzCash_C");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("JazzCash_C");
      // props.foreePaymentCheckoutHandler()
      // }
    } else if (props.id == "SEZZLE") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(true);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "SEZZLE",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("SEZZLE");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("SEZZLE");
      // }
    } else if (props.id == "JAZZCASH") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(true);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
    if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "JAZZCASH",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("JAZZCASH");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("JAZZCASH");
      // }
    } else if (props.id == "PAYFAST") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(true);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "PAYFAST",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("PAYFAST");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("PAYFAST");
      // }
    } else if (props.id == "ALFALAH") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(true);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      (global as any).rudderanalytics?.track(
        "1C_ALFALAH_SELECTED",
        // {},
        {
          anonymousId: rudderStackID,
        }
      );

      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "ALFALAH",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("ALFALAH");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("ALFALAH");
      // }
    } else if (props.id == "UBL") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(true);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
     if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "UBL",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("UBL");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("UBL");
      // }
    } else if (props.id == "ALFA") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(true);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBrainTree(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
     if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "ALFA",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("ALFA");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("ALFA");
      // }
    } else if (props.id == "BRAINTREE") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadBrainTree(true);
      props.setLoadNift(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
     if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "BRAINTREE",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("BRAINTREE");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("BRAINTREE");
      // }
    } else if (props.id == "NIFT") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(true);
      props.setLoadBrainTree(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
    if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "NIFT",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("NIFT");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("NIFT");
      // }
    } else if (props.id == "UPLIFT") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadAlfalah(false);
      props.setLoadPayFast(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      props.setLoadBrainTree(false);
      props.setLoadNab(false);
      // props.setLoadUplift(true);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
     if (typeof window !== "undefined") {
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "UPLIFT",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("UPLIFT");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("UPLIFT");
      // }
      setTimeout(() => {
        props.upliftPaymentMethodHandler();
      }, 3000);
    } else if (props.id == "NAB") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      props.setLoadBrainTree(false);
      // props.setLoadUplift(false);
      props.setLoadNab(true);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
    if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "NAB",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("NAB");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("NAB");
      // }
    } else if (props.id == "BITPAY") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      props.setLoadBrainTree(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBitPay(true);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
     if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);
        // console.log(global.fbq);
        if ((window as any).fbq) {
          let prodObj = [...productsObj];
          let prodIds = [];
          let totalQty = 0;
          let totalPrice = 0;
          let contentNames = [];

          // console.log("PRODS obj");
          // console.log(productsObj);

          for (let i = 0; i < prodObj.length; i++) {
            let prd = prodObj[i];
            if (prd) {
              totalQty = totalQty + (prd.quantity ? prd.quantity : 1);
              totalPrice =
                totalPrice +
                (prd.price ? prd.price : null) *
                  (prd.quantity ? prd.quantity : null);
              prodIds.push(prodObj[i].id);
              contentNames.push(prd.title);
            }
          }

          (window as any).fbq("track", "AddPaymentInfo", {
            content_type: "product",
            content_ids: prodIds,
            content_category: "BITPAY",
            num_items: totalQty,
            value: totalPrice,
            currency: currency ? currency : null,
            content_name: contentNames,
          });
        }
      }
      // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("BITPAY");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("BITPAY");
      // }
    } else if (props.id == "PINWHEEL") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      props.setLoadBrainTree(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(true);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("SQUARE Selected");
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("PINWHEEL");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("PINWHEEL");
      // }
    } else if (props.id == "AUTHORIZE.NET") {
      props.setCardSelect(false);
      props.setProcessingAmount(price);
      props.setProcessingFee("");
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadQisstPayInSix(false);
      props.setLoadQisstPayInThree(false);
      props.setLoadQisstPayInTwo(false);
      props.setPackageSelected("");
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadClover(false);
      props.setLoadCardPointe(false);
      props.setLoadEasyPaisa(false);
      props.setLoadVault(false);
      props.setLoadEasyPaisaDirect(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      // props.setLoadAffirm(false);
      props.setLoadSquare(false);
      props.setLoadForee(false);
      props.setLoadJazzCashC(false);
      props.setLoadPayFast(false);
      props.setLoadAlfalah(false);
      props.setLoadAlfa(false);
      props.setLoadUBL(false);
      props.setLoadSezzle(false);
      props.setLoadJazzCash(false);
      props.setLoadNift(false);
      props.setLoadBrainTree(false);
      // props.setLoadUplift(false);
      props.setLoadNab(false);
      props.setLoadBitPay(false);
      props.setLoadPinWheel(false);
      // props.setUpliftVirtualCardAvailable(false);
      props.setLoadAuthorizeDotNet(true);
     // (global as any).rudderanalytics?.track("Payment method selected", {
      //   payment_method: 'SQUARE'
      // });
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("AUTHORIZE.NET");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("AUTHORIZE.NET");
      // }
    }
  };

  useEffect(() => {
    if (
      // props.loadUplift &&
      methods.package.package_name.toString().toLocaleUpperCase() === "UPLIFT"
    ) {
      props.initUpliftHandler();
      // props.initUpliftHandler()
    }
  }, []);

  // useEffect(() => {
    // if (props.loadPayFast && props.id == "PAYFAST") {
      // if (props.payFastToggle === true) {
      //   setShow(true);
      //   handleShow();
      // } else if (props.payFastToggle === false) {
      //   setShow(false);
      //   handleClose();
      // }
    // }
  // }, [props.payFastToggle]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [number, setNumber] = useState<string>("");
  const quantityInputRef = useRef<any>(null);
  useEffect(() => {
    const ignoreScroll = (e: any) => {
      e.preventDefault();
    };
    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);

  const validateCardNumberHandler = () => {
    if (number.length < 20) {
      props.setError("Please enter minimum 20 digits card number");
      return true;
    } else {
      props.setError("");
      return false;
    }
  };

  const [inProcessing, setInProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return (
    <div className="pointer">
      <div
        className={
          methods.package.package_name.toString().toLocaleUpperCase() !=
            "GOOGLEPAY" &&
          price <= methods.max &&
          price >= methods.min
            ? "drop-container-2"
            : ""
        }
      >
        {price <= methods.max && price >= methods.min && (
          <div
            onClick={(e) => {
              toggleExpanded(methods.package.package_name);

              // --- Google Analytics --- //
              if (GoogleAnalyticsCred?.type === "UA") {
                console.log(
                  "GoogleAnalyticsCred.tracking_id => ",
                  GoogleAnalyticsCred?.tracking_id
                );
                ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
                ReactGA.event({
                  category: "Button",
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
                  category: "Button",
                  action: GAMessages.GATEWAY_SELECTED,
                });
              }
              // --- Google Analytics End --- //
            }}
            className=" flex align-center"
          >
            {methods.package.package_name.toString().toLocaleUpperCase() !=
              "GOOGLEPAY" && (
              <img
                className="mr-20"
                src={
                  (!props.loadCOD &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "COD") ||
                  (!props.paypal &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PAYPAL") ||
                  (!props.loadCard &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CARD") ||
                  (!props.loadClover &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CLOVER") ||
                  (!props.loadCardPointe &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CARDPOINTE") ||
                  (!props.loadEasyPaisa &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "EASYPAISA") ||
                  (!props.loadVault &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "VAULT") ||
                  (!props.loadEasyPaisaDirect &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "EASYPAISA_DIRECT") ||
                  (!props.loadDirectBank &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "DIRECT_BANK_TRANSFER") ||
                  (!props.loadSquare &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "SQUARE") ||
                  (!props.loadForee &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "FOREE") ||
                  (!props.loadJazzCashC &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "JAZZCASH_C") ||
                  (!props.loadPayFast &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PAYFAST") ||
                  (!props.loadAlfalah &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "ALFALAH") ||
                  (!props.loadUBL &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "UBL") ||
                  (!props.loadAlfa &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "ALFA") ||
                  (!props.loadSezzle &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "SEZZLE") ||
                  (!props.loadJazzCash &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "JAZZCASH") ||
                  (!props.loadKlarna &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "KLARNA") ||
                  (!props.loadBrainTree &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "BRAINTREE") ||
                  (!props.loadNift &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "NIFT") ||
                  (!props.loadUplift &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "UPLIFT") ||
                  (!props.loadNab &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "NAB") ||
                  (!props.loadBitPay &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "BITPAY") ||
                  (!props.loadPinWheel &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PINWHEEL") ||
                  (!props.loadAuthorizeDotNet &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "AUTHORIZE.NET")
                    ? //     ||
                      // (!props.loadAffirm &&
                      //   methods.package.package_name
                      //     .toString()
                      //     .toLocaleUpperCase() == "AFFIRM")
                      "/assets/unchecked.png"
                    : "/assets/filled.png"
                }
                alt=""
              />
            )}

            <div className="drop-heading-container w-100">
              {methods.package.package_name.toString().toLocaleUpperCase() !=
                "GOOGLEPAY" && (
                <p className="text-18 font-medium text-start">
                  {methods.package.package_name
                    .toString()
                    .toLocaleUpperCase() == "COD" ? (
                    <img
                      className="codTag"
                      src="/assets/codTag.svg"
                      alt="cash on deleviery"
                    ></img>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PAYPAL" ? (
                    <img src="/assets/paypalTag.svg"></img>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "DIRECT_BANK_TRANSFER" ? (
                    <>
                      <img
                        style={{ marginTop: "-6px", marginRight: "5px" }}
                        src="/assets/bankTransfer.svg"
                      ></img>
                      DIRECT BANK TRANSFER
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CARD" ? (
                    <>
                      <img
                        style={{ height: "30pt" }}
                        className="cardnew1svg"
                        src="/assets/Frame 2.png"
                      ></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CLOVER" ? (
                    <>
                      <img
                        style={{ height: "20pt" }}
                        className="cardnew1svg"
                        src="/assets/clover-logo.svg"
                      ></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "EASYPAISA" ? (
                    <>
                      <img className="epTag" src="/assets/epTag.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "UPLIFT" ? (
                    <>
                      Pay Monthly With{" "}
                      <img
                        style={{ width: "60pt", height: "30pt" }}
                        src="/assets/uplift-logo.png"
                      ></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "FOREE" ? (
                    <>FOREE</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "UBL" ? (
                    <>
                      <img
                        style={{ height: "40pt" }}
                        src="assets/ubl.png"
                        alt="Logo"
                      />
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "JAZZCASH" ? (
                    <>
                      <img
                        style={{ height: "30pt" }}
                        src="assets/jazzcash.png"
                        alt="Logo"
                      />
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "JAZZCASH_C" ? (
                    <>
                      <img
                        style={{ height: "30pt" }}
                        src="assets/jazzcash.png"
                        alt="Logo"
                      />
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "ALFA" ? (
                    <>
                      <img
                        style={{ height: "30pt" }}
                        src="assets/bankAlfalah.png"
                        alt="Logo"
                      />
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "ALFALAH" ? (
                    <>
                      <img
                        style={{ height: "30pt" }}
                        src="assets/bankAlfalah.png"
                        alt="Logo"
                      />
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "JAZZCASH_C" ? (
                    <>JAZZCASH_C</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "SEZZLE" ? (
                    <>SEZZLE</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "JAZZCASH" ? (
                    <>JAZZCASH</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "EASYPAISA_DIRECT" ? (
                    <>
                      <img src="/assets/epTag.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "KLARNA" ? (
                    <>
                      <img src="/assets/klarnaTag.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PAYFAST" ? (
                    <>
                      <img height={"30pt"} src="/assets/payfast-logo.png"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "SQUARE" ? (
                    <>
                      {" "}
                      <img src="/assets/square.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "BRAINTREE" ? (
                    <>
                      {" "}
                      <img
                        className="cardnew1svg"
                        src="/assets/cardnew1.svg"
                      ></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "NIFT" ? (
                    <> {methods.package.package_name}</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "UPLIFT" ? (
                    <> {methods.package.package_name}</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PINWHEEL" ? (
                    <> {methods.package.package_name}</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "AUTHORIZE.NET" ? (
                    <> {methods.package.package_name}</>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "NAB" ? (
                    <> {methods.package.package_name}</>
                  ) : (
                    //  :
                    // methods.package.package_name
                    //     .toString()
                    //     .toLocaleUpperCase() == "AFFIRM" ? (
                    //   <>
                    //     <img src="/assets/affirm.png"></img>
                    //   </>
                    // )
                    methods.package.package_name
                  )}
                </p>
              )}
              {methods.package.package_name.toString().toLocaleUpperCase() ==
                "GOOGLEPAY" && (
                <div
                  style={{ width: "100%" }}
                  id="payment-request-button"
                ></div>
              )}
            </div>
          </div>
        )}
        {props.loadCard && props.id == "CARD" && (
          <div>
            {isGuest === true ? (
              <CardDetail
                setNumber={props.setNumber}
                setCvc={props.setCvc}
                setName={props.setName}
                setExpiry={props.setExpiry}
                encrypted={props.encrypted}
                setExpiryValidated={props.setExpiryValidated}
              />
            ) : (
              // <SkyFlowElements />
              <CardDetail
                setNumber={props.setNumber}
                setCvc={props.setCvc}
                setName={props.setName}
                setExpiry={props.setExpiry}
                encrypted={props.encrypted}
                setExpiryValidated={props.setExpiryValidated}
              />
            )}
          </div>
        )}
        {props.loadClover && props.id == "CLOVER" && (
          <div>
            {isGuest === true ? (
              <CardDetail
                setNumber={props.setNumber}
                setCvc={props.setCvc}
                setName={props.setName}
                setExpiry={props.setExpiry}
                encrypted={props.encrypted}
                setExpiryValidated={props.setExpiryValidated}
              />
            ) : (
              // <SkyFlowElements />
              <CardDetail
                setNumber={props.setNumber}
                setCvc={props.setCvc}
                setName={props.setName}
                setExpiry={props.setExpiry}
                encrypted={props.encrypted}
                setExpiryValidated={props.setExpiryValidated}
              />
            )}
          </div>
        )}

        {props.loadJazzCash && props.id == "JAZZCASH" && (
          <div>
            <div className="center-box">
              <div>
                <Row className="mt-30 mb-10">
                  <Col xs={6} md={6} className="">
                    <TextField
                      autoFocus
                      size="small"
                      className="single-input"
                      id="filled-basic-card"
                      // label="Card Number"
                      placeholder="CNIC Number"
                      variant="filled"
                      style={{ width: "100%" }}
                      InputProps={{
                        className: "input-card",
                        inputMode: "numeric",
                      }}
                      value={cnic}
                      type="text"
                      onChange={(e) => {
                        setCnic(e.target.value);
                        props.setCnic(e.target.value);
                      }}
                    />
                  </Col>

                  <Col xs={6} md={6} className="">
                    <TextField
                      size="small"
                      className="single-input"
                      id="filled-basic-card"
                      // label="Card Number"
                      placeholder="Phone Number"
                      variant="filled"
                      style={{ width: "100%" }}
                      InputProps={{
                        className: "input-card",
                        inputMode: "numeric",
                      }}
                      value={jazzCashNumber}
                      type="number"
                      inputMode="numeric"
                      onChange={(e) => {
                        setJazzCashNumber(e.target.value);
                        props.setJazzCashNumber(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        )}

        <Modal
          size={"lg"}
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Verification</Modal.Title>
          </Modal.Header>
          <Modal.Body className={`justify-content-center`}>
            <p className="text-center">
              <img
                src="/assets/send.svg"
                style={{ marginLeft: "-24pt" }}
                width={"100pt"}
                height={"130pt"}
                alt="Image"
                className="mb-2"
              />
            </p>
            <p className="text-center">Enter OTP for PayFast to Verify</p>
            <OtpInput
              value={otpValue}
              onChange={(e: any) => {
                setOtpValue(e);
              }}
              hasErrored={true}
              containerStyle={`otp-fastPay`}
              inputStyle={`width-100-percent`}
              shouldAutoFocus={true}
              isInputNum={true}
              numInputs={6}
              separator={<span> -- </span>}
            />
            {error && (
              <p className="text-start d-flex mt-3 mb-0">
                <img src="assets/error.svg" alt="error" className="img-fluid" />
                <p className="text-danger ms-1">{error}</p>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="success"
              disabled={
                otpValue.length < 6 || inProcessing === true ? true : false
              }
              onClick={() => {
                setError("");
                setInProcessing(true);
                try {
                  var myHeaders = new Headers();
                  myHeaders.append("Content-Type", "application/json");
                  myHeaders.append("Authorization", token);
                  myHeaders.append("identity-token", ctxIdentiyToken);

                  var raw = JSON.stringify({
                    customer_name: name + " " + lastName,
                    customer_email: email,
                    customer_cnic: cnic,
                    customer_phone: intlNumber,
                    account_number: number,
                    otp: otpValue,
                    order_id: props.payFastOrderID,
                    order_number: props.payFastOrderNumber,
                  });

                  fetch(
                    `${process.env.REACT_APP_ORDER_MS_API_KEY}/payfast_send_otp`,
                    {
                      method: "POST",
                      headers: myHeaders,
                      body: raw,
                      redirect: "follow",
                    }
                  )
                    .then((response) => response.json())
                    .then((result) => {
                      props.setPayFastToggle(false);
                      setInProcessing(false);
                      console.log(result);
                      const a = document.createElement("a");
                      a.href = result.redirect_url;
                      a.click();
                    })
                    .catch((error: any) => {
                      setInProcessing(false);
                      console.log("error", error);
                      setError(
                        error?.response?.data?.message ??
                          "Something went wrong."
                      );
                    });
                } catch (error: any) {
                  setInProcessing(false);
                  console.log(error);
                  setError(
                    error?.response?.data?.message ?? "Something went wrong."
                  );
                }
              }}
            >
              {inProcessing === true ? "Verifying..." : "Verify"}
            </Button>
          </Modal.Footer>
        </Modal>

        {props.loadPayFast && props.id == "PAYFAST" && (
          <div>
            {/* <div className="center-box">
              <div>
                <Row className="mt-30 mb-10">
                  <Col xs={12} md={12} className="">
                    <TextField
                      autoFocus
                      size="small"
                      className="single-input"
                      id="filled-basic-card"
                      // label="Card Number"
                      placeholder="Account Number"
                      variant="filled"
                      style={{ width: '100%' }}
                      InputProps={{
                        className: 'input-card',
                        inputMode: 'numeric',
                      }}
                      value={number}
                      type="text"
                      ref={quantityInputRef}
                      // onInput={(e: any) => {
                      //   let value = e.target.value;
                      //   value = value.replaceAll(" ", "");

                      //   // value = Math.max(0, parseInt(value)).toString().slice(0, 16);
                      //   value = parseInt(value).toString().slice(0, 20);
                      //   let joy = value.match(/.{1,4}/g);
                      //   value = joy ? joy.join(" ") : "";
                      // }}
                      onBlur={(e) => {
                        if (number != '') {
                          validateCardNumberHandler()
                        }
                      }}
                      onChange={(e: any) => {
                        if (window.location.pathname != '/failure') {
                          // const regexTest = /^[0-9 ]+$/;
                          let value = e.target.value

                          // value = value.replaceAll(" ", "");
                          // let joy = value.match(/.{1,4}/g);
                          // joy = joy ? joy.join(" ") : "";

                          // if ((joy == "" || regexTest.test(joy)) && joy.length < 20) {
                          setNumber(value)
                          props.setNumber(value)
                          // }
                        } else {
                          // const regexTest = /^[0-9 ]+$/;
                          let value = e.target.value
                          // if (value.length < 20) {
                          setNumber(value)
                          props.setNumber(value)
                          if (props.encrypted != null) {
                            props.encrypted.card_number = e.target.value
                          }
                        }
                      }}
                    />
                  </Col>
                  <Col xs={12} md={12} className="mt-3">
                    <TextField
                      size="small"
                      className="single-input"
                      id="filled-basic-card"
                      // label="Card Number"
                      placeholder="CNIC Number"
                      variant="filled"
                      style={{ width: '100%' }}
                      InputProps={{
                        className: 'input-card',
                        inputMode: 'numeric',
                      }}
                      value={cnic}
                      type="text"
                      onChange={(e) => {
                        setCnic(e.target.value)
                        props.setCnic(e.target.value)
                      }}
                    />
                  </Col>
                </Row>
                {props.payFastToggle === true ? (
                  <Button variant="danger" onClick={handleShow}>
                    Click To Verify OTP
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </div> */}
            <PayFast
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadCardPointe && props.id == "CARDPOINTE" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadAlfalah && props.id == "ALFALAH" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadNab && props.id == "NAB" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadPinWheel && props.id == "PINWHEEL" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadAuthorizeDotNet && props.id == "AUTHORIZE.NET" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}

        {props.loadBrainTree && props.id == "BRAINTREE" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadNift && props.id == "NIFT" && (
          <div>
            <CardDetailNift
              niftPaymentCheckoutHandler={props.niftPaymentCheckoutHandler}
              otpPage={props.otpPage}
            />
          </div>
        )}
        {props.loadUplift && props.id == "UPLIFT" && (
          <div id="uplift-container"></div>
        )}
        {props.loadSquare && props.id == "SQUARE" && (
          <div className="mt-20">
            {/* <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            /> */}
            <SquarePaymentsForm
              applicationId={"sq0idp-OZOgZwD6xPMIimfw84tyVA"}
              cardTokenizeResponseReceived={(
                token: Square.TokenResult,
                buyer?: Square.VerifyBuyerResponseDetails | null
              ) => {
                props.squarePaymentCheckoutHandler(token.token ?? "");
              }}
              createVerificationDetails={() => ({
                amount: String(price),
                billingContact: {
                  addressLines: [address.trimStart()],
                  familyName: name,
                  givenName: lastName,
                  countryCode: countryCode.toLocaleUpperCase(),
                  city: city,
                },
                currencyCode: currency,
                intent: "CHARGE",
              })}
              locationId={"LSPZFKDSAX71T"}
            >
              <CreditCardInput text="Pay Now" />
            </SquarePaymentsForm>
          </div>
        )}
        {props.loadForee &&
          props.id == "FOREE" &&
          props.foreePaymentCheckoutHandler()}
        {props.loadJazzCashC &&
          props.id == "JAZZCASH_C" &&
          props.jazzCashCPaymentCheckoutHandler()}
        {/* {props.loadAlfa && props.id == 'ALFA' && (
          <div>
            <form action="https://sandbox.bankalfalah.com/SSO/SSO/SSO" id="PageRedirectionForm" method="post">
              <input id="AuthToken" name="AuthToken" type="hidden" value={AuthToken} />
              <input id="RequestHash" name="RequestHash" type="hidden" value={RequestHash} />
              <input id="ChannelId" name="ChannelId" type="hidden" value={ChannelId} />
              <input id="Currency" name="Currency" type="hidden" value={Currency} />
              <input id="IsBIN" name="IsBIN" type="hidden" value={IsBIN} />
              <input id="ReturnURL" name="ReturnURL" type="hidden" value={ReturnURL} />
              <input id="MerchantId" name="MerchantId" type="hidden" value={MerchantId} />
              <input id="StoreId" name="StoreId" type="hidden" value={StoreId} />
              <input id="MerchantHash" name="MerchantHash" type="hidden" value={MerchantHash} />
              <input id="MerchantUsername" name="MerchantUsername" type="hidden" value={MerchantUsername} />
              <input id="MerchantPassword" name="MerchantPassword" type="hidden" value={MerchantPassword} />
              <input id="TransactionTypeId" name="TransactionTypeId" type="hidden" value={TransactionTypeId} />
              <input id="TransactionReferenceNumber" name="TransactionReferenceNumber" placeholder="Order ID"
                type="hidden" value={TransactionReferenceNumber} />
              <input id="TransactionAmount" name="TransactionAmount" placeholder="Transaction Amount"
                type="hidden" value={TransactionAmount} />

              <button type="submit" className="btn btn-custon-four btn-danger text-center" id="run">PAY ONLINE</button>
            </form>
          </div>
        )} */}
        {props.loadEasyPaisa && props.id == "EASYPAISA" && (
          <div>
            <Row className="mt-30 mb-10">
              <Col md={12}>
                <TextField
                  className="single-input "
                  id="filled-basic"
                  label="Phone Number"
                  variant="filled"
                  style={{ width: "100%" }}
                  autoFocus
                  type="text"
                  InputProps={{
                    className: "user-input-card border-grey",
                  }}
                  value={props.phoneNumber}
                  // onBlur={(e) => {
                  //   validatePhoneNumberHandler(props.phoneNumber);
                  // }}
                  onChange={(e) => {
                    if (window.location.pathname == "/failure") {
                      props.encrypted.easy_paisa_phone = e.target.value;
                    }
                    props.setPhoneNumber(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </div>
        )}

        {props.loadDirectBank &&
          props.id == "DIRECT_BANK_TRANSFER" &&
          props.loadEasyPaisaDirect === false && (
            <div>
              <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                Please make the payment through Wallet/Bank to the following
                account details (mentioned below). Once you have made the
                payment, please share the proof of payment (screenshot/slip),
                order ID & order name with us at the provided mobile number
                (mentioned at the end):
              </p>
              {accounts.map((account: any) => (
                <>
                  {account.bank.name != "Tameer Microfinance Bank" ? (
                    <Row className="mt-10 mb-10">
                      <Col md={12} lg={12} xs={12}>
                        <div style={{ display: "flex" }}>
                          <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                            Account Name:
                          </p>
                          <p> {account.accountHolderName}</p>
                        </div>
                      </Col>
                      <Col md={12} lg={12} xs={12}>
                        <div style={{ display: "flex" }}>
                          <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                            Bank Name:
                          </p>
                          <p> {account.bank.name}</p>
                        </div>
                      </Col>
                      <Col md={12} lg={12} xs={12}>
                        <div style={{ display: "flex" }}>
                          <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                            Account number:
                          </p>
                          <p> {account?.accountNumber}</p>
                        </div>
                      </Col>
                      <Col md={12} lg={12} xs={12}>
                        <div style={{ display: "flex" }}>
                          <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                            IBAN:
                          </p>
                          <p> {account.ibanNumber}</p>
                        </div>
                      </Col>

                      <Col md={12} lg={12} xs={12}>
                        <div style={{ display: "flex" }}>
                          <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                            Proof to be shared on Email:
                          </p>
                          <div>
                            {merchantEmail &&
                              merchantEmail.map(
                                (merchant_email: any, index: any) => (
                                  <p> {merchant_email}</p>
                                )
                              )}
                          </div>
                        </div>
                      </Col>

                      {merchantPhone != null ||
                      merchantPhone != undefined ||
                      merchantPhone != "" ? (
                        <Col md={12} lg={12} xs={12}>
                          <div style={{ display: "flex" }}>
                            <p
                              style={{ fontWeight: "bold", marginRight: "5px" }}
                            >
                              Proof to be shared on Phone:
                            </p>
                            <div>
                              {merchantPhone &&
                                merchantPhone.map(
                                  (merchant_phone: any, index: any) => (
                                    <p> {merchant_phone}</p>
                                  )
                                )}
                            </div>
                          </div>
                        </Col>
                      ) : (
                        ""
                      )}
                      <Col md={12} lg={12} xs={12}>
                        <div style={{ display: "flex" }}>
                          <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                            Proof to be shared on Phone:
                          </p>
                          <div>
                            {merchantPhone &&
                              merchantPhone.map(
                                (merchant_phone: any, index: any) => (
                                  <p> {merchant_phone}</p>
                                )
                              )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ) : null}
                </>
              ))}
            </div>
          )}
        {props.loadEasyPaisaDirect && props.id == "EASYPAISA_DIRECT" && (
          <div>
            <p style={{ marginTop: "20px", fontWeight: "bold" }}>
              Please make the payment through Wallet/Bank to the following
              account details (mentioned below). Once you have made the payment,
              please share the proof of payment (screenshot/slip), order ID &
              order name with us at the provided mobile number (mentioned at the
              end):
            </p>
            {accounts.map((account: any) => (
              <>
                {account.bank.name === "Tameer Microfinance Bank" ? (
                  <Row className="mt-10 mb-10">
                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Account Holder Name:
                        </p>
                        <p> {account.accountHolderName}</p>
                      </div>
                    </Col>
                    {/* <Col md={12} lg={12} xs={12}>
                    <div style={{ display: 'flex' }}>
                      <p style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Bank Name:
                      </p>
                      <p> {account.bank.name}</p>
                    </div>
                  </Col> */}
                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          EasyPaisa Account number:
                        </p>
                        <p> {account?.accountNumber}</p>
                      </div>
                    </Col>
                    {/* <Col md={12} lg={12} xs={12}>
                    <div style={{ display: 'flex' }}>
                      <p style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        IBAN:
                      </p>
                      <p> {account.ibanNumber}</p>
                    </div>
                  </Col> */}

                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Proof to be shared on Email:
                        </p>
                        <div>
                          {merchantEmail &&
                            merchantEmail.map(
                              (merchant_email: any, index: any) => (
                                <p> {merchant_email}</p>
                              )
                            )}
                        </div>
                      </div>
                    </Col>

                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Proof to be shared on Phone:
                        </p>
                        <div>
                          {merchantPhone &&
                            merchantPhone.map(
                              (merchant_phone: any, index: any) => (
                                <p> {merchant_phone}</p>
                              )
                            )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : null}
              </>
            ))}
          </div>
        )}
        {props.loadDirectBank &&
          props.id == "DIRECT_BANK_TRANSFER" &&
          props.loadEasyPaisaDirect === true && (
            <div>
              <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                Please make the mentioned payment through Bank Transfer to the
                following Account details mentioned below. Once you have made
                the payment, kindly share the proof slip with us at the provided
                email address and wait for us to share the dispatch details with
                you.
              </p>
              {accounts.map((account: any) => (
                <>
                  <Row className="mt-10 mb-10">
                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Account Holder Name:
                        </p>
                        <p> {account.accountHolderName}</p>
                      </div>
                    </Col>
                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Bank Name:
                        </p>
                        <p> {account.bank.name}</p>
                      </div>
                    </Col>
                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Account no:
                        </p>
                        <p> {account?.accountNumber}</p>
                      </div>
                    </Col>
                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          IBAN:
                        </p>
                        <p> {account.ibanNumber}</p>
                      </div>
                    </Col>

                    <Col md={12} lg={12} xs={12}>
                      <div style={{ display: "flex" }}>
                        <p style={{ fontWeight: "bold", marginRight: "5px" }}>
                          Email:
                        </p>
                        <div>
                          {merchantEmail &&
                            merchantEmail.map(
                              (merchant_email: any, index: any) => (
                                <p> {merchant_email}</p>
                              )
                            )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default MethodCard;
