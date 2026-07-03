import { useContext, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { encode, decode } from "js-base64";
import { Context as CheckoutContext } from "../context/checkoutContext";
import { orderService } from "../../services/order.service";
import { locationService } from "../../services/location.service";
import { loadStripe } from "@stripe/stripe-js/pure";
import { CanMakePaymentResult } from "@stripe/stripe-js";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { merchantService } from "../../services/merchant.service";
import { IPlaceOrder } from "../../interfaces/apis/place-order.interface";
import { IRequest } from "../../interfaces/apis/order-request-log.interface";
import axios from "axios";
import { IUpSellResponse } from "../../interfaces/apis/upsell.interface";
import { percentageHelper } from "../../utils/helper";
import { generalService } from "../../services/general.service";
import { EEventName } from "../../enums/event-name.enum";
import { addressService } from "../../services/address.service";
//import { IUpliftVirtualCard } from "../../interfaces/uplidt-virtual-card.interface";
import { skyFlowService } from "../../services/skyflow.service";
import Skyflow from "skyflow-js";
import usePaymentDetailHook from "./usePaymentDetail";
import { stat } from "fs";

export enum EActiveInstructionSlide {
  ONE,
  TOW,
  THREE,
  FOUR,
}

export const usePaymentSelectionHook = () => {
  const {
    state: {
      currency,
      totalAmount,
      taxPrice,
      shippingPrice,
      shippingName,
      token,
      is_headless,
      src,
      shippingMethods,
      url,
      platform_fee,
      name: firstName,
      lastName,
      email,
      phoneNumber: phNumber,
      city,
      address,
      identityToken: ctxIdentiyToken,
      customerId,
      country,
      billingZip,
      mall_taxes,
      state,
      isGuest,
      sku,
      cart_id,
      platForm_bigCommerce,
      queryString,
      shippingZip,
      discountedAmount,
      couponCode,
      productsObj,
      checkout_url,
      selectedBank,
      merchant_call_back_url,
      place_order_on_merchant_site,
      accountNumber,
      meta,
      isExistingUser,
      isTez,
      redirectUrl,
      callBackUrl,
      storeType,
      merchantOrderId,
      merchant_order_id,
      merchantEndRequest,
      intlNumber,
      is4gives,
      MerchantId,
      selectedShipping,
      isStackBuilderEnabled,
      billingAddress,
      cartSessionID,
      billingCity,
      billingCountry,
      billingState,
      emailValidated,
      shippingdetailsAPI,
      merchantWalletIsEnabled,
      walletBalance,
      totalProccessingFee,
      merchantWalletFeePercentage,
      selectedMerchants,
      wordUrl,
      line_items,
      payFastDetails,
      payFastScreen,
      ipAddress,
      MerchantUserId,
      // card_number,
      // card_cvv,
      // card_expiry_month,
      // card_expiry_year,
      // card_skyflow_id,
      // card_pin_id,
      newSessionID,
      mall_ID,
      globalCartObject,
      store_type,
      invoice_id,
      AlfalahHTMLSnippet,
      headless_url,
      tax_flag,
      shipping_flag,
      link_id,
      rudderStackID,
      packageSelectedQP,
      time_stamp,
      isEventsEnabled,
      user_type,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const {
    states: { p_fee },
    setStates: { setP_fee },
  } = usePaymentDetailHook();
  const [showInstructionModal, setShowInstructionModal] =
    useState<boolean>(false);
  const [activeInstructionSlide, setActiveInstructionSlide] =
    useState<EActiveInstructionSlide>(EActiveInstructionSlide.ONE);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [loadQisstPay, setLoadQisstPay] = useState<boolean>(false);
  const [loadQisstPayInSix, setLoadQisstPayInSix] = useState<boolean>(false);
  const [loadQisstPayInSixCC, setLoadQisstPayInSixCC] =
    useState<boolean>(false);
  const [loadQisstPayInThree, setLoadQisstPayInThree] =
    useState<boolean>(false);
  const [loadQisstPayInTwo, setLoadQisstPayInTwo] = useState<boolean>(false);
  const [loadQisstPayInThreeCC, setLoadQisstPayInThreeCC] =
    useState<boolean>(false);
  const [loadQisstPayInFourCC, setLoadQisstPayInFourCC] =
    useState<boolean>(false);
  const [loadQisstPayInTwelveCC, setLoadQisstPayInTwelveCC] =
    useState<boolean>(false);
  const [loadGooglePay, setLoadGooglePay] = useState<boolean>(false);
  const [loadCOD, setLoadCOD] = useState<boolean>(false);
  const [loadPaypal, setLoadPayPal] = useState<boolean>(false);
  const [loadCard, setLoadCard] = useState<boolean>(false);
  const [loadClover, setLoadClover] = useState<boolean>(false);
  const [loadCardPointe, setLoadCardPointe] = useState<boolean>(false);
  const [loadEasyPaisa, setLoadEasyPaisa] = useState<boolean>(false);
  const [loadVault, setLoadVault] = useState<boolean>(false);
  const [loadBrainTree, setLoadBrainTree] = useState<boolean>(false);
  const [loadDirectBank, setDirectBank] = useState<boolean>(false);
  const [loadSquare, setLoadSquare] = useState<boolean>(false);
  const [encrypted, setEncrypted] = useState<any>([]);
  const [shippingM, setShippingM] = useState<any>([]);
  const [others, setOthers] = useState<any>([]);
  const [qisstPay, setQisstPay] = useState<any>([]);
  const [hideGooglePay, setHideGoogle] = useState<boolean>(false);
  const [loadKlarna, setLoadKlarna] = useState<boolean>(false);
  const [loadAffirm, setLoadAffirm] = useState<boolean>(false);
  const [loadNift, setLoadNift] = useState<boolean>(false);
  const [loadAlfa, setLoadAlfa] = useState<boolean>(false);
  const [loadUBL, setLoadUBL] = useState<boolean>(false);
  const [loadAlfalah, setLoadAlfalah] = useState<boolean>(false);
  const [sessionID, setSessionID] = useState<string>("");
  const [orderID, setOrderID] = useState<string>("");
  const [paymentAlfalah, setPayment] = useState<number>();
  const [showButton, setShowButton] = useState<boolean>(false);
  //const [loadUplift, setLoadUplift] = useState<boolean>(false);
  const [loadNab, setLoadNab] = useState<boolean>(false);
  const [loadBitPay, setLoadBitPay] = useState<boolean>(false);
  const [loadPinWheel, setLoadPinWheel] = useState<boolean>(false);
  const [loadEasyPaisaDirect, setLoadEasyPaisaDirect] =
    useState<boolean>(false);
  const [loadForee, setLoadForee] = useState<boolean>(false);
  const [loadJazzCashC, setLoadJazzCashC] = useState<boolean>(false);
  const [loadSezzle, setLoadSezzle] = useState<boolean>(false);
  const [loadJazzCash, setLoadJazzCash] = useState<boolean>(false);
  const [loadPayFast, setLoadPayFast] = useState<boolean>(false);
  const [loadAuthorizeDotNet, setLoadAuthorizeDotNet] =
    useState<boolean>(false);
  const [merchantPackageId, setMerchantPackageId] = useState<string>("");
  const [activeMethod, setActiveMethod] = useState<string>("");
  const [refNum, setRefNum] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [cnic, setCnic] = useState<string>("");
  const [jazzCashNumber, setJazzCashNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [expiryValidated, setExpiryValidated] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(false);
  const [epNumberValidation, setEpNumberValidation] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [toggleButton, setToggleButton] = useState<boolean>(false);
  const [wallet_Balance, setWalletBalance] = useState<number>();
  const [paymentLimitError, setPaymentLimitError] = useState<boolean>(false);
  const [googlePay, setGooglePay] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<string>("");
  const [merchantPackId, setMerchantPackId] = useState<string>("");
  const [packageSelected, setPackageSelected] = useState<string>(""); //default PAY_IN_4
  const [halfAmountToPay, setHalfAmountToPay] = useState<string | number>("");
  const [processingFee, setProcessingFee] = useState<any>("");
  const [newProcessingFee, setNewProcessingFee] = useState<any>("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loadOrder, setLoadOrder] = useState<boolean>(false);
  const [lineItems, setLineItems] = useState<any>([]);
  const [secondHalfAmountToPay, setSecondHalfAmountToPay] = useState<
    string | number
  >("");
  const [newToken, setNewToken] = useState<string>("");
  const [newRedirectURLAlfalah, setNewRedirectURLAlfalah] =
    useState<string>("");
  const [identityToken, setIdentityToken] = useState<string>("");
  const [view, setView] = useState<string>("");
  const [qisstPayMethods, setQisstPayMethods] = useState<any>([]);
  const [googlePayId, setGooglePayId] = useState<string>("");
  const [redirectLink, setRedirectLink] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [snippet, setSnippet] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentToken, setPaymentToken] = useState<string>("");
  const [wpShippingFlag, setWpShippingFlag] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<any>([]);
  const [processingAmount, setProcessingAmount] = useState<any>("");
  const [addressChanged, setAddressChanged] = useState<boolean>(false);
  const [merchantAccounts, setMerchantAccounts] = useState<any>([]);
  const [merchantEmail, setMerchantEmail] = useState<string>("");
  const [merchantPhone, setMerchantPhone] = useState<string>("");
  const [upSellProducts, setUpSellProducts] = useState<IUpSellResponse[]>([]);
  const [showUpSellModal, setShowUpSellModal] = useState<boolean>(false);
  const [otpPage, setOtpPage] = useState<boolean>(false);
  const [customerCard, setCustomerCard] = useState<any>("");
  const [customerCardId, setCustomerCardId] = useState<any>("");
  const [customerCardNumber, setCustomerCardNumber] = useState<any>("");
  //const [upliftVirtualCardAvailable, setUpliftVirtualCardAvailable] =
  //  useState<boolean>(false);
  const [merchantLogo, setMerchantLogo] = useState<any>("");
  const [merchantBusinessName, setMerchantBusinessName] = useState<any>("");
  const [codPackageID, setCodPackageID] = useState<any>("");
  const [cardSelect, setCardSelect] = useState<Boolean>(false);
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [skyFlowCardID, setSkyFlowCardID] = useState<string>("");
  const [skyFlowPinID, setSkyFlowPinID] = useState<string>("");
  const [payFastToggle, setPayFastToggle] = useState<boolean>(false);
  const [payFastOrderID, setPayFastOrderID] = useState<string>("");
  const [payFastOrderNumber, setPayFastOrderNumber] = useState<string>("");
  const [cardPackageID, setCardPackageID] = useState<any>();
  const [payFastPackageID, setPayFastPackageID] = useState<any>();
  const [vaultPackageID, setVaultPackageID] = useState<any>();
  const [TokenAvailableButton, setTokenAvailableButton] = useState<any>(false);
  const [billingZipCode, setBillingZipCode] = useState<string>("");
  const [shippingZipCode, setShippingZipCode] = useState<string>("");
  const history = useHistory();
  const [isEventTriggered, setIsEventTriggered] = useState(false);
  /**
   * @description close the payment selection instruction modal and select active slide to one
   */
  const closeInstructionModalHandler = () => {
    setShowInstructionModal(false);
    setActiveInstructionSlide(EActiveInstructionSlide.ONE);
  };
  useEffect(() => {
    if (mall_ID && mall_ID !== null && globalCartObject.length === 0) {
      setError("Cart is empty. Can't proceed further - Please close checkout!");
    } else {
      setError("");
    }
  }, [globalCartObject]);

  useEffect(() => {
    // if (paymentLimitError) {
    //   setError(
    //     "No Payment Methods Found, Please make sure your order amount is above Rs. 100!"
    //   );
    // }

    if (
      !paymentLimitError &&
      qisstPay.length === 1 &&
      qisstPay[0].package.package_name == "PAY_IN_2"
    ) {
      qisstPaySelectionHandler(qisstPay[0].package.package_name);
      setActiveMethod(qisstPay[0].package.package_name);
      setLoadQisstPayInTwo(true);
      setDisable(false);
      setMerchantPackageId(qisstPay[0].merchant_package_id);
      setMerchantPackId(qisstPay[0].merchant_package_id);
      setPackageSelected(qisstPay[0].package.package_name);
    }
  }, [processingFee, newProcessingFee, qisstPay, paymentLimitError]);
  /**
   * @description update the active slide on the basis on activeInstructionSlide (next)
   */
  const nextSlideHandler = () => {
    if (activeInstructionSlide == EActiveInstructionSlide.ONE) {
      setActiveInstructionSlide(EActiveInstructionSlide.TOW);
    } else if (activeInstructionSlide == EActiveInstructionSlide.TOW) {
      setActiveInstructionSlide(EActiveInstructionSlide.THREE);
    } else if (activeInstructionSlide == EActiveInstructionSlide.THREE) {
      setActiveInstructionSlide(EActiveInstructionSlide.FOUR);
    }
  };

  /**
   * @description update the active slide on the basis on activeInstructionSlide (prev)
   */
  const prevSlideHandler = () => {
    if (activeInstructionSlide == EActiveInstructionSlide.TOW) {
      setActiveInstructionSlide(EActiveInstructionSlide.ONE);
    } else if (activeInstructionSlide == EActiveInstructionSlide.THREE) {
      setActiveInstructionSlide(EActiveInstructionSlide.TOW);
    } else if (activeInstructionSlide == EActiveInstructionSlide.FOUR) {
      setActiveInstructionSlide(EActiveInstructionSlide.THREE);
    }
  };
  /**
   * @description setting merchant packageId and packId and update encrypted
   * @param packageSelection
   */
  const settingMerchantIdHandler = (packageSelection: any) => {
    // this function is called when package is changed by the user to set merchant package and merchant package id in parent component
    // he he he he
    qisstPay.forEach((method: any) => {
      if (packageSelection != packageSelected) {
        setNumber("");
        setCvc("");
        setName("");
        setExpiry("");
        setExpiryValidated(false);
      }
      if (paymentType == "BOTH") {
        // this if is not in use have to remove it when pay in 6 will be activated and tested
        if (method.package.package_name == packageSelection) {
          setMerchantPackageId(method.merchant_package_id);
          setMerchantPackId(method.merchant_package_id);
        }
      } else {
        if (method.package.package_name == packageSelection) {
          setMerchantPackageId(method.merchant_package_id);
          setMerchantPackId(method.merchant_package_id);
          setEncrypted({
            ...encrypted,
            merchant_package_id: method.merchant_package_id,
            package_name: "Checkout",
          });
        }
      }
    });
  };

  /**
   * @description getting shipping address of user
   * *
   */

  const getShippingAddressHander = async (customerID: any, tok: any) => {
    try {
      // Api call for getting payment methods
      // console.log("GG => ", customerID, tok);
      const response = await addressService.getAddress(customerID, {
        headers: {
          Authorization: `Bearer ${tok}`,
          user_id: customerID,
          "X-API-Key": "abc123!",
        },
      });
      setShippingAddress(response);
      // console.log("Shipping Address Response: ", response);
      response
        .filter((it: any) => it.address_type === "BILLING")
        .map((item: any) => {
          setBillingZipCode(item.zip);
        });
      response
        .filter(
          (it: any) => it.address_type === "SHIPPING" && it.is_default === true
        )
        .map((item: any) => {
          setShippingZipCode(item.zip);
        });
      // console.log("SHIPPING ADDRESS RESPONSE ===========>", response)
      // for (let i = 0; i < shippingAddress.length; i++) {
      //   if (shippingAddress[i].is_default === true) {
      //     console.log('Shipping Address ====>', shippingAddress[i])
      //     if (
      //       shippingAddress[i].country.toLocaleUpperCase() === 'UNITED STATES'
      //     ) {
      //       BigCommerceShippingMethods('US')
      //     } else {
      //       BigCommerceShippingMethods('PK')
      //     }
      //   }
      // }
      // if (response.success) {
      // console.log("all address");
      // console.log(response.data);
      // setShippingAddress(response.data);
      // }
    } catch {}
  };
  /**
   * @description select qisst pay handler
   * * set all payment methods false and use qisst pay
   */

  const qisstPaySelectionHandler = (selectedPackage: string) => {
    if (!paymentLimitError) {
      setGooglePay(false);
      setLoadCOD(false);
      setLoadPayPal(false);
      setLoadCard(false);
      setLoadClover(false);
      setLoadCardPointe(false);
      setLoadEasyPaisa(false);
      setLoadVault(false);
      setLoadEasyPaisaDirect(false);
      setLoadForee(false);
      setLoadJazzCashC(false);
      setLoadSezzle(false);
      setLoadJazzCash(false);
      setLoadPayFast(false);
      setLoadAlfalah(false);
      setLoadUBL(false);
      setLoadAlfa(false);
      setDirectBank(false);
      setLoadSquare(false);
      setLoadPinWheel(false);
      setLoadNab(false);
      //setLoadUplift(false);
      //setUpliftVirtualCardAvailable(false);
      setLoadAuthorizeDotNet(false);
      // (global as any).rudderanalytics?.track("QisstPay Selected");

      if (packageSelectedQP == "") {
        if (selectedPackage == "PAY_IN_4") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
          setLoadQisstPay(true);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInSixCC(false);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(false);
          setCardSelect(false);
        } else if (selectedPackage == "PAY_IN_3_CC") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
          setLoadQisstPay(false);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInSixCC(false);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(false);
          setLoadQisstPayInThreeCC(true);
          setLoadQisstPayInTwelveCC(false);
        } else if (selectedPackage == "PAY_IN_3") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          // (global as any).rudderanalytics?.track("Payment method selected", {
          //   payment_method: "PAY_IN_6",
          // });
          setProcessingFee(newProcessingFee);
          let pay3amount = totalAmount + (totalAmount * newProcessingFee) / 100;
          console.log("NEW AMOUNT: ", pay3amount);
          setP_fee(newProcessingFee);
          setProcessingAmount(pay3amount);
          setLoadQisstPay(false);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInSixCC(false);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(true);
          setLoadQisstPayInTwo(false);
          setCardSelect(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(false);
          updateStateHandler({
            payload: {
              processingFee: newProcessingFee,
            },
          });
        } else if (
          selectedPackage == "PAY_IN_2" ||
          selectedPackage == "Payfast"
        ) {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          // (global as any).rudderanalytics?.track("Payment method selected", {
          //   payment_method: "PAY_IN_6",
          // });
          setProcessingFee(newProcessingFee);
          let pay2amount = totalAmount + (totalAmount * newProcessingFee) / 100;
          setP_fee(newProcessingFee);
          setProcessingAmount(pay2amount);
          setLoadQisstPay(false);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInSixCC(false);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(true);
          setCardSelect(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(false);
          updateStateHandler({
            payload: {
              processingFee: newProcessingFee,
            },
          });
        } else if (selectedPackage == "PAY_IN_6") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
          setLoadQisstPay(false);
          setLoadQisstPayInSix(true);
          setCardSelect(false);
          setLoadQisstPayInSixCC(false);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(false);
        } else if (selectedPackage == "PAY_IN_6_CC") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
          setLoadQisstPay(false);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInSixCC(true);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(false);
        } else if (selectedPackage == "PAY_IN_4_CC") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
          setLoadQisstPay(false);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInFourCC(true);
          setLoadQisstPayInSixCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(false);
        } else if (selectedPackage == "PAY_IN_12_CC") {
          setIsEventTriggered(true);
          if (isEventTriggered) {
            (global as any).rudderanalytics?.track(
              "payment_screen_success",
              {},
              {
                time_stamp: time_stamp,
                user_type: user_type,
                mobileNumber: intlNumber,
                selectedPackage: selectedPackage,
                user_id: customerId,
                merchant_id: MerchantUserId,
                anonymousId: rudderStackID,
              }
            );
            setIsEventTriggered(false);
          }
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
          setLoadQisstPay(false);
          setLoadQisstPayInSix(false);
          setLoadQisstPayInFourCC(false);
          setLoadQisstPayInThree(false);
          setLoadQisstPayInTwo(false);
          setLoadQisstPayInThreeCC(false);
          setLoadQisstPayInTwelveCC(true);
          setCardSelect(false);
        }
      }
      setActiveMethod("QISSTPAY");
      setPackageSelected(selectedPackage);
      settingMerchantIdHandler(selectedPackage);

      setLoadCOD(false);
      setError("");
    } else {
    }
  };

  /**
   * @description format the project array and save in lineItems state
   * @param productsObj
   */
  const getLineItemsHandler = async (productsObj: any) => {
    let items: any = [];

    await productsObj?.map((item: any) => {
      const decodedName = item?.title ? item?.title : "NA";
      const decodedSrc = item?.src ? item?.src : "NA";
      items?.push({
        id: String(item?.id ?? ""),
        src: decodedSrc,
        sku:
          platForm_bigCommerce != null &&
          platForm_bigCommerce?.toLocaleUpperCase() == "BIGCOMMERCE"
            ? item.sku
            : String(item.id),
        name: decodedName,
        type: "NA",
        quantity: Number(item?.quantity),
        category: Number(item?.category) ?? null,
        subcategory: Number(item?.subcategory) ?? "NA",
        description: item?.description ?? "NA",
        color: item?.color ?? "NA",
        size: item?.size ?? "NA",
        brand: item?.brand ?? "NA",
        unit_price: isTez == 0 ? Number(item?.unit_price) : Number(item?.price),
        amount:
          isTez == 0
            ? Number(item?.price)
            : Number(item?.price) * Number(item?.quantity),
        attributes: item?.attributes,
        tax_rate: 1,
        variant_id:
          platForm_bigCommerce?.toLocaleUpperCase() == "BIGCOMMERCE"
            ? String(item?.variant_id)
            : item?.variant_id
            ? String(item?.variant_id)
            : null,
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
        product_id: item?.product_id
          ? Number(item?.product_id)
          : item?.id
          ? Number(item?.id)
          : 0,
      });
    });

    setLineItems(items);
  };

  /**
   * @description slip the amount and update half and second half amount
   * @param data
   */
  const updateAmountHandler = (data: any, divisor: number) => {
    // making pay in four payment division
    let fullAmount = parseInt(data);
    var halfAmount = fullAmount / divisor;

    if (halfAmount == Math.floor(halfAmount)) {
      setHalfAmountToPay(halfAmount);
      setSecondHalfAmountToPay(halfAmount);
    } else {
      let round_off = Math.round(halfAmount);
      let second_amount = fullAmount - round_off * 3;
      setHalfAmountToPay(round_off);
      setSecondHalfAmountToPay(second_amount);
    }
  };

  const [userID, setUserID] = useState<string | number>("");
  const [StripePaymentId, setStripePaymentId] = useState<any>("");
  /**
   * @description get payment methods
   * @param token
   * @param identity
   * @param totalPrice
   */
  const getPaymentMethodsHandler = async (
    token: string,
    identity: string,
    totalPrice: any,
    userId: string | number
  ) => {
    setUserID(userId);
    let response: any;

    try {
      //ad
      // Api call for getting payment methods
      let response: any;
      let stackBuilder = localStorage.getItem("isStackBuilderEnabled");

      // console.log(
      //   "==============================================STACK BUILDER: ",
      //   isStackBuilderEnabled
      // );
      if (stackBuilder === "null" || stackBuilder === "false") {
        response = await merchantService.getPaymentMethods({
          headers: {
            Authorization: `Bearer ${token}`,
            "identity-token": identity,
            USER_ID: userId,
          },
        });
      }
      // if (isStackBuilderEnabled === true ||
      //   isStackBuilderEnabled === "true" ||
      //   localStorage.getItem("isStackBuilderEnabled") === "true")
      else {
        response = await merchantService.getPaymentMethodsV1({
          headers: {
            Authorization: `Bearer ${token}`,
            "identity-token": identity,
            USER_ID: userId,
          },
        });
      }
      //setProcessingFee(response?.methods?.Qisstpay?.processing_fee)

      let merchantAccounts = response.merchant_accounts;
      let merchantEmail = response.merchant_emails;
      let merchantPhone = response.merchant_phones;
      let paymentMethods = response.methods.Qisstpay;
      let merchantLogoRes = response.merchantLogo;
      let merchantBusinessNameRes = response.businessName;
      let codPackageIDRes = response.methods.cod_package_id;
      let otherMethods = response.methods.Others;
      let packageAvailable = false;
      let missedApms: string[] = [];

      let viewId = response.view_id;
      if (response?.methods?.Qisstpay[0]) {
        updateStateHandler({
          payload: {
            paymentMethods: paymentMethods,
          },
        });
        updateStateHandler({
          payload: {
            totalProccessingFee: response?.methods?.Qisstpay[0]?.processing_fee,
          },
        });
      }
      for (let i = 0; i < paymentMethods.length; i++) {
        if (paymentMethods[i].package.package_name == "PAY_IN_3") {
          setProcessingFee(response.methods.Qisstpay[0].processing_fee);
          setNewProcessingFee(response.methods.Qisstpay[0].processing_fee);
        }
      }

      for (let i = 0; i < paymentMethods.length; i++) {
        if (paymentMethods[i].package.package_name == "PAY_IN_2") {
          setProcessingFee(response.methods.Qisstpay[0].processing_fee);
          setNewProcessingFee(response.methods.Qisstpay[0].processing_fee);
        }
      }

      for (let i = 0; i < otherMethods.length; i++) {
        console.log(otherMethods, "aaa");
        if (otherMethods[i].package.package_name == "Payfast") {
          console.log("otherMethods");
          updateStateHandler({
            payload: {
              payFastPackageID: otherMethods[i].merchant_package_id,
              totalProccessingFee:
                otherMethods[i]?.processing_fee == null
                  ? 0
                  : otherMethods[i]?.proprocessing_fee,
              methods: otherMethods,
              paymentMethods: paymentMethods,
            },
          });
          setNewProcessingFee(
            otherMethods[i]?.processing_fee == null
              ? 0
              : otherMethods[i]?.proprocessing_fee
          );
          setProcessingFee(
            otherMethods[i]?.processing_fee == null
              ? 0
              : otherMethods[i]?.proprocessing_fee
          );
          setPayFastPackageID(otherMethods[i].merchant_package_id);
        }
      }

      for (let i = 0; i < otherMethods.length; i++) {
        if (
          otherMethods[i].package.package_name.toLocaleUpperCase() === "VAULT"
        ) {
          // console.log("Vault ID: ", otherMethods[i].merchant_package_id);
          updateStateHandler({
            payload: {
              vaultPackageID: otherMethods[i].merchant_package_id,
            },
          });
          setVaultPackageID(otherMethods[i].merchant_package_id);
        }
      }

      for (let i = 0; i < otherMethods.length; i++) {
        if (
          otherMethods[i].package.package_name.toLocaleUpperCase() === "CARD"
        ) {
          console.log("Card ID: ", otherMethods[i].merchant_package_id);
          setStripePaymentId(otherMethods[i].merchant_package_id);
        }
      }
      const urlParams = new URLSearchParams(wordUrl);
      const shippingTootal = urlParams.get("shipping_total");
      for (let i = 0; i < otherMethods.length; i++) {
        if (
          otherMethods[i].package.package_name.toLocaleUpperCase() === "SQUARE"
        ) {
          var myHeaders = new Headers();
          myHeaders.append(
            "Authorization",
            `Bearer ${token == "" || token == null ? newToken : token} `
          );

          var requestOptions: any = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          fetch(
            `${process.env.REACT_APP_ORDER_MS_API_KEY}/get_gateway_creds?merchant_package_id=${otherMethods[i].merchant_package_id}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => console.log("SQUARE CREDENTIALS: ", result))
            .catch((error) => console.log("error", error));
        }
      }
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: newProcessingFee,
        },
      });

      // console.log("Platform Fee: ", processingFee);
      // console.log("New Platform Fee: ", newProcessingFee);
      // console.log("Payfast ID: ", payFastPackageID);

      setMerchantAccounts(merchantAccounts);
      setMerchantEmail(merchantEmail);
      setMerchantPhone(merchantPhone);
      setMerchantLogo(merchantLogoRes);
      setCodPackageID(codPackageIDRes);
      setMerchantBusinessName(merchantBusinessNameRes);
      setQisstPay(response.methods.Qisstpay);
      setOthers(response.methods.Others);
      setView(viewId ? String(viewId) : "");

      if (window.location.pathname == routes.paymentFailurePage) {
        setError("Please enter card details again!");
      } else {
        setError("");
        // defaultPackageHandler(response.methods.Others, "");
      }

      let card = response.methods.Others.find(
        (a: any) => a.package.package_name.toLocaleUpperCase() === "CARD"
      );

      // if (card) {
      setCardPackageID(card?.merchant_package_id);
      try {
        axios
          .get(`${process.env.REACT_APP_GET_USER_CARD}${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              user_id: userId,
            },
          })
          .then((res) => {
            response = res.data;

            setCustomerCard(response);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (err) {
        console.log(err);
      }
      // }

      let googlePackage = response.methods.Others.find(
        (a: any) => a.package.package_name == "GOOGLEPAY"
      );

      if (googlePackage) {
        googlePayScriptHandler(googlePackage.merchant_package_id);
      }

      if (totalPrice && typeof totalPrice != "number") {
        totalPrice = parseInt(totalPrice);
      }

      // checking if the responded methods are active or not
      if (paymentMethods.length > 0) {
        let availablePackages: any = [];

        // console.log(paymentMethods);
        paymentMethods.map((method: any, i: any) => {
          if (
            Number(totalPrice) >= Number(parseInt(method.min)) &&
            Number(totalPrice) <= Number(parseInt(method.max))
          ) {
            packageAvailable = true;
            setPaymentLimitError(false);
            if (method.package.package_name == "PAY_IN_12_CC") {
              // setActiveMethod("QISSTPAY");

              // setLoadQisstPayInTwelveCC(true);
              // setDisable(false);
              setMerchantPackageId(method.merchant_package_id);
              setMerchantPackId(method.merchant_package_id);
              // setPackageSelected("PAY_IN_12_CC");
              setError("");
            }

            availablePackages.push({
              name: method.package.package_name,
              merchant_package_id: method.merchant_package_id,
              payment_type:
                method.package.package_name == "PAY_IN_4"
                  ? "Debit/Credit Card"
                  : "Credit Card",
            });
          } else {
            setPaymentLimitError(true);
            // Find the payment method with the highest min amount, excluding zero
            const validPaymentMethods = paymentMethods.filter(
              (item: any) => Number(item.min) > 0
            );

            const highestMinPaymentMethod = validPaymentMethods.reduce(
              (acc: any, item: any) =>
                Number(item.min) > Number(acc.min) ? item : acc,
              { min: 0 } // Initialize with a minimum value of 0
            );

            if (Number(totalPrice) <= Number(highestMinPaymentMethod.min)) {
              setError(
                `No Payment Methods Found, Please make sure your order amount is above ${
                  encrypted?.currency ??
                  currency + " " + highestMinPaymentMethod.min
                }.`
              );
            }

            missedApms.push(method.package.package_name);
          }
        });

        if (availablePackages.length == 1) {
          // selecting tab of pay in 4
          // availablePackages[0].name == "PAY_IN_4"
          //   ? setTabPay4(true)
          //   : setTabPay4(false);
        }

        // packages where avaliable but the order amount selected by user was less or greater than the limits of packages

        if (availablePackages.length == 0) {
          //    setError(
          //    'Please choose another payment method (amount is out of limit)',
          //  )

          setLoadQisstPay(false);
          setPaymentLimitError(true);
          setDisable(false);
        }

        // setting packages in state
        setQisstPayMethods(availablePackages);

        // Other methods limit check to set error

        otherMethods.map((other: any) => {
          if (
            !(
              Number(totalPrice) >= Number(parseInt(other.min)) &&
              Number(totalPrice) <= Number(parseInt(other.max))
            )
          ) {
            // setError(
            //   "Please choose another payment method (amount is out of limit)"
            // );
            missedApms.push(other.package.package_name);
            // setPaymentLimitError(true);
          } else {
            packageAvailable = true;
          }
        });

        if (!packageAvailable) {
          let segmentId = "12";
          if (typeof (global as any)?.rudderanalytics?.user == "function") {
            segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
          }

          generalService.createSegmentEvent(
            EEventName.MISSED_APMS,
            {
              ip_address: ipAddress,
              checkout_url: checkout_url,
              checkout_type: "1-Click",
              affiliation: "",
              subtotal: Number(totalAmount),
              total:
                Number(totalAmount) + Number(shippingPrice) + Number(taxPrice),
              revenue: 0,
              shipping: Number(shippingPrice) ?? 0,
              tax: Number(taxPrice) ?? 0,
              discount: 0,
              coupon: "",
              currency: currency,
              country: "Pakistan",
              locale: "EN",
              segment_id: segmentId,
              user_id: customerId,
              phone_number: intlNumber,
              missed_apms: missedApms,
              product: productsObj.map((product: any) => {
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
            },
            {
              headers: {
                "identity-token": identity!,
              },
            }
          );
        }
      } else {
        // if qisstpay was not activated then the error will be displayed
        setPaymentLimitError(true);
        setLoadQisstPay(false);
        setDisable(false);
      }
    } catch (error: any) {
      console.log(error, "err");

      setError(error?.response?.data?.message ?? "Something went wroang!");
      setPaymentLimitError(true);
      setLoadQisstPay(false);
      setDisable(false);
    }
  };
  const deleteCustomerCard = async (
    token: string,
    userId: string | number,
    cardId: string | number
  ) => {
    let response: any;
    let card = others.find(
      (a: any) => a.package.package_name.toLocaleUpperCase() === "CARD"
    );
    try {
      axios
        .delete(`${process.env.REACT_APP_GET_USER_CARD}${userId}/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,

            user_id: userId,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            try {
              axios
                .get(`${process.env.REACT_APP_GET_USER_CARD}${userId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,

                    user_id: userId,
                  },
                })
                .then((res) => {
                  response = res.data;

                  setCustomerCard(response);
                })
                .catch((error) => {
                  console.log(error);
                });
            } catch (err) {
              console.log(err);
            }
          }
        });
    } catch (err) {
      console.log(err, "error");
    }
  };
  const [shippingTax, setShippingTax] = useState(0);

  const getTaxesAndShippingHandler = async (
    token: string,
    identity: string,
    userId: string,
    total_amount: number,
    shippingInfo?: { city: string; country: string; state: string }
  ) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("identity-token", identity);
      myHeaders.append("Content-Type", "application/json");

      await fetch(
        `${process.env.REACT_APP_WEB_EXTERNAL_MS_API_KEY}/v1/1cc/v2/merchant/taxes`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            address: {
              city: city,
              state: state,
              country: country,
            },
            amount: totalAmount,
          }),
        }
      )
        .then((response) => response.json())
        .then((response: any) => {
          if (response?.success) {
            const tax = response?.data?.taxes;
            let totalTaxPercentage = 0;
            for (let i = 0; i < tax.length; i++) {
              totalTaxPercentage += tax[i].taxPercentage;
            }

            const taxAmount = (totalTaxPercentage / 100) * totalAmount;
            // updateStateHandler({
            //   payload: {
            //     taxPrice: taxAmount,
            //   },
            // });

            setAddressChanged(false);
            setShippingM(response?.data?.shipping);
            if (response?.data?.shipping.length > 0) {
              setWpShippingFlag(false);
              shippingCalulation(
                response?.data?.shipping,
                total_amount,
                shippingInfo
              );

              if (platForm_bigCommerce?.toLocaleUpperCase() === "BIGCOMMERCE") {
                if (
                  shippingAddress.country.toLocaleUpperCase() ===
                  "UNITED STATES"
                )
                  BigCommerceShippingMethods("US");
                else {
                  BigCommerceShippingMethods("PK");
                }
              }

              if (response?.data?.shipping.length > 0) {
                setWpShippingFlag(true);
                updateStateHandler({
                  payload: {
                    shippingDetails: response?.data?.shipping,
                    shippingPrice:
                      // response?.data?.shipping[0]?.fee == 0 ||
                      // response?.data?.shipping[0]?.fee == ""
                      //   ? shippingTootal
                      //   :
                      shippingTootal != "0" || shippingTootal != null
                        ? shippingTootal
                        : response?.data?.shipping[0].fee,
                    shippingName: response?.data?.shipping[0]?.title,
                  },
                });
                setShippingTax(
                  shippingTootal != "0" || shippingTootal != null
                    ? shippingTootal
                    : response?.data?.shipping[0].fee
                );
                if (
                  shippingPrice == 0 &&
                  response?.data?.shipping[0].fee == 0
                ) {
                  // updateStateHandler({
                  //   payload: {
                  //     shippingPrice: shippingTootal,
                  //   },
                  // });
                }
              } else {
                // updateStateHandler({
                //   payload: {
                //     shippingDetails: shippingMethods ? shippingMethods : [],
                //     shippingPrice: shippingMethods
                //       ? shippingMethods[0].cost
                //       : shippingTootal,
                //     shippingName: shippingMethods
                //       ? shippingMethods[0].title
                //       : "No Shipping",
                //   },
                // });
              }
            } else {
              if (platForm_bigCommerce?.toLocaleUpperCase() === "BIGCOMMERCE") {
                if (
                  shippingAddress.country.toLocaleUpperCase() ===
                  "UNITED STATES"
                )
                  BigCommerceShippingMethods("US");
                else {
                  BigCommerceShippingMethods("PK");
                }
              }
              updateStateHandler({
                payload: {
                  shippingDetails: shippingMethods ? shippingMethods : [],
                  // shippingPrice: shippingMethods
                  //   ? shippingMethods[0].cost
                  //   : shippingTootal,
                  shippingName: shippingMethods
                    ? shippingMethods[0].title
                    : "No Shipping",
                },
              });
            }
            updateStateHandler({
              payload: {
                taxes: response?.data?.taxes,
              },
            });
          } else {
            setError(response?.data?.message ?? "Something went wrong!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error: any) {
      setError(error?.response?.data?.data?.message);
    }
  };
  /**
   * @description shipping logic
   * @param shippingLogix
   * @param shippingMethods
   */

  const shippingCalulation = (
    shippingArray: any,
    totalAmount: number,
    shippingInfo?: { city: string; country: string; state: string }
  ) => {
    // console.log("SHIPPING NEW METHDDSFDF : ");
    // console.log(shippingArray);
    // console.log(shippingInfo?.total_amount);
    // let total_amount = shippingInfo ? shippingInfo.total_amount : 0;
    let tA = totalAmount;
    // console.log("TA TOTAL AMOUNT");
    // console.log(tA);
    // ? props.totalAmount
    // : props.encrpted.total_amount;
    if (shippingArray != undefined && shippingArray != "") {
      var shippin = shippingArray;
      // console.log("SHHH");
      // console.log(shippin);
      let tempShippings = [];
      for (let i = 0; i < shippin.length; i++) {
        let tempShip = shippin[i];

        // console.log("temmpppppp ship aray");
        // console.log(tempShip);

        let userCity = shippingInfo?.city ?? city?.toLocaleLowerCase();
        // ? props.shippingCity.toLowerCase()
        // : props.encrpted.shipping_info
        // ? props.encrpted.shipping_info.city
        //   ? props.encrpted.shipping_info.city.toLowerCase()
        //   : null
        // : null;
        let userState = shippingInfo?.state ?? state?.toLocaleLowerCase();
        // ? props.state.toLowerCase()
        // : props.encrpted.shipping_info
        // ? props.encrpted.shipping_info.state
        //   ? props.encrpted.shipping_info.state.toLowerCase()
        //   : null
        // : null;

        let userCountry = shippingInfo?.country ?? country?.toLocaleLowerCase();
        // ? props.shippingCountry.toLowerCase()
        // : props.encrpted.shipping_info
        // ? props.encrpted.shipping_info.country
        //   ? props.encrpted.shipping_info.country.toLowerCase()
        //   : null
        // : null;
        // console.log("HELlllloooo");
        // console.log(userCity);
        // console.log(userState);
        // console.log(userCountry);
        let tempShipMin = tempShip.minAmount;
        let tempShipMax = tempShip.maxAmount;

        // console.log("USER CITY");
        // console.log(tempShip.cities);

        if (
          tempShipMax ||
          tempShipMax == 0 ||
          tempShipMin ||
          tempShipMin == 0
        ) {
          let max = tempShipMax ? tempShipMax : 99999999999;
          let min = tempShipMin ? tempShipMin : 0;
          if (tA <= min || tA > max) {
            continue;
          }
          // console.log("no continue");
        }

        if (tempShip.cities) {
          let citiess = tempShip.cities;
          let indexx = false;

          //Check cities
          for (let j = 0; j < citiess.length; j++) {
            // console.log(
            //   "IF == " +
            //     citiess[j].toLowerCase() +
            //     " == " +
            //     (userCity ? userCity.toLowerCase() : userCity)
            // );
            // console.log(
            //   citiess[j].toLowerCase() ==
            //     (userCity ? userCity.toLowerCase() : userCity)
            // );
            if (
              citiess[j].toLowerCase() ==
              (userCity ? userCity.toLowerCase() : userCity)
            ) {
              // console.log("IF CHECKED");
              indexx = true;
              break;
            }
          }
          // console.log("indexx" + indexx);

          //Check states
          if (!indexx) {
            if (!tempShip.cities || tempShip.cities.length < 1) {
              let statess = tempShip.states;

              for (let k = 0; k < statess.length; k++) {
                // console.log(
                //   "IF == " + statess[k].toLowerCase() + " == " + userState
                // );
                // console.log(statess[k].toLowerCase() == userState);
                if (statess[k].toLowerCase() == userState) {
                  // console.log("IF CHECKED");
                  indexx = true;
                  break;
                }
              }
            }
          }

          if (indexx) {
            // console.log("INDEX SUCCESSFUL");
            let flat_fee = tempShip.shippingFlatFee;

            let add_fee = (tempShip.shippingPercentFee * tA) / 100;
            // console.log("ADDDD FEEEEE = ");
            // console.log(tA);
            // console.log(encrypted);
            // console.log(tempShip.shippingPercentFee);
            // console.log(totalAmount ? totalAmount : encrypted.total_amount);
            // console.log(add_fee);
            // console.log("SHIPPPING COSTTT = " + (flat_fee + add_fee));
            tempShip.cost = Math.ceil(flat_fee + add_fee);

            tempShippings.push(tempShip);
          } else {
            if (
              (!tempShip.cities && !tempShip.states) ||
              (tempShip.cities &&
                tempShip.cities.length < 1 &&
                tempShip.states &&
                tempShip.states.length < 1)
            ) {
              if (tempShip.country) {
                if (tempShip.country.toLowerCase() == userCountry) {
                  let flat_fee = tempShip.shippingFlatFee;
                  let add_fee = (tempShip.shippingPercentFee * tA) / 100;
                  // console.log("SHIPPPING COSTTT = " + (flat_fee + add_fee));
                  tempShip.cost = Math.ceil(flat_fee + add_fee);
                  tempShippings.push(tempShip);
                  // console.log("2222+++++");
                  // console.log(tempShippings);
                }
              }
            }
          }
        } else {
          let shippingObj = {
            code: "",
            cost: "",
            title: "",
          };
          shippingObj.code = tempShip.code;
          shippingObj.cost = tempShip.flat_fee;
          shippingObj.title = tempShip.title;
          tempShippings.push(shippingObj);
        }
      }

      // setShippingMethods(tempShippings);
      updateStateHandler({
        payload: {
          shippingDetails: tempShippings,
        },
      });

      // console.log("TEMP SHIPPINGS : ");
      // console.log(tempShippings);
      if (tempShippings && tempShippings.length > 0) {
        updateStateHandler({
          payload: {
            shippingValidate: false,
          },
        });
      } else {
        // props.setTheShippingScreenNew(false);

        updateStateHandler({
          payload: {
            // shippingPrice: shippingTootal,
            shippingValidate: true,
          },
        });
      }
      // if (window.location.pathname != "/failure") {
      if (tempShippings != undefined) {
        // console.log(tempShippings);
        cheapestShippingMethod(tempShippings);
      }
    } else {
      // shippingValidation(true);
      updateStateHandler({
        payload: {
          shippingValidate: true,
        },
      });
    }

    // updateStateHandler({
    //   payload: {
    //     shippingPrice: encrypted.shipping_amount,
    //   },
    // });
  };

  function cheapestShippingMethod(shippingMethodsParam: any) {
    //Pick the cheapest shipping method
    let minCost = 99999;
    let minTitle = "";
    let shipCode = "";
    // console.log("NOT IN CHEAPEST SHIPPING == ");
    // console.log(shippingMethodsParam);

    for (let i = 0; i < shippingMethodsParam.length; i++) {
      let shippingMeth = shippingMethodsParam[i];

      // console.log("CHEAPEST SHIPPING == ");
      // console.log(shippingMeth);
      if (shippingMeth.cost < minCost) {
        minCost = shippingMeth.cost;
        minTitle = shippingMeth.title;
        shipCode = shippingMeth.code;
      }
    }
    // setLoadShipping(false);

    if (shippingMethodsParam.length == 0) {
      updateStateHandler({
        payload: {
          shippingPrice: "0",
          shippingName: "No Shipping",
        },
      });
    } else {
      updateStateHandler({
        payload: {
          shippingPrice: minCost.toString(),
          shippingName: minTitle,
        },
      });
      if (window.location.pathname == "/failure") {
        encrypted.shipping_amount = minCost.toString();
        encrypted.shipping_name = minTitle;
      }
      // console.log(minCost);
      // console.log("minCost");
      // console.log("minCost");
    }

    // setShippingPrice(minCost);
    // setShippingName(minTitle);

    // if (props.from != "review") {
    //   props.setShippingPrice(minCost);
    //   props.shippingValidation(true);
    //   props.setShippingName(minTitle);
    //   props.setShippingCode(shipCode);
    // }
    //AbdulMutaal
  }

  /**
   * @description set default package
   * @param otherMethods
   * @param from
   */
  const defaultPackageHandler = (otherMethods: any, from: string) => {
    // this function is called when package is used to set default package COD OR OTHER

    if (from != "failure") {
      otherMethods.forEach((method: any) => {
        if (method.package.package_name == "COD") {
          setActiveMethod("COD");
          setLoadCOD(true);
          setLoadKlarna(false);
          setDisable(false);
          setMerchantPackageId(method.merchant_package_id);
          let newAmount =
            processingAmount - (processingAmount * processingFee) / 100;
          console.log("NEW DEDUCTED AMOUNT: ", newAmount);

          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
            },
          });
        }
      });
    } else {
      if (otherMethods.package_name == "PAY_IN_4") {
        setActiveMethod("QISSTPAY");
        setLoadQisstPay(true);
        setLoadCOD(false);
        setCardSelect(false);
        setDisable(false);
        let newAmount =
          processingAmount - (processingAmount * processingFee) / 100;
        console.log("NEW DEDUCTED AMOUNT: ", newAmount);

        setProcessingAmount(newAmount);
        setProcessingFee("");
        updateStateHandler({
          payload: {
            processingFee: processingFee,
          },
        });
        setMerchantPackageId(otherMethods.merchant_package_id);
      } else if (
        otherMethods.package_name.toString().toLocaleUpperCase() == "CARD"
      ) {
        setActiveMethod("CARD");
        setLoadCard(true);
        setLoadCardPointe(false);
        setLoadClover(false);
        setLoadQisstPay(false);
        setLoadCOD(false);
        setDisable(false);
        let newAmount =
          processingAmount - (processingAmount * processingFee) / 100;
        console.log("NEW DEDUCTED AMOUNT: ", newAmount);

        setProcessingAmount(newAmount);
        setProcessingFee("");
        updateStateHandler({
          payload: {
            processingFee: processingFee,
          },
        });
        setMerchantPackageId(otherMethods.merchant_package_id);
      } else if (
        otherMethods.package_name.toString().toLocaleUpperCase() == "CARDPOINTE"
      ) {
        setActiveMethod("CARDPOINTE");
        setLoadCardPointe(true);
        setLoadCard(false);
        setLoadClover(false);
        setLoadQisstPay(false);
        setLoadCOD(false);
        setDisable(false);
        let newAmount =
          processingAmount - (processingAmount * processingFee) / 100;
        console.log("NEW DEDUCTED AMOUNT: ", newAmount);

        setProcessingAmount(newAmount);
        setProcessingFee("");
        updateStateHandler({
          payload: {
            processingFee: processingFee,
          },
        });
        setMerchantPackageId(otherMethods.merchant_package_id);
      }
    }
  };

  /**
   * @description show message div
   * * and add link in document
   * @param message
   */
  const addMessageHandler = (message: string) => {
    const messagesDiv = document.getElementById("message");
    messagesDiv!.style.display = "block";
    const messageWithLinks = addDashboardLinksHandler(message);
    messagesDiv!.innerHTML += `> ${messageWithLinks}<br>`;
  };

  /**
   * @description generate link to add on document
   * @param message
   * @returns
   */
  const addDashboardLinksHandler = (message: string) => {
    const piDashboardBase = "https://dashboard.stripe.com/test/payments";
    return message.replace(
      /(pi_(\S*)\b)/g,
      `<a href="${piDashboardBase}/$1" target="_blank">$1</a>`
    );
  };

  //TODO: update the flow
  /**
   * @description google play script handler
   * * handle call backs
   * * stripe handling
   * @param packageId
   */
  const googlePayScriptHandler = async (packageId: any) => {
    // const publishableKey = "pk_test_nvoj3rO3iWn3WWmklIVyrAs800Ypcn1cIf";
    // if (!publishableKey) {
    //   addMessageHandler(
    //     "No publishable key returned from the server. Please check `.env` and try again"
    //   );
    //   alert("Please set your Stripe publishable API key in the .env file");
    // }
    // // 1. Initialize Stripe
    // const stripe = await loadStripe(publishableKey, {
    //   apiVersion: "2020-08-27",
    // });
    // // 2. Create a payment request object
    // var paymentRequest = stripe!.paymentRequest({
    //   country: "US",
    //   currency: "usd",
    //   total: {
    //     label: "Your Order",
    //     amount: totalAmount * 100,
    //   },
    //   requestPayerName: true,
    //   requestPayerEmail: true,
    // });
    // // 3. Create a PaymentRequestButton element
    // const elements = stripe!.elements();
    // const prButton = elements.create("paymentRequestButton", {
    //   paymentRequest: paymentRequest,
    //   style: {
    //     paymentRequestButton: {
    //       type: "buy",
    //       // One of 'default', 'book', 'buy', or 'donate'
    //       // Defaults to 'default'
    //       theme: "light",
    //       // One of 'dark', 'light', or 'light-outline'
    //       // Defaults to 'dark'
    //       height: "64px",
    //       // Defaults to '40px'. The width is always '100%'.
    //     },
    //   },
    // });
    // // Check the availability of the Payment Request API,
    // // then mount the PaymentRequestButton
    // const result: CanMakePaymentResult | null =
    //   await paymentRequest.canMakePayment();
    // if (result) {
    //   setHideGoogle(false);
    //   prButton.mount("#payment-request-button");
    // } else {
    //   console.log("not supported");
    //   setHideGoogle(true);
    //   if (document.getElementById("payment-request-button")) {
    //     document.getElementById("payment-request-button")!.style.display =
    //       "none";
    //   }
    // }
    // paymentRequest.on("paymentmethod", async (e) => {
    //   console.log("naumannnn" + JSON.stringify(e));
    //   //e.paymentMethod.id
    //   // getGooglePackageID()
    //   setGooglePayId(e.paymentMethod.id);
    //   // console.log("before order "+ clientSecretID)
    //   //TODO
    //   let data = await completeOrderHandler(
    //     "GOOGLEPAY",
    //     packageId,
    //     e.paymentMethod.id
    //   );
    //   let clientSecret = data!.client_secret;
    //   let t_id = data!.t_id;
    //   let o_id = data!.o_id;
    //   console.log(t_id);
    //   console.log(o_id);
    //   let { error, paymentIntent } = await stripe!.confirmCardPayment(
    //     clientSecret,
    //     { payment_method: e.paymentMethod.id }
    //   );
    //   console.log("paymentIntent" + paymentIntent);
    //   if (paymentIntent!.status === "requires_action") {
    //     // Let Stripe.js handle the rest of the payment flow.
    //     console.log("inside if");
    //     if (error) {
    //       // The payment failed -- ask your customer for a new payment method.
    //       console.log(error);
    //       addMessageHandler(error.message!);
    //       return;
    //     }
    //     addMessageHandler(
    //       `Payment ${paymentIntent!.status}: ${paymentIntent!.id}`
    //     );
    //   }
    //   if (error) {
    //     console.log(error);
    //     e.complete("fail");
    //   } else {
    //     e.complete("success");
    //     history.push(
    //       `${routes.paymentSuccessPage}/?token=${token}&tracking_id=${t_id}&order_id=${o_id}`
    //     );
    //     // window.location.href = `/success/?token=${token}&&tracking_id=${t_id}&&order_id=${o_id}`;
    //   }
    // });
  };

  /**
   * @description select payment method handler
   * * update active payment method and call completeOrderHandler function
   */

  const selectPaymentHandler = async () => {
    if (loadQisstPay) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        // console.log(error);
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("QISSTPAY");
        completeOrderHandler("Checkout", merchantPackId, "");
      }
    }
    if (loadQisstPayInSix) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("PAY_IN_6");
        completeOrderHandler("Checkout", merchantPackId, "");
      }
    }
    if (loadQisstPayInThree) {
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        // console.log(error);
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("PAY_IN_3");
        completeOrderHandler("PAY_IN_3", merchantPackId, "");
      }
    }
    if (loadQisstPayInTwo) {
      setOnLoad(true);
      if (
        isEmpty(number) &&
        isEmpty(name) &&
        isEmpty(expiry) &&
        isEmpty(cvc) &&
        cvc.length < 3 &&
        cvc === ""
      ) {
        setError("Please fill card details to continue!");
        // console.log(error);
        console.log("error");
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (cvc.length < 3 || cvc === "") {
        setError("CVC is invalid");
        console.log(cvc, activeMethod, "cvc");
        setOnLoad(false);
        setDisable(false);
      } else {
        console.log(cvc, "cvc1");
        setError("");
        setActiveMethod("PAY_IN_2");
        completeOrderHandler("PAY_IN_2", merchantPackId, "");
      }
    }
    if (loadQisstPayInSixCC) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        // console.log(error);
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("PAY_IN_6_CC");
        completeOrderHandler("Checkout", merchantPackId, "");
      }
    }
    if (loadQisstPayInFourCC) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        // console.log(error);
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("PAY_IN_4_CC");
        completeOrderHandler("Checkout", merchantPackId, "");
      }
    }
    if (loadQisstPayInThreeCC) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        // console.log(error);
        setOnLoad(false);
        setDisable(false);
      } else if (!expiryValidated) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("PAY_IN_3_CC");
        completeOrderHandler("PAY_IN_3_CC", merchantPackId, "");
      }
    }
    if (loadQisstPayInTwelveCC) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        // console.log(error);
        setOnLoad(false);
        setDisable(false);
      } else if (expiryValidated === false) {
        setError("Your Card Expiry date is not valid");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else if (number.length < 19) {
        setError("Your Card number is not valid");
        setOnLoad(false);
        setDisable(false);
      } else {
        setActiveMethod("PAY_IN_12_CC");
        completeOrderHandler("Checkout", merchantPackId, "");
      }
    }
    // if (loadQisstPay) {
    //   let newAmount =
    //     processingAmount - (processingAmount * processingFee) / 100;
    //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

    //   setProcessingAmount(newAmount);
    //   setProcessingFee("");
    //   updateStateHandler({
    //     payload: {
    //       processingFee: processingFee,
    //       payFastDetails: [],
    //       payFastScreen: 1,
    //     },
    //   });
    //   setOnLoad(true);

    //   let card_number = localStorage.getItem("card_number");
    //   let card_expiry_year = localStorage.getItem("card_expiry_year");
    //   let card_expiry_month = localStorage.getItem("card_expiry_month");
    //   let card_cvv = localStorage.getItem("card_cvv");

    //   console.log("Response: ", card_number);
    //   console.log("Response: ", card_expiry_year);
    //   console.log("Response: ", card_expiry_month);
    //   console.log("Response: ", card_cvv);

    //   if (
    //     card_number === "" ||
    //     card_expiry_year === "" ||
    //     card_expiry_month === "" ||
    //     card_cvv === ""
    //   ) {
    //     setError("Please fill card details to continue!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else if (!acceptTerms) {
    //     setError("Please accept the terms and conditions!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else {
    //     if (card_cvv !== "") {
    //       setActiveMethod("QISSTPAY");
    //       completeOrderHandler("Checkout", merchantPackId, "");
    //     } else {
    //       setError("Please fill cvv details to continue!");
    //       setOnLoad(false);
    //       setDisable(false);
    //     }
    //   }

    //   // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
    //   //   setError("Please fill card details to continue!");
    //   //   // console.log(error);
    //   //   setOnLoad(false);
    //   // } else if (!expiryValidated) {
    //   //   setError("Your Card Expiry date is not valid");
    //   //   setOnLoad(false);
    //   // } else if (!acceptTerms) {
    //   //   setError("Please accept the terms and conditions!");
    //   //   setOnLoad(false);
    //   // } else {
    //   //   setActiveMethod("QISSTPAY");

    //   //   completeOrderHandler("Checkout", merchantPackId, "");
    //   // }
    // }
    // if (loadQisstPayInSix) {
    //   let newAmount =
    //     processingAmount - (processingAmount * processingFee) / 100;
    //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

    //   setProcessingAmount(newAmount);
    //   setProcessingFee("");
    //   updateStateHandler({
    //     payload: {
    //       processingFee: processingFee,
    //       payFastDetails: [],
    //       payFastScreen: 1,
    //     },
    //   });
    //   setOnLoad(true);

    //   let card_number = localStorage.getItem("card_number");
    //   let card_expiry_year = localStorage.getItem("card_expiry_year");
    //   let card_expiry_month = localStorage.getItem("card_expiry_month");
    //   let card_cvv = localStorage.getItem("card_cvv");

    //   console.log("Response: ", card_number);
    //   console.log("Response: ", card_expiry_year);
    //   console.log("Response: ", card_expiry_month);
    //   console.log("Response: ", card_cvv);

    //   if (
    //     card_number === "" ||
    //     card_expiry_year === "" ||
    //     card_expiry_month === "" ||
    //     card_cvv === ""
    //   ) {
    //     setError("Please fill card details to continue!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else if (!acceptTerms) {
    //     setError("Please accept the terms and conditions!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else {
    //     if (card_cvv !== "") {
    //       setActiveMethod("PAY_IN_6");
    //       completeOrderHandler("Checkout", merchantPackId, "");
    //     } else {
    //       setError("Please fill cvv details to continue!");
    //       setOnLoad(false);
    //       setDisable(false);
    //     }
    //   }

    //   // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
    //   //   setError("Please fill card details to continue!");
    //   //   // console.log(error);
    //   //   setOnLoad(false);
    //   // } else if (!expiryValidated) {
    //   //   setError("Your Card Expiry date is not valid");
    //   //   setOnLoad(false);
    //   // } else if (!acceptTerms) {
    //   //   setError("Please accept the terms and conditions!");
    //   //   setOnLoad(false);
    //   // } else {
    //   //   setActiveMethod("PAY_IN_6");

    //   //   completeOrderHandler("Checkout", merchantPackId, "");
    //   // }
    // }
    // if (loadQisstPayInThree) {
    //   setOnLoad(true);

    //   let card_number = localStorage.getItem("card_number");
    //   let card_expiry_year = localStorage.getItem("card_expiry_year");
    //   let card_expiry_month = localStorage.getItem("card_expiry_month");
    //   let card_cvv = localStorage.getItem("card_cvv");

    //   console.log("Response: ", card_number);
    //   console.log("Response: ", card_expiry_year);
    //   console.log("Response: ", card_expiry_month);
    //   console.log("Response: ", card_cvv);

    //   if (
    //     card_number === "" ||
    //     card_expiry_year === "" ||
    //     card_expiry_month === "" ||
    //     card_cvv === ""
    //   ) {
    //     setError("Please fill card details to continue!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else if (!acceptTerms) {
    //     setError("Please accept the terms and conditions!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else {
    //     if (card_cvv !== "") {
    //       setActiveMethod("PAY_IN_3");
    //       completeOrderHandler("PAY_IN_3", merchantPackId, "");
    //     } else {
    //       setError("Please fill cvv details to continue!");
    //       setOnLoad(false);
    //       setDisable(false);
    //     }
    //   }

    //   // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
    //   //   setError("Please fill card details to continue!");
    //   //   // console.log(error);
    //   //   setOnLoad(false);
    //   // } else if (!expiryValidated) {
    //   //   setError("Your Card Expiry date is not valid");
    //   //   setOnLoad(false);
    //   // } else if (!acceptTerms) {
    //   //   setError("Please accept the terms and conditions!");
    //   //   setOnLoad(false);
    //   // } else {
    //   //   setActiveMethod("PAY_IN_3");

    //   //   completeOrderHandler("PAY_IN_3", merchantPackId, "");
    //   // }
    // }
    // if (loadQisstPayInSixCC) {
    //   let newAmount =
    //     processingAmount - (processingAmount * processingFee) / 100;
    //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

    //   setProcessingAmount(newAmount);
    //   setProcessingFee("");
    //   updateStateHandler({
    //     payload: {
    //       processingFee: processingFee,
    //       payFastDetails: [],
    //       payFastScreen: 1,
    //     },
    //   });
    //   setOnLoad(true);

    //   let card_number = localStorage.getItem("card_number");
    //   let card_expiry_year = localStorage.getItem("card_expiry_year");
    //   let card_expiry_month = localStorage.getItem("card_expiry_month");
    //   let card_cvv = localStorage.getItem("card_cvv");

    //   console.log("Response: ", card_number);
    //   console.log("Response: ", card_expiry_year);
    //   console.log("Response: ", card_expiry_month);
    //   console.log("Response: ", card_cvv);

    //   if (
    //     card_number === "" ||
    //     card_expiry_year === "" ||
    //     card_expiry_month === "" ||
    //     card_cvv === ""
    //   ) {
    //     setError("Please fill card details to continue!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else if (!acceptTerms) {
    //     setError("Please accept the terms and conditions!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else {
    //     if (card_cvv !== "") {
    //       setActiveMethod("PAY_IN_6_CC");
    //       completeOrderHandler("Checkout", merchantPackId, "");
    //     } else {
    //       setError("Please fill cvv details to continue!");
    //       setOnLoad(false);
    //       setDisable(false);
    //     }
    //   }

    //   // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
    //   //   setError("Please fill card details to continue!");
    //   //   // console.log(error);
    //   //   setOnLoad(false);
    //   // } else if (!expiryValidated) {
    //   //   setError("Your Card Expiry date is not valid");
    //   //   setOnLoad(false);
    //   // } else if (!acceptTerms) {
    //   //   setError("Please accept the terms and conditions!");
    //   //   setOnLoad(false);
    //   // } else {
    //   //   setActiveMethod("PAY_IN_6_CC");

    //   //   completeOrderHandler("Checkout", merchantPackId, "");
    //   // }
    // }
    // if (loadQisstPayInThreeCC) {
    //   let newAmount =
    //     processingAmount - (processingAmount * processingFee) / 100;
    //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

    //   setProcessingAmount(newAmount);
    //   setProcessingFee("");
    //   updateStateHandler({
    //     payload: {
    //       processingFee: processingFee,
    //       payFastDetails: [],
    //       payFastScreen: 1,
    //     },
    //   });
    //   setOnLoad(true);

    //   let card_number = localStorage.getItem("card_number");
    //   let card_expiry_year = localStorage.getItem("card_expiry_year");
    //   let card_expiry_month = localStorage.getItem("card_expiry_month");
    //   let card_cvv = localStorage.getItem("card_cvv");

    //   console.log("Response: ", card_number);
    //   console.log("Response: ", card_expiry_year);
    //   console.log("Response: ", card_expiry_month);
    //   console.log("Response: ", card_cvv);

    //   if (
    //     card_number === "" ||
    //     card_expiry_year === "" ||
    //     card_expiry_month === "" ||
    //     card_cvv === ""
    //   ) {
    //     setError("Please fill card details to continue!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else if (!acceptTerms) {
    //     setError("Please accept the terms and conditions!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else {
    //     if (card_cvv !== "") {
    //       setActiveMethod("PAY_IN_3_CC");
    //       completeOrderHandler("PAY_IN_3_CC", merchantPackId, "");
    //     } else {
    //       setError("Please fill cvv details to continue!");
    //       setOnLoad(false);
    //       setDisable(false);
    //     }
    //   }

    //   // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
    //   //   setError("Please fill card details to continue!");
    //   //   // console.log(error);
    //   //   setOnLoad(false);
    //   // } else if (!expiryValidated) {
    //   //   setError("Your Card Expiry date is not valid");
    //   //   setOnLoad(false);
    //   // } else if (!acceptTerms) {
    //   //   setError("Please accept the terms and conditions!");
    //   //   setOnLoad(false);
    //   // } else {
    //   //   setActiveMethod("PAY_IN_3_CC");

    //   //   completeOrderHandler("PAY_IN_3_CC", merchantPackId, "");
    //   // }
    // }
    // if (loadQisstPayInTwelveCC) {
    //   let newAmount =
    //     processingAmount - (processingAmount * processingFee) / 100;
    //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

    //   setProcessingAmount(newAmount);
    //   setProcessingFee("");
    //   updateStateHandler({
    //     payload: {
    //       processingFee: processingFee,
    //       payFastDetails: [],
    //       payFastScreen: 1,
    //     },
    //   });
    //   setOnLoad(true);

    //   let card_number = localStorage.getItem("card_number");
    //   let card_expiry_year = localStorage.getItem("card_expiry_year");
    //   let card_expiry_month = localStorage.getItem("card_expiry_month");
    //   let card_cvv = localStorage.getItem("card_cvv");

    //   console.log("Response: ", card_number);
    //   console.log("Response: ", card_expiry_year);
    //   console.log("Response: ", card_expiry_month);
    //   console.log("Response: ", card_cvv);

    //   if (
    //     card_number === "" ||
    //     card_expiry_year === "" ||
    //     card_expiry_month === "" ||
    //     card_cvv === ""
    //   ) {
    //     setError("Please fill card details to continue!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else if (!acceptTerms) {
    //     setError("Please accept the terms and conditions!");
    //     setOnLoad(false);
    //     setDisable(false);
    //   } else {
    //     if (card_cvv !== "") {
    //       setActiveMethod("PAY_IN_12_CC");
    //       completeOrderHandler("Checkout", merchantPackId, "");
    //     } else {
    //       setError("Please fill cvv details to continue!");
    //       setOnLoad(false);
    //       setDisable(false);
    //     }
    //   }

    //   // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
    //   //   setError("Please fill card details to continue!");
    //   //   // console.log(error);
    //   //   setOnLoad(false);
    //   // } else if (!expiryValidated) {
    //   //   setError("Your Card Expiry date is not valid");
    //   //   setOnLoad(false);
    //   // } else if (!acceptTerms) {
    //   //   setError("Please accept the terms and conditions!");
    //   //   setOnLoad(false);
    //   // } else {
    //   //   setActiveMethod("PAY_IN_12_CC");

    //   //   completeOrderHandler("Checkout", merchantPackId, "");
    //   // }
    // }

    if (loadCard === true && isGuest === false) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      let card_number = localStorage.getItem("card_number");
      let card_expiry_year = localStorage.getItem("card_expiry_year");
      let card_expiry_month = localStorage.getItem("card_expiry_month");
      let card_cvv = localStorage.getItem("card_cvv");

      console.log("Response: ", card_number);
      console.log("Response: ", card_expiry_year);
      console.log("Response: ", card_expiry_month);
      console.log("Response: ", card_cvv);

      if (
        card_number === "" ||
        card_expiry_year === "" ||
        card_expiry_month === "" ||
        card_cvv === ""
      ) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (card_cvv !== "") {
          setActiveMethod("CARD");
          //  CompleteOrder("CARD", merchantPackageID, "");
          completeOrderHandler("CARD", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }
    }
    if (loadCard === true && isGuest === true) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);

      if (number === "" || expiry === "" || cvc === "") {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("CARD");
          //  CompleteOrder("CARD", merchantPackageID, "");
          completeOrderHandler("CARD", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }
    }
    if (loadJazzCash) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      if (isEmpty(cnic)) {
        setError("Please fill cnic details to continue!");
        setOnLoad(false);
      }
      if (isEmpty(jazzCashNumber)) {
        setError("Please fill contact number!");
        setOnLoad(false);
      } else {
        //  CompleteOrder("CARD", merchantPackageID, "");
        completeOrderHandler("JAZZCASH", merchantPackageId, "");
      }
    }
    if (loadPayFast) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount, number, expiry, cvc);
      if (number === null || expiry === null || cvc === null) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else if (!acceptTerms) {
        setError("Please accept the terms and conditions!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("Payfast");
          console.log("testing");
          setProcessingAmount(newAmount);
          setProcessingFee("");
          updateStateHandler({
            payload: {
              processingFee: processingFee,
              payFastDetails: [],
              payFastScreen: 1,
            },
          });
          setOnLoad(true);
          completeOrderHandler("PAY_FAST", merchantPackageId, "");
        } else {
          setError("Please fill CARD details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }
    }
    if (loadCardPointe) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);

      let card_number = localStorage.getItem("card_number");
      let card_expiry_year = localStorage.getItem("card_expiry_year");
      let card_expiry_month = localStorage.getItem("card_expiry_month");
      let card_cvv = localStorage.getItem("card_cvv");

      console.log("Response: ", card_number);
      console.log("Response: ", card_expiry_year);
      console.log("Response: ", card_expiry_month);
      console.log("Response: ", card_cvv);

      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("CARDPOINTE");
          completeOrderHandler("CARDPOINTE", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }

      // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
      //   setError("Please fill card details to continue!");
      //   setOnLoad(false);
      // } else if (!expiryValidated) {
      //   setError("Your Card Expiry date is not valid");
      //   setOnLoad(false);
      // } else {
      //   //  CompleteOrder("CARD", merchantPackageID, "");
      //   completeOrderHandler("CARDPOINTE", merchantPackageId, "");
      // }
    }
    if (loadClover) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);

      let card_number = localStorage.getItem("card_number");
      let card_expiry_year = localStorage.getItem("card_expiry_year");
      let card_expiry_month = localStorage.getItem("card_expiry_month");
      let card_cvv = localStorage.getItem("card_cvv");

      console.log("Response: ", card_number);
      console.log("Response: ", card_expiry_year);
      console.log("Response: ", card_expiry_month);
      console.log("Response: ", card_cvv);

      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("CLOVER");
          completeOrderHandler("CLOVER", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }

      // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
      //   setError("Please fill card details to continue!");
      //   setOnLoad(false);
      // } else if (!expiryValidated) {
      //   setError("Your Card Expiry date is not valid");
      //   setOnLoad(false);
      // } else {
      //   //  CompleteOrder("CARD", merchantPackageID, "");
      //   completeOrderHandler("CARDPOINTE", merchantPackageId, "");
      // }
    }
    if (loadNab) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);

      let card_number = localStorage.getItem("card_number");
      let card_expiry_year = localStorage.getItem("card_expiry_year");
      let card_expiry_month = localStorage.getItem("card_expiry_month");
      let card_cvv = localStorage.getItem("card_cvv");

      console.log("Response: ", card_number);
      console.log("Response: ", card_expiry_year);
      console.log("Response: ", card_expiry_month);
      console.log("Response: ", card_cvv);

      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("NAB");
          completeOrderHandler("NAB", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }

      // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
      //   setError("Please fill card details to continue!");
      //   setOnLoad(false);
      // } else if (!expiryValidated) {
      //   setError("Your Card Expiry date is not valid");
      //   setOnLoad(false);
      // } else {
      //   //  CompleteOrder("CARD", merchantPackageID, "");
      //   setActiveMethod("NAB");
      //   completeOrderHandler("NAB", merchantPackageId, "");
      // }
    }
    if (loadPinWheel) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);

      let card_number = localStorage.getItem("card_number");
      let card_expiry_year = localStorage.getItem("card_expiry_year");
      let card_expiry_month = localStorage.getItem("card_expiry_month");
      let card_cvv = localStorage.getItem("card_cvv");

      console.log("Response: ", card_number);
      console.log("Response: ", card_expiry_year);
      console.log("Response: ", card_expiry_month);
      console.log("Response: ", card_cvv);

      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("PINWHEEL");
          completeOrderHandler("PINWHEEL", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }

      // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
      //   setError("Please fill card details to continue!");
      //   setOnLoad(false);
      // } else if (!expiryValidated) {
      //   setError("Your Card Expiry date is not valid");
      //   setOnLoad(false);
      // } else {
      //   //  CompleteOrder("CARD", merchantPackageID, "");
      //   setActiveMethod("PINWHEEL");
      //   completeOrderHandler("PINWHEEL", merchantPackageId, "");
      // }
    }
    if (loadAuthorizeDotNet) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);

      let card_number = localStorage.getItem("card_number");
      let card_expiry_year = localStorage.getItem("card_expiry_year");
      let card_expiry_month = localStorage.getItem("card_expiry_month");
      let card_cvv = localStorage.getItem("card_cvv");

      console.log("Response: ", card_number);
      console.log("Response: ", card_expiry_year);
      console.log("Response: ", card_expiry_month);
      console.log("Response: ", card_cvv);

      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("AUTHORIZE.NET");
          completeOrderHandler("AUTHORIZE.NET", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }

      // if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
      //   setError("Please fill card details to continue!");
      //   setOnLoad(false);
      // } else if (!expiryValidated) {
      //   setError("Your Card Expiry date is not valid");
      //   setOnLoad(false);
      // } else {
      //   //  CompleteOrder("CARD", merchantPackageID, "");
      //   setActiveMethod("AUTHORIZE.NET");
      //   completeOrderHandler("AUTHORIZE.NET", merchantPackageId, "");
      // }
    }
    if (loadCOD) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // if cod is selected then setting method to cod

      setActiveMethod("COD");
      // if (props.setActiveMethod != null) {
      // props.setActiveMethod("COD");
      // }
      updateStateHandler({
        payload: {
          activeMethod: "COD",
        },
      });

      // if cod is selected then complete the order
      setOnLoad(true);
      completeOrderHandler("COD", merchantPackageId, "");
      // CompleteOrder("COD", merchantPackageID, "");
    }
    if (loadPaypal) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // console.log("in paypal");
      setActiveMethod("PAYPAL");
      // console.log(merchantPackageId);
      completeOrderHandler("PAYPAL", merchantPackageId, "");
    }
    if (loadBitPay) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // console.log("in paypal");
      setActiveMethod("BITPAY");
      // console.log(merchantPackageId);
      completeOrderHandler("BITPAY", merchantPackageId, "");
    }
    if (loadBrainTree) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // console.log("in paypal");
      setActiveMethod("BRAINTREE");
      // console.log(merchantPackageId);
      completeOrderHandler("BRAINTREE", merchantPackageId, "");
    }
    if (loadEasyPaisa) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // console.log("Number of NO", phoneNumber.length);
      setOnLoad(true);
      if (phoneNumber.length === 11) {
        setError("");
        setActiveMethod("EASYPAISA");
        completeOrderHandler("EASYPAISA", merchantPackageId, "");
      } else if (phoneNumber.length < 11 || phoneNumber.length > 11) {
        // setDisable(false);
        setOnLoad(false);
        setError("Please enter a valid phone number");
      }

      // setSelectedPaymentMeth od("EASYPAISA");
      // setOnLoad(true)

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadVault) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      setActiveMethod("VAULT");
      completeOrderHandler("VAULT", merchantPackageId, "");

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadAlfalah) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      setOnLoad(true);
      if (isEmpty(number) && isEmpty(name) && isEmpty(expiry) && isEmpty(cvc)) {
        setError("Please fill card details to continue!");
        setOnLoad(false);
        setDisable(false);
      } else {
        if (cvc !== "") {
          setActiveMethod("ALFALAH");
          completeOrderHandler("ALFALAH", merchantPackageId, "");
        } else {
          setError("Please fill cvv details to continue!");
          setOnLoad(false);
          setDisable(false);
        }
      }
      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadAlfa) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      setOnLoad(true);
      setActiveMethod("ALFA");
      // await axios.get(`https://sandbox.backoffice.qisstpay.com/bank-alfalah/iframe?merchant_id=85058&total_amount=5000&test=1`).then((response) => {
      //   console.log(response)
      // }).catch((error) => {
      //   console.log(error)
      // })
      // setOnLoad(false)
      completeOrderHandler("ALFA", merchantPackageId, "");

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadUBL) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      setOnLoad(true);
      setActiveMethod("UBL");
      // await axios.get(`https://sandbox.backoffice.qisstpay.com/bank-alfalah/iframe?merchant_id=85058&total_amount=5000&test=1`).then((response) => {
      //   console.log(response)
      // }).catch((error) => {
      //   console.log(error)
      // })
      // setOnLoad(false)
      completeOrderHandler("UBL", merchantPackageId, "");

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadEasyPaisaDirect) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      // setOnLoad(true)
      setActiveMethod("EASYPAISA_DIRECT");
      completeOrderHandler("EASYPAISA_DIRECT", merchantPackageId, "");

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadSezzle) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      setOnLoad(true);
      setActiveMethod("SEZZLE");
      completeOrderHandler("SEZZLE", merchantPackageId, "");

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadForee) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      // setOnLoad(true)
      setActiveMethod("FOREE");
      let amount = 0;

      let refNum = Math.floor(100000 + Math.random() * 900000);
      if (encrypted?.total_amount) {
        amount = encrypted?.total_amount;
      } else if (isTez == 0) {
        amount = totalAmount;
      } else if (meta == "") {
        amount = totalAmount;
      } else {
        amount =
          totalAmount +
          Number(200 + Number(percentageHelper(2.6, Number(totalAmount))));
      }
      (window as any).initiateForeeCheckout({
        key: "c8ab10a7-869f-4825-b870-2db410ee8193",
        amount: amount,
        create_bill: true,
        reference_number: refNum,
        callback: (e: any) => myCallbackFunc(e),
      });
      console.log("Reference Number: " + refNum);
      const myCallbackFunc = async (e: any) => {
        console.log(e);
        // setRefNum(e.reference_number)
        // console.log("Ref Num Callback: " + refNum)
        if (e.bill_status == "paid") {
          setOnLoad(true);
          setActiveMethod("FOREE");
          await completeOrderHandler(
            "FOREE",
            merchantPackageId,
            "",
            "",
            e.reference_number
          );
        }
      };

      // CompleteOrder("EASYPAISA", merchantPackageID, "");
    }
    if (loadJazzCashC) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      //setSelectedPaymentMethod("JAZZCASH_C");
      setOnLoad(true);
      setActiveMethod("JAZZCASH_C");
      completeOrderHandler("JAZZCASH_C", merchantPackageId, "");
    }
    if (loadDirectBank) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      // setSelectedPaymentMethod("EASYPAISA");
      setActiveMethod("DIRECT_BANK_TRANSFER");
      completeOrderHandler("DIRECT_BANK_TRANSFER", merchantPackageId, "");

      // CompleteOrder("DIRECT_BANK_TRANSFER", merchantPackageID, "");
    }
    if (loadKlarna) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      setOnLoad(true);
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setActiveMethod("KLARNA");
      completeOrderHandler("KLARNA", merchantPackageId, "");
    }
    /* if (loadUplift && upliftVirtualCardAvailable) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      setOnLoad(true);
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setActiveMethod("UPLIFT");
      completeOrderHandler("UPLIFT", StripePaymentId, "");
    }*/
    // if (loadAffirm) {
    //   let newAmount =
    //     processingAmount - (processingAmount * processingFee) / 100;
    //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

    //   setProcessingAmount(newAmount);
    //   setProcessingFee("");
    //   updateStateHandler({
    //     payload: {
    //       processingFee: processingFee,
    //       payFastDetails: [],
    //       payFastScreen: 1,
    //     },
    //   });
    //   setActiveMethod("AFFIRM");
    //   (global as any).affirm.checkout.open();
    //   //- CompleteOrder("AFFIRM", merchantPackageID, "");
    // }
  };
  useEffect(() => {
    if (line_items.length != selectedMerchants.length) {
      console.log("first cond true");
      if (
        line_items.length != selectedMerchants.length &&
        shippingPrice == 0 &&
        selectedMerchants.length != 0
      ) {
        setError("Please Select Shipping");
        setOnLoad(false);
        setDisable(false);
      } else {
        console.log("else 2");
        setError("");
      }
    } else {
      console.log("else 1");
      setError("");
    }
  }, [shippingPrice, selectedMerchants]);
  const squarePaymentCheckoutHandler = (pToken: string) => {
    if (loadSquare && pToken != "") {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      setActiveMethod("SQUARE");
      setPaymentToken(pToken);
      completeOrderHandler("SQUARE", merchantPackageId, "", pToken);
    }
  };

  const foreePaymentCheckoutHandler = async () => {};
  const jazzCashCPaymentCheckoutHandler = async () => {};

  const niftPaymentCheckoutHandler = async () => {
    if (loadNift) {
      let newAmount =
        processingAmount - (processingAmount * processingFee) / 100;
      console.log("NEW DEDUCTED AMOUNT: ", newAmount);

      setProcessingAmount(newAmount);
      setProcessingFee("");
      updateStateHandler({
        payload: {
          processingFee: processingFee,
          payFastDetails: [],
          payFastScreen: 1,
        },
      });
      setOnLoad(true);
      setActiveMethod("NIFT");
      await completeOrderHandler("NIFT", merchantPackageId, "");
    }
  };

  // const callAlfalah = async (
  //   sessionID: string,
  //   orderID: string,
  //   alfalahTotalAmount: any
  // ) => {
  //   let newAmount = processingAmount - (processingAmount * processingFee) / 100;
  //   console.log("NEW DEDUCTED AMOUNT: ", newAmount);

  //   setProcessingAmount(newAmount);
  //   setProcessingFee("");
  //   updateStateHandler({
  //     payload: {
  //       processingFee: processingFee,
  //     },
  //   });
  //   console.log(sessionID, orderID, alfalahTotalAmount);

  //   let jSon = {
  //     merchant: "TESTQISSTPAY1", //merchant ID
  //     session: {
  //       id: sessionID,
  //     },
  //     order: {
  //       amount: alfalahTotalAmount,
  //       currency: "PKR",
  //       description: "Ordered goods",
  //       id: orderID,
  //     },
  //     interaction: {
  //       operation: "PURCHASE", // set this field to 'PURCHASE' for <<checkout>> to perform a Pay Operation.
  //       merchant: {
  //         name: "Bank Alfalah",
  //         address: {
  //           line1: "200 Sample St",
  //           line2: "1234 Example Town",
  //         },
  //       },
  //     },
  //   };
  //   // await (window as any).Checkout()
  //   await (window as any).Checkout.configure(jSon)(
  //     window as any
  //   ).Checkout.showPaymentPage();
  // };
  const getmallShipping = () => {
    let array = [...globalCartObject];
    let object: any = [];
    array.map((items) => {
      object.push({
        title: items.SelectedShipping.title,
        cost: items.SelectedShipping.fee,
        merchant_user_id: items.items[0].merchant_user_id,
      });
    });

    return object;
  };

  /**
   * @description complete order and hit the create order api
   * @param packageName
   * @param packageId
   * @param paymentMethodId
   * @returns
   */

  const urlParams = new URLSearchParams(wordUrl);
  const shippingTootal = urlParams.get("shipping_total");
  // useEffect(() => {
  // if (shippingPrice == 0 || shippingPrice == "" || shippingPrice == null) {
  //   updateStateHandler({
  //     payload: {
  //       shippingPrice: shippingTootal,
  //     },
  //   });
  // }
  // }, []);
  const completeOrderHandler = async (
    packageName: string,
    packageId: string,
    paymentMethodId: string,
    pToken?: string,
    refID?: any
  ) => {
    let segmentId = "12";
    let attribute_ids: any = [];
    let attribute: any = [];
    let card_number = localStorage.getItem("card_number");
    let card_expiry_year = localStorage.getItem("card_expiry_year");
    let card_expiry_month = localStorage.getItem("card_expiry_month");
    let card_cvv = localStorage.getItem("card_cvv");
    let card_skyflow_id = localStorage.getItem("card_skyflow_id");
    let card_pin_id = localStorage.getItem("card_pin_id");

    let newNumber: any = localStorage.getItem("JWTPhone");
    let newEmail: any = localStorage.getItem("JWTEmail");
    let tkn: any = localStorage.getItem("JWTtoken");
    let iid = localStorage.getItem("JWTid");

    if (
      platForm_bigCommerce != null &&
      platForm_bigCommerce?.toLocaleUpperCase() == "BIGCOMMERCE"
    ) {
      productsObj?.map((item: any) => {
        item.attribute_ids?.map((it: any) => {
          attribute_ids?.push({
            attr_id: it.attr_id,
            attr_value_id: it.attr_value_id,
          });
        });
      });

      productsObj?.map((item: any) => {
        item.attribute?.map((it: any) => {
          attribute.push({
            attribute: it,
          });
        });
      });
    }
    console.log(shippingMethods, "shippingMethods");

    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    (global as any).rudderanalytics?.track(
      "payment_info_submitted",
      {},
      {
        entered_number: intlNumber,
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    try {
      setDisable(true);
      let num = phoneNumber;
      let amount = 0;
      if (encrypted?.total_amount) {
        amount = encrypted?.total_amount;
      } else if (isTez == 0) {
        amount = totalAmount;
      } else if (meta == "") {
        amount = totalAmount;
      } else {
        amount =
          totalAmount +
          Number(200 + Number(percentageHelper(2.6, Number(totalAmount))));
      }
      const formatDecimal = (platform_fee: any) => {
        const floatValue = parseFloat(platform_fee);
        return isNaN(floatValue) ? platform_fee : floatValue.toFixed(2);
      };
      const formattedValue = formatDecimal(platform_fee);
      const payload: IPlaceOrder = {
        is_new_checkout:false,
        isEventsEnabled: isEventsEnabled,
        system_source: "web",
        mall_taxes: mall_taxes,
        platform_fee: formattedValue.toString(),
        rs_anonymous_id: rudderStackID,
        headless_url: headless_url ? atob(headless_url) : "",
        link_id: link_id ? link_id.toString() : "",
        is_headless:
          Number(is_headless) === 0 || Number(is_headless) === 1
            ? Number(is_headless)
            : 0,
        payment_method_id:
          packageName === "TOKEN_CARD" ? customerCardId.toString() : "",
        view_id: view,
        mall_id: mall_ID ? mall_ID : null,
        is_wallet_enabled: wallet_Balance === 0 ? false : toggleButton,
        account_number: phoneNumber
          ? phoneNumber
          : selectedBank != ""
          ? accountNumber
          : payFastScreen === 1 || payFastScreen === 4
          ? payFastDetails[1]?.Account_Number
          : number, //  : phoneNumber  TODO: Handler for later packages
        wallet_amount: merchantWalletIsEnabled
          ? Number(walletBalance.toFixed(2))
          : 0,
        wallet_percentage: merchantWalletIsEnabled
          ? merchantWalletFeePercentage
          : 0,
        tracking_id: "",
        is_tez: isTez,
        cart_Id:
          platForm_bigCommerce != null &&
          platForm_bigCommerce?.toLocaleUpperCase() == "BIGCOMMERCE"
            ? cart_id
            : "",
        attribute:
          platForm_bigCommerce != null &&
          platForm_bigCommerce?.toLocaleUpperCase() == "BIGCOMMERCE"
            ? attribute
            : "",
        attribute_ids:
          platForm_bigCommerce != null &&
          platForm_bigCommerce?.toLocaleUpperCase() == "BIGCOMMERCE"
            ? attribute_ids
            : [],
        is_card_tokenized: card_skyflow_id ? true : false,
        tokenized_card_id: card_skyflow_id ? card_skyflow_id : "",
        processing_fee:
          packageName.toLocaleUpperCase() == "PAY_IN_3"
            ? //  ||
              // packageName.toLocaleUpperCase() == "PAY_IN_2"
              (amount / 100) * newProcessingFee
            : 0,
        processing_fee_percentage:
          packageName.toLocaleUpperCase() == "PAY_IN_3"
            ? // ||
              // packageName.toLocaleUpperCase() == "PAY_IN_2"
              newProcessingFee
            : "",
        // shipping_methods:
        //   // mall_ID === null mall remove comment and remove lower condition
        //   packageName !== ""
        //     ? shipping_flag && shipping_flag === "true"
        //       ? [
        //           {
        //             title:
        //               shippingName && shippingName !== ""
        //                 ? shippingName
        //                 : "Shipping",
        //             cost: shippingPrice,
        //           },
        //         ]
        //       : shipping_flag && shipping_flag === "false"
        //       ? [
        //           {
        //             title: "",
        //             cost: 0,
        //           },
        //         ]
        //       : !shipping_flag
        //       ? [
        //           {
        //             title:
        //               shippingName && shippingName !== ""
        //                 ? shippingName
        //                 : "Shipping",
        //             cost: shippingPrice,
        //           },
        //         ]
        //       : [
        //           {
        //             title:
        //               shippingName && shippingName !== ""
        //                 ? shippingName
        //                 : "Shipping",
        //             cost: shippingPrice,
        //           },
        //         ]
        //     : // : getmallShipping(), mall remove comment and add comment below
        //       "",
        shipping_methods:
          selectedMerchants.length > 0
            ? selectedMerchants
            : [
                {
                  title: shippingMethods?.description,
                  cost: shippingMethods?.cost,
                },
              ],
        merchant_package_id:
          packageName.toLocaleUpperCase() === "UPLIFT"
            ? StripePaymentId
            : encrypted?.merchant_package_id ?? Number(packageId),
        store_url: "https://sandbox.wordpress.qisstpay.com/wp-json/wc/v3/", //TODO:url update the new url for now we are hard code it,
        quantity: 1,
        refrence_id: refID,
        merchant_call_back_url: merchant_call_back_url,
        place_order_on_merchant_site: place_order_on_merchant_site,
        shipping_amount:
          shipping_flag && shipping_flag === "true"
            ? encrypted?.shipping_amount ?? Number(shippingPrice)
            : shipping_flag && shipping_flag === "false"
            ? 0
            : !shipping_flag
            ? encrypted?.shipping_amount ?? Number(shippingPrice)
            : encrypted?.shipping_amount ?? Number(shippingPrice),
        shipping_title:
          shipping_flag && shipping_flag === "true"
            ? encrypted?.shipping_title ?? String(shippingName)
            : shipping_flag && shipping_flag === "false"
            ? ""
            : !shipping_flag
            ? encrypted?.shipping_title ?? String(shippingName)
            : encrypted?.shipping_title ?? String(shippingName),
        tax_amount: encrypted?.tax_amount ?? Number(taxPrice),
        total_amount: amount,
        // tokenized_card_pin_id: card_pin_id ? card_pin_id : "",
        cvv: loadCOD ? "" : card_cvv ? card_cvv : cvc ? cvc : "",
        card_number: loadCOD
          ? ""
          : card_number
          ? card_number
          : number
          ? number.split(" ").join("")
          : "",
        card_holder_name: loadCOD ? "" : name,
        expiry_month: loadCOD
          ? ""
          : card_expiry_month
          ? card_expiry_month
          : expiry
          ? expiry.split("/")[0]
          : "",
        expiry_year: loadCOD
          ? ""
          : card_expiry_year
          ? card_expiry_year
          : expiry
          ? expiry.split("/")[1]
          : "",
        tokenized_card: card_skyflow_id ? true : false,
        source:
          cardSelect && packageName === "TOKEN_CARD"
            ? "token"
            : packageName.toLocaleUpperCase() === "CARD" ||
              packageName.toLocaleUpperCase() === "CHECKOUT"
            ? "card"
            : "", //TODO: Handler for later packages
        meta: meta,
        currency:
          packageName.toLocaleUpperCase() == "SQUARE" ||
          packageName.toLocaleUpperCase() == "PAYPAL"
            ? "USD"
            : packageName.toLocaleUpperCase() == "ALFA" ||
              packageName.toLocaleUpperCase() == "UBL" ||
              packageName.toLocaleUpperCase() == "ALFALAH"
            ? "PKR"
            : encrypted?.currency ?? currency,
        shipping_info: {
          address1: encrypted?.shipping_info?.address1 ?? address, //selectedAddress?.address,
          address2: "",
          state: encrypted?.shipping_info?.state ?? state, //selectedAddress?.state,
          city: encrypted?.shipping_info?.city ?? city, //selectedAddress?.city,
          zip:
            is_headless === "1" &&
            mall_ID === null &&
            tkn !== "null" &&
            iid !== "null"
              ? shippingZipCode
              : encrypted?.shipping_info?.zip ?? shippingZip,
          country:
            country == ""
              ? "PAKISTAN"
              : encrypted?.shipping_info?.country ?? country, //selectedAddress?.country,
          first_name:
            encrypted?.shipping_info?.first_name ?? selectedShipping.name,
          last_name: "",
          phone:
            encrypted?.shipping_info?.phone ?? selectedShipping.phone_number,
        },
        billing_info: {
          address1: encrypted?.billing_info?.address1 ?? address,
          address2: "",
          state: encrypted?.billing_info?.state ?? state,
          city: encrypted?.billing_info?.city ?? city, //TODO: update billing and shipping city and zip code
          zip:
            is_headless === "1" &&
            mall_ID === null &&
            tkn !== "null" &&
            iid !== "null"
              ? billingZipCode
              : encrypted?.billing_info?.zip ?? billingZip,
          country:
            country == ""
              ? "PAKISTAN"
              : encrypted?.billing_info?.country ?? country,
        },
        line_items: lineItems,
        package_name: encrypted?.package_name ?? packageName,
        shippingScreenNew: false, //TODO
        is_guest: encrypted?.is_guest ?? isGuest,
        query_string: encrypted?.query_string ?? queryString,
        payment_token: pToken,
        discounted_amount: Number(discountedAmount),
        coupon_code: couponCode,
        checkout_url: checkout_url,
        store_type:
          storeType != ""
            ? storeType
            : invoice_id !== "" && invoice_id !== null
            ? "INVOICE"
            : "ECOMMERCE",
        cnic: cnic
          ? cnic
          : payFastScreen === 1 || payFastScreen === 4
          ? payFastDetails[2]?.cnic_number
          : "",
        phone_number: jazzCashNumber
          ? jazzCashNumber
          : payFastScreen === 2
          ? payFastDetails[3]?.phone_number
          : newNumber
          ? newNumber
          : intlNumber,
        bank_id: selectedBank
          ? selectedBank
          : payFastScreen === 1 || payFastScreen === 4
          ? payFastDetails[0]?.bank_id
          : "",
        redirect_url: redirectUrl,
        // call_back_url: packageName.toLocaleUpperCase() == "UBL" ? "https://apis.qisstpay.com/order-service/call_back/?payment_gateway=ubl" : callBackUrl,
        call_back_url: callBackUrl,
        merchant_order_id: merchantOrderId || merchant_order_id,
        merchant_request: merchantEndRequest,
        segmentId: segmentId,
        bank_name: "",
        is4gives: is4gives,
        email: newEmail && newEmail !== "null" ? newEmail : email ? email : "",
        isExistingUser: isExistingUser,
        invoice_id: invoice_id,
        discount_code: couponCode,
      };
      let ipRes: any;
      try {
        ipRes = await axios.get("https://api.ipify.org/?format=json");
      } catch (error: any) {
        setError(
          error?.response?.data?.message ??
            "Request Blocked due to 3rd party extension!"
        );
        setOnLoad(false);
        setDisable(false);
        // var myHeaders = new Headers();
        // myHeaders.append(
        //   "X-SKYFLOW-ACCOUNT-ID",
        //   "id9ecf9414344396a194ae07f34be2ee"
        // );
        // myHeaders.append(
        //   "Authorization",
        //   `Bearer ${
        //     is_headless === "1" &&
        //     mall_ID === null &&
        //     tkn !== "null" &&
        //     iid !== "null"
        //       ? tkn
        //       : token == "" || token == null
        //       ? newToken
        //       : token
        //   }`
        // );
        // var requestOptions: any = {
        //   method: "DELETE",
        //   headers: myHeaders,
        //   redirect: "follow",
        // };
        // fetch(
        //   `https://kp1012drajk9.vault.skyflowapis.com/v1/vaults/f4a13c4bc8cb4c499038bd1f36967474/cards/${card_skyflow_id}`,
        //   requestOptions
        // )
        //   .then((response) => response.text())
        //   .then((result) => console.log(result))
        //   .catch((error) => console.log("error", error));
        // setError("Request Blocked By 3rd Party Extension");
        // setOnLoad(false);
        // setDisable(false);
      }

      if (ipRes) {
        const response = await orderService.placeOrder(payload, {
          headers: {
            Authorization: `Bearer ${
              is_headless === "1" &&
              mall_ID === null &&
              tkn !== "null" &&
              iid !== "null"
                ? tkn
                : token == "" || token == null
                ? newToken
                : token
            }`,
            "identity-token":
              identityToken != "" ? identityToken : ctxIdentiyToken,
            "X-Forwarded-For": ipRes?.data?.ip ?? "NAN",
          },
        });
        console.log("log1");

        if (response.success) {
          console.log("log2");

          localStorage.setItem("orderStatus", "success");
          /*if (packageName.toLocaleUpperCase() === "UPLIFT") {
            (window as any).Uplift.Payments.confirm(
              response.data.order_number.toString()
            );
          }*/
          updateStateHandler({
            payload: {
              discountedAmount: discountedAmount + response.data.bin_discount,
            },
          });

          localStorage.removeItem("card_number");
          localStorage.removeItem("card_expiry_year");
          localStorage.removeItem("card_expiry_month");
          localStorage.removeItem("card_cvv");
          localStorage.removeItem("card_skyflow_id");
          localStorage.removeItem("card_pin_id");

          // if (newSessionID !== "") {
          //   try {
          //     await axios
          //       .put(
          //         `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
          //         {
          //           userId: "",
          //           phoneNumber: intlNumber,
          //           sessionId: newSessionID,
          //           orderId: response.data.order_id,
          //           json: JSON.stringify({
          //             userId: "",
          //             phoneNumber: intlNumber,
          //             sessionId: newSessionID,
          //             json: JSON.stringify({
          //               recoveryStatus: "CONVERTED",
          //             }),
          //           }),
          //         }
          //       )
          //       .then(async (response: any) => {
          //         console.log("UPDATE RESPONSE: ", response);
          //         updateStateHandler({
          //           payload: {
          //             newSessionID: response?.data?.body?.sessionId,
          //             abandonedCartCheck: true,
          //             cartSessionID: response?.data?.body?.sessionId,
          //           },
          //         });
          //       })
          //       .catch(function (error) {
          //         console.log(error);
          //       });
          //   } catch (error: any) {
          //     console.log(error);
          //   }
          // }

          if (newSessionID === "") {
            try {
              await axios
                .post(
                  `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/end`,
                  {
                    sessionId: cartSessionID,
                    orderId: response.data.order_id,
                  }
                )
                .then((response: any) => {
                  // updateStateHandler({
                  //   payload: {
                  //     abandonedCartCheck: true,
                  //     cartSessionID: response?.body?.sessionId
                  //   },
                  // });
                  // console.log(
                  //   response,
                  //   "PLACE ORDER #############################################"
                  // );
                  // console.log(
                  //   packageName,
                  //   "PACKAGE NAME #############################################"
                  // );
                })
                .catch(function (error) {
                  console.log(error);
                });
            } catch (error: any) {
              console.log(error);
            }
          }

          setDisable(false);
          setOnLoad(false);
          if (toggleButton === true && Number(walletBalance) < amount) {
            updateStateHandler({
              payload: {
                prodAmount: amount - Number(walletBalance),
                activeMethod: activeMethod,
                orderId: response.data.order_id,
                trackingId: response.data.tracking_id,
              },
            });
          } else if (toggleButton === true && Number(walletBalance) > amount) {
            updateStateHandler({
              payload: {
                prodAmount: Number(walletBalance) - amount,
                activeMethod: activeMethod,
                orderId: response.data.order_id,
                trackingId: response.data.tracking_id,
              },
            });
          } else {
            updateStateHandler({
              payload: {
                prodAmount: amount,
                activeMethod: activeMethod,
                orderId: response.data.order_id,
                trackingId: response.data.tracking_id,
              },
            });
          }
          updateStateHandler({
            payload: {
              prodAmount: amount,
              activeMethod: activeMethod,
              orderId: response.data.order_id,
              trackingId: response.data.tracking_id,
            },
          });

          if (
            packageName == "COD" ||
            packageName == "DIRECT_BANK_TRANSFER" ||
            packageName == "EASYPAISA" ||
            packageName == "EASYPAISA_DIRECT" ||
            packageName == "BRAINTREE" ||
            packageName == "JAZZCASH" ||
            packageName == "Payfast" ||
            packageName == "TOKEN_CARD" ||
            packageName == "CARDPOINTE" ||
            packageName == "WALLET_COD" ||
            packageName == "CLOVER" ||
            packageName == "FOREE" ||
            (packageName == "SQUARE" &&
              window.location.pathname != routes.paymentFailurePage)
          ) {
            setRedirectLink(response.data.redirect_url ?? "");
            setTrackingId(response.data.tracking_id);
            setOrderId(response.data.order_id);
            history.push(
              `${routes.paymentSuccessPage}/?tracking_id=${response.data.tracking_id}&token=${token}&order_id=${response.data.order_number}`
            );
          } else if (
            (packageName == "COD" ||
              packageName == "EASYPAISA" ||
              packageName == "EASYPAISA_DIRECT" ||
              packageName == "DIRECT_BANK_TRANSFER" ||
              packageName == "CARDPOINTE" ||
              packageName == "JAZZCASH" ||
              packageName == "Payfast" ||
              packageName == "TOKEN_CARD" ||
              packageName == "WALLET_COD" ||
              packageName == "BRAINTREE" ||
              packageName == "CLOVER" ||
              packageName == "SQUARE" ||
              packageName == "FOREE") &&
            window.location.pathname == routes.paymentFailurePage
          ) {
            // checking if coming from failure case
            const search = window.location.search;
            setOnLoad(false);
            setDisable(false);
            setRedirectLink(response.data.redirect_url ?? "");
            setTrackingId(response.data.tracking_id);
            setOrderId(response.data.order_id);
            history.push(`${routes.paymentSuccessPage}/${search}`);
          } else if (
            packageName == "Checkout" ||
            packageName == "CARD" ||
            packageName == "CARDPOINTE" ||
            packageName == "JAZZCASH" ||
            packageName == "Payfast" ||
            packageName == "TOKEN_CARD" ||
            packageName == "BITPAY" ||
            packageName == "WALLET_COD" ||
            packageName == "FOREE" ||
            packageName == "NAB" ||
            packageName == "CLOVER" ||
            packageName == "PINWHEEL" ||
            packageName == "UPLIFT" ||
            packageName == "PAY_IN_3" ||
            packageName == "PAY_IN_2" ||
            packageName == "AUTHORIZE.NET"
          ) {
            if (response.data.html_snippet === null) {
              if (response.data.redirect_url) {
                window.location.href = response.data.redirect_url ?? "";
              } else {
                history.push(
                  `${routes.paymentSuccessPage}/?tracking_id=${response.data.tracking_id}&token=${token}&order_id=${response.data.order_number}`
                );
              }
              setOnLoad(false);
              setDisable(false);
            } else if (response.data.html_snippet) {
              updateStateHandler({
                payload: {
                  AlfalahHTMLSnippet: response.data.html_snippet,
                },
              });
              fetch("https://services.qisstpay.com/api/external/alfalah/html", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  html: response.data.html_snippet,
                }),
                redirect: "follow",
              })
                .then((response) => response.json())
                .then((result) => {
                  setTimeout(() => {
                    window.location.href = result.link;
                    console.log(result.link, "result");
                  }, 500);
                  // Handle the result as needed
                })
                .catch((error) => console.log("error", error));
            }
          } else if (packageName == "KLARNA") {
            setOnLoad(false);
            setSnippet(response.data.html_snippet ?? "");
            setOpenModal(true);
          } else if (packageName == "PAYPAL") {
            if (response.data.redirect_url) {
              const a = document.createElement("a");
              a.href = response.data.redirect_url;
              a.setAttribute("target", "_blank");
              a.click();
            }
          } else if (
            packageName == "ALFALAH" ||
            packageName == "Checkout" ||
            packageName == "CARD" ||
            packageName == "Payfast" ||
            packageName.toLocaleUpperCase() == "PAY_IN_2"
          ) {
            fetch("https://services.qisstpay.com/api/external/alfalah/html", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                html: response.data.html_snippet,
              }),
              redirect: "follow",
            })
              .then((response) => response.json())
              .then((result) => {
                setTimeout(() => {
                  window.location.href = result.link;
                  console.log(result.link, "result");
                }, 500);
                // Handle the result as needed
              })
              .catch((error) => console.log("error", error));

            // var html = btoa(response.data.html_snippet)
            // console.log("html: ", html)
            // const a = document.createElement("a");
            // a.href = `/bankAlfalahRedirect/${response?.data?.session_id ? response?.data?.session_id : 0}/${html}/${amount}`;
            // a.setAttribute("target", "_parent");
            // a.click();
            setOnLoad(false);
            setSnippet(response.data.html_snippet ?? "");
            setOpenModal(true);
            updateStateHandler({
              payload: {
                AlfalahHTMLSnippet: response.data.html_snippet,
              },
            });

            if (response.data.html_snippet) {
              setTimeout(() => {
                history.push("/alfalah-submit-page");
              }, 500);
            }
            console.log("/");

            // setOnLoad(false);
            // setSnippet(response.data.html_snippet ?? "");
            // setOpenModal(true);
          } else if (packageName == "UBL") {
            const a = document.createElement("a");
            a.href = `https://backoffice.qisstpay.com/ubl/iframe?action=${response.data.redirect_url}&transaction_id=${response.data.transaction_id}`;
            a.setAttribute("target", "_parent");
            a.click();
          } else if (packageName == "JAZZCASH_C") {
            const a = document.createElement("a");
            a.href = `https://stage.backoffice.qisstpay.com/jazz/iframe?merchant_id=${userID}&total_amount=${amount}`;
            a.setAttribute("target", "_parent");
            a.click();
          } else if (encrypted?.package_name ?? packageName == "Payfast") {
            if (response.success) {
              setPayFastOrderID(response.data.order_id);
              setPayFastOrderNumber(response.data.order_number);
              setPayFastToggle(true);
              fetch("https://services.qisstpay.com/api/external/alfalah/html", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  html: response.data.html_snippet,
                }),
                redirect: "follow",
              })
                .then((response) => response.json())
                .then((result) => {
                  setTimeout(() => {
                    window.location.href = result.link;
                    console.log(result.link, "result");
                  }, 500);
                  // Handle the result as needed
                })
                .catch((error) => console.log("error", error));
            }
          } else if (packageName == "SEZZLE") {
            if (response.data.redirect_url) {
              const a = document.createElement("a");
              a.href = response.data.redirect_url;
              a.setAttribute("target", "_blank");
              a.click();
            }
          } else if (packageName == "NIFT") {
            console.log("inside order nift");
            console.log(response.data.order_id);
            setOtpPage(true);
            if (response.data.order_id != "") {
              setOtpPage(true);
            }
          }
          // setTimeout(() => {
          //   if (response.data.platform.toUpperCase() === "BIGCOMMERCE") {
          //     const a = document.createElement("a");
          //     a.href = bigCommerceURL;
          //     a.setAttribute("target", "_parent");
          //     a.click();
          //   }
          // }, 5000);
          // setTimeout(() => {
          //   if (response.mulberry_url) {
          //     const a = document.createElement("a");
          //     a.href = response.mulberry_url;
          //     a.click();
          //   }
          // }, 5000);
        } else {
          console.log("log3");
          // try {
          //   await axios
          //     .put(
          //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
          //       {
          //         userId: customerId,
          //         phoneNumber: intlNumber,
          //         sessionId: cartSessionID,
          //         json: JSON.stringify({
          //           sessionID: cartSessionID.toString(),
          //           date: new Date(),
          //           email: email,
          //           abandonedStep: "Place Order",
          //           emailStatus: "",
          //           recoveryStatus: "",
          //           totalAmount: (
          //             Number(totalAmount) +
          //             Number(shippingPrice) +
          //             Number(taxPrice) -
          //             Number(discountedAmount)
          //           ).toString(),
          //           currency: currency,
          //           orderItems: {
          //             product: productsObj,
          //             shippingAmount: shippingPrice,
          //             subTotal: (
          //               Number(totalAmount) - Number(discountedAmount)
          //             ).toString(),
          //           },
          //           orderDetails: {
          //             firstName: name,
          //             lastName: lastName,
          //             phoneNumber: intlNumber,
          //             cityName: city,
          //             stateName: state,
          //             countryName: country,
          //             zipCode: zipCode,
          //           },
          //           billingDetails: [],
          //           shippingDetails: [],
          //         }),
          //       }
          //     )
          //     .then(async (response: any) => {
          //       updateStateHandler({
          //         payload: {
          //           cartSessionID: response?.data?.body?.sessionId,
          //         },
          //       });
          //     })
          //     .catch(function (error) {
          //       console.log(error);
          //     });
          // } catch (error: any) {
          //   console.log(error);
          // }

          if (
            !selectedShipping ||
            selectedShipping == null ||
            isEmpty(selectedShipping) ||
            selectedShipping == undefined ||
            selectedShipping == ""
          ) {
            setError("Address not found");
            setOnLoad(false);
            setDisable(false);
          }
          setError(response.message);
          setOnLoad(false);
          setDisable(false);
        }
      }
    } catch (error: any) {
      // try {
      //   await axios
      //     .put(
      //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
      //       {
      //         userId: customerId,
      //         phoneNumber: intlNumber,
      //         sessionId: cartSessionID,
      //         json: JSON.stringify({
      //           sessionID: cartSessionID.toString(),
      //           date: new Date(),
      //           email: email,
      //           abandonedStep: "Place Order",
      //           emailStatus: "",
      //           recoveryStatus: "",
      //           totalAmount: (
      //             Number(totalAmount) +
      //             Number(shippingPrice) +
      //             Number(taxPrice) -
      //             Number(discountedAmount)
      //           ).toString(),
      //           currency: currency,
      //           orderItems: {
      //             product: productsObj,
      //             shippingAmount: shippingPrice,
      //             subTotal: (
      //               Number(totalAmount) - Number(discountedAmount)
      //             ).toString(),
      //           },
      //           orderDetails: {
      //             firstName: name,
      //             lastName: lastName,
      //             phoneNumber: intlNumber,
      //             cityName: city,
      //             stateName: state,
      //             countryName: country,
      //             zipCode: zipCode,
      //           },
      //           billingDetails: [],
      //           shippingDetails: [],
      //         }),
      //       }
      //     )
      //     .then(async (response: any) => {
      //       updateStateHandler({
      //         payload: {
      //           cartSessionID: response?.data?.body?.sessionId,
      //         },
      //       });
      //       // console.log(response, "#############################################");
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
      // } catch (error: any) {
      //   console.log(error);
      // }
      (global as any).rudderanalytics?.track(
        "payment_info_submit_failed",
        {},
        {
          error: error.message,
          entered_number: intlNumber,
          time_stamp: time_stamp,
          user_type: user_type,
          user_id: customerId,
          merchant_id: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
      if (
        !selectedShipping ||
        selectedShipping == null ||
        isEmpty(selectedShipping) ||
        selectedShipping == undefined ||
        selectedShipping == ""
      ) {
        setError("Address not found");
        setOnLoad(false);
        setDisable(false);
      } else {
        // console.log("ERROR -----------------------:", error);
        console.log("ERROR -----------------------:", error.message);
        setError(error?.response?.data?.message ?? "Payment Failed");
        setOnLoad(false);
        setDisable(false);
      }
    }
  };

  /**
   * @description
   * * request to get order data
   * @param tracking_id
   * @param token
   */
  const wordTax = urlParams.get("tax");

  const requestOrderHandler = async (trackingID: any, token: any) => {
    try {
      console.log("inside");
      const response = await orderService.getOrderRequestLog(trackingID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response);
      if (response.success) {
        setEncrypted(response.data.request);
        let totalAmount = response.data.request.total_amount;

        updateStateHandler({
          payload: {
            token: token,
            identityToken: response.data.headers["Identity-Token"][0],
            address: response.data.request?.shipping_info?.address1,
            price: response.data.request.total_amount,
            name: response.data.request.user.name,
            lastName: response.data.request.user.name,
            countryCode: response.data.request.country_code,
            city: response.data.request.shipping_info.city,
            currency: response.data.request.currency,
            couponCode: response.data.request.coupon_code,
            discountedAmount: response.data.request.discounted_amount,
            isCouponApplied: response.data.request.coupon_code != "",
            customerId: response.data.request.customer_id,
            encrypted: response.data.request,
            country: response.data.request.shipping_info.country,
            state: response.data.request.shipping_info.state,
            total_amount: response.data.request.total_amount,
            storeType: response.data.request.store_type,
            // invoiceId: response.data.request.invoice_id,
            redirectUrl: response.data.request.redirect_url,
            callBackUrl: response.data.request.notification_url,
            merchantOrderId: String(response.data.request.merchant_order_id),
            merchantEndRequest: response.data.request.merchant_request,
            isTez: response.data.request.is_tez,
            checkout_url: `${response.data.headers.Origin[0]}/${response.data.request.query_string}`,
            emailValidated: true, //TODO: have to check this using email response
            is4gives: response.data.request.is4gives,
            totalAmount: totalAmount,
            taxPrice:
              response.data.request.tax_amount != 0
                ? response.data.request.tax_amount
                : wordTax,
            shippingPrice:
              // response.data.request.shipping_amount == 0
              //   ? shippingTootal
              //   :
              response.data.request.shipping_amount,
            isExistingUser: response.data.request.isExistingUser,
          },
        });
        await getPaymentMethodsHandler(
          token,
          response.data.headers["Identity-Token"][0],
          totalAmount,
          response.data.request.customer_id
        );
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
          "PAY_IN_4"
        ) {
          setPaymentMethod("qisstpay");
          setLoadQisstPay(true);
          setActiveMethod("qisstpay");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
          "PAY_IN_3"
        ) {
          setPaymentMethod("qisstpay");
          setLoadQisstPay(true);
          setActiveMethod("qisstpay");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
          "PAY_IN_2"
        ) {
          setPaymentMethod("qisstpay");
          setLoadQisstPay(true);
          setActiveMethod("qisstpay");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
          "PAY_IN_4"
        ) {
          setPaymentMethod("qisstpay");
          setLoadQisstPay(true);
          setActiveMethod("qisstpay");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() ==
            "SPLIT_PAY" ||
          response.data.request.payment_type == "SPLITIT"
        ) {
          setPaymentMethod("qisstpay");
          setLoadQisstPay(true);
          setActiveMethod("qisstpay");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "COD" ||
          response.data.request.payment_type == "cod"
        ) {
          setPaymentMethod("cod");
          setLoadCOD(true);
          setActiveMethod("cod");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "PAYPAL" ||
          response.data.request.payment_type == "paypal"
        ) {
          setPaymentMethod("paypal");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() ==
            "GOOGLEPAY" ||
          response.data.request.payment_type == "googlepay"
        ) {
          setPaymentMethod("googlepay");
          // TODO
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
            "CARD" ||
          response.data.request.merchant_package_name == "card"
        ) {
          // console.log("here is must");
          setPaymentMethod("card");
          setLoadCard(true);
          setActiveMethod("card");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
            "CARDPOINTE" ||
          response.data.request.merchant_package_name == "Cardpointe"
        ) {
          // console.log("here is must");
          setPaymentMethod("cardpointe");
          setLoadCardPointe(true);
          setActiveMethod("cardpointe");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
            "CLOVER" ||
          response.data.request.merchant_package_name == "Clover"
        ) {
          // console.log("here is must");
          setPaymentMethod("CLOVER");
          setLoadClover(true);
          setActiveMethod("CLOVER");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
            "WALLET_COD" ||
          response.data.request.merchant_package_name == "WALLET_COD"
        ) {
          setPaymentMethod("WALLET_COD");
          setActiveMethod("WALLET_COD");
        }
        if (
          response.data.request.merchant_package_name.toLocaleUpperCase() ==
            "TOKEN_CARD" ||
          response.data.request.merchant_package_name == "TOKEN_CARD"
        ) {
          setPaymentMethod("TOKEN_CARD");
          setActiveMethod("TOKEN_CARD");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() ==
          "DIRECT_BANK_TRANSFER"
        ) {
          setPaymentMethod("DIRECT_BANK_TRANSFER");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "SEZZLE"
        ) {
          setPaymentMethod("sezzle");
          // TODO
        }
        if (response.data.request.payment_type.toLocaleUpperCase() == "FOREE") {
          setPaymentMethod("foree");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "JAZZCASH_C"
        ) {
          setPaymentMethod("JAZZCASH_C");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "EASYPAISA"
        ) {
          setPaymentMethod("EASYPAISA");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "ALFALAH"
        ) {
          setPaymentMethod("ALFALAH");
          // TODO
        }
        if (response.data.request.payment_type.toLocaleUpperCase() == "ALFA") {
          setPaymentMethod("ALFA");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "JAZZCASH"
        ) {
          setPaymentMethod("JAZZCASH");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "PAYFAST"
        ) {
          setPaymentMethod("PAYFAST");
          setLoadClover(true);
          setActiveMethod("PAYFAST");
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() ==
          "EASYPAISA_DIRECT"
        ) {
          setPaymentMethod("EASYPAISA_DIRECT");
          // TODO
        }
        if (
          response.data.request.payment_type.toLocaleUpperCase() == "KLARNA"
        ) {
          setPaymentMethod("KLARNA");
          // TODO
        }
        if (window.location.pathname == "/failure") {
          getTaxesAndShippingHandler(
            response.data.headers.Authorization[0].split(" ")[1],
            response.data.headers["Identity-Token"][0],
            String(response.data.request.customer_id),
            response.data.request.total_amount,
            {
              city: response.data.request.shipping_info.city,
              country: response.data.request.shipping_info.country,
              state: response.data.request.shipping_info.state,
            }
          );
          // console.log(response.data.request.customer_id);
          let id = response.data.request.customer_id;
          getShippingAddressHander(
            id,
            response.data.headers.Authorization[0].split(" ")[1]
          );
          // getTaxesAndShippingHandler(token, identityToken,userID);
        }
      }
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Something went wrong.");
    }
  };

  /**
   * @description getting upsell products
  
   */

  const getUpSellHandler = async (identity: string) => {
    try {
      const ids: any = [];
      productsObj.forEach((product) => {
        if (product.id != null) {
          ids.push(product.id);
        }
      });
      if (ids.length == 0) return;
      const response = await orderService.getUpSellItems(ids, {
        headers: {
          "identity-token": identity,
          Authorization: `Bearer ${token}`,
        },
      });
      setUpSellProducts(response.data.slice(0, 2));
      setShowUpSellModal(true);
      // console.log("upSell", response);
    } catch (err) {
      setShowUpSellModal(false);
      // console.log("Something Went Wrong ", err);
    }
  };

  const addToCartHandler = (product: IUpSellResponse) => {
    const obj = {
      image: "",
      price: 0,
      id: 0,
    };

    if (product.product_info.price && product.product_info.price != null) {
      obj.image = product.product_info.image;
      obj.price = product.product_info.price!;
      obj.id = product.product_info.id;
    } else {
      obj.image = product.product_variants[0].featured_image;
      obj.price = product.product_variants[0].price;
      obj.id = product.product_variants[0].id;
    }
    const item: any = {
      id: obj.id,
      product_id: obj.id,
      // src: item.src,
      // sku: String(item.id),
      src: obj.image,
      sku: obj.id,
      name: product.product_info.title,
      type: "NA",
      quantity: 1,
      category: null,
      subcategory: "NA",
      description: "NA",
      color: "NA",
      size: "NA",
      brand: "NA",
      unit_price: Number(obj.price),
      amount: Number(obj.price) * 1,
      attributes: product.product_attributes,
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
    };
    setLineItems([item, ...lineItems]);

    updateStateHandler({
      payload: {
        totalAmount: totalAmount + Number(obj.price),
        productsObj: [item, ...productsObj],
      },
    });
  };

  const getBankListHandler = async () => {
    // try {
    //   const response = await orderService.getBankList({
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   updateStateHandler({
    //     payload: {
    //       banks: response.data ?? [],
    //     },
    //   });
    // } catch (err) {
    //   setShowUpSellModal(false);
    //   console.log("Something Went Wrong ", err);
    // }
  };

  /*const initUpliftHandler = () => {
    (window as any).Uplift.Payments.init({
      apiKey: "jXWeBrVxVW7Xx0L6NfV0R7r1HOUAW8QJ3hAN09rf",
      locale: "en-US",
      currency: "USD",
      checkout: true,
      channel: "desktop",
      container: "#uplift-container", //it will be covered later
      onChange: myOnChangeCallback, //it will be covered later
    });
  };*/

  /*useEffect(() => {
    console.log(
      "==================================================== UPLIFT: ",
      [
        {
          first_name: firstName, //firstName,
          last_name: lastName, //lastName,
          phone: localStorage.getItem("upliftPhoneNumber"),
          email: email,
          street_address: billingAddress,
          city: city,
          // region: "KY",
          country: country,
          postal_code: zipCode,
        },
      ]
    );
  }, []);*/

  const buildOrderInfo = () => {
    console.log("Selected Shipping: ", selectedShipping);

    if (
      billingAddress !== selectedShipping?.address_1 ||
      billingCity !== selectedShipping?.city ||
      selectedShipping?.zip !== billingZip ||
      selectedShipping?.country !== billingCountry
    ) {
      return {
        // billing_contact: {
        //   first_name: firstName, //firstName,
        //   last_name: lastName, //lastName,
        //   phone: intlNumber,
        //   email: email,
        //   street_address: billingAddress,
        //   city: city,
        //   // region: "KY",
        //   country: country,
        //   postal_code: zipCode,
        // },
        billing_contact: {
          first_name: firstName, //firstName,
          last_name: lastName, //lastName,
          phone: localStorage.getItem("upliftPhoneNumber"),
          email: email,
          street_address: billingAddress.trimStart(),
          city: billingCity, //TODO: update billing and shipping city and zip code
          postal_code: billingZip,
          country:
            billingCountry.toLocaleUpperCase() === "UNITED STATES"
              ? "US"
              : "PK",
        },
        //         str.substring(0, str.indexOf(' ')); // "72"
        // str.substring(str.indexOf(' ') + 1); // "tocirah sneab"
        shipping_contact: {
          email: email,
          street_address: address.trimStart(),
          city: selectedShipping?.city, //selectedAddress?.city,
          postal_code: selectedShipping?.zip,
          country:
            selectedShipping?.country.toLocaleUpperCase() === "UNITED STATES"
              ? "US"
              : "PK", //selectedAddress?.country,
          first_name: selectedShipping?.name.substring(
            0,
            selectedShipping?.name.indexOf(" ")
          ),
          last_name: selectedShipping?.name.substring(
            selectedShipping?.name.indexOf(" ") + 1
          ),
          phone:
            localStorage.getItem("defaultNumber") &&
            localStorage.getItem("defaultNumber"),
        },
        order_lines: productsObj?.map((product) => {
          return {
            name: product.title,
            sku: String(product.id),
            quantity: Number(product.quantity),
            unit_price: Number(totalAmount) * 100,
          };
        }),
        order_amount:
          (Number(totalAmount) +
            Number(shippingPrice) +
            Number(taxPrice) -
            Number(discountedAmount)) *
          100, //equivalent to $999.00 ⚠️ always use cents(integer)
      };
    } else {
      return {
        // billing_contact: {
        //   first_name: firstName, //firstName,
        //   last_name: lastName, //lastName,
        //   phone: intlNumber,
        //   email: email,
        //   street_address: billingAddress,
        //   city: city,
        //   // region: "KY",
        //   country: country,
        //   postal_code: zipCode,
        // },
        billing_contact: {
          first_name: firstName, //firstName,
          last_name: lastName, //lastName,
          phone: localStorage.getItem("upliftPhoneNumber"),
          email: email,
          street_address: billingAddress.trimStart(),
          city: encrypted?.billing_info?.city ?? city, //TODO: update billing and shipping city and zip code
          postal_code: encrypted?.billing_info?.zip ?? billingZip,
          country:
            billingCountry.toLocaleUpperCase() === "UNITED STATES"
              ? "US"
              : "PK",
        },
        order_lines: productsObj?.map((product) => {
          return {
            name: product.title,
            sku: String(product.id),
            quantity: Number(product.quantity),
            unit_price: Number(totalAmount) * 100,
          };
        }),
        order_amount:
          (Number(totalAmount) +
            Number(shippingPrice) +
            Number(taxPrice) -
            Number(discountedAmount)) *
          100, //equivalent to $999.00 ⚠️ always use cents(integer)
      };
    }
  };

  /*  const upliftPaymentMethodHandler = async () => {
    console.log("UPLIFT ORDER INFO: ", buildOrderInfo());
    let orderInfo = buildOrderInfo();
    await (window as any).Uplift.Payments.load(orderInfo);
    (window as any).Uplift.Payments.select();
  };*/

  function myOnChangeCallback(response: {
    status: "string"; //Current step in the Uplift application flow
    offer: "object"; //Details on estimated offer based on order details
    reasons: "array|null"; //OFFER_AVAILABLE: array of codes, OFFER_UNAVAILABLE: NULL
    token: "object|null"; //Uplift virtual card that the merchant can use to process payment
  }) {
    let statusHandlers: any = {
      OFFER_AVAILABLE: () => {
        console.log("inside OFFER_AVAILABLE");

        // STATUS: Uplift Pay Monthly Offer is available for this orderInfo
        // 1. show payment selectors
        // 2. show monthly pricing node in the selector
        // 3. hide "NOT AVAILABLE" node in the selector
        // 4. enable Pay Monthly selector
        // 5. disable Purchase/Book button
      },
      TOKEN_AVAILABLE: async () => {
        console.log("inside TOKEN_AVAILABLE");
        // STATUS: Uplift application has been completed and Uplift is ready to pay
        // 1. show payment selectors
        // 2. enable Pay Monthly selector
        // 3. enable Purchase/Book button
        // The virtual card should be retrieved when user clicks the Purchase/Book button
        // 4. retrieve the token ONLY AFTER Purchase/Book button is clicked
        // using: window.Uplift.Payments.getToken();
        setTokenAvailableButton(true);
        // const res = await (window as any).Uplift.Payments.getToken();
        // console.log("res", res);
      },
      TOKEN_RETRIEVED: () => {
        console.log("inside TOKEN_RETRIEVED");

        // STATUS: Token is available to be charged for payment
        // Uplift Payment Token successfully retrieved.
        // 1. utilize the retrieved token (virtual card) to pay in full by Uplift.
        var token: any = response.token;
        console.log("TOKEN: ", token);
        //console.log("token", token);
        if (token != null) {
          setCvc(token.card_ccv);
          setNumber(token.card_number);
          setExpiry(`${token.expiration_month}/${token.expiration_year}`);
          //setUpliftVirtualCardAvailable(true);
        }
        // process payment using token (uplift virtual card).
      },
      OFFER_UNAVAILABLE: () => {
        console.log("inside OFFER_UNAVAILABLE");
        // STATUS:  Pay monthly offer is unavailable for this orderInfo
        // 1. show payment selectors
        // 2. show "NOT AVAILABLE" node in the selector
        // 3. hide monthly pricing node in the selector
        // 4. disable Pay Monthly selector
        // 5. change payment option selection, if Pay Monthly option is selected
      },
      SERVICE_UNAVAILABLE: () => {
        console.log("inside SERVICE_UNAVAILABLE");
        // STATUS:  Uplift API is unavailable
        // 1. do not show payment selectors
      },
    };
    statusHandlers[response.status]();
  }

  // change
  /*
  useEffect(() => {
    if (upliftVirtualCardAvailable === true) {
      selectPaymentHandler();
    }
  }, [upliftVirtualCardAvailable]);*/

  const CheckRangeData = (data: any) => {
    let check = false;
    let totalCost =
      Number(totalAmount) + Number(taxPrice) - Number(discountedAmount);
    // console.log('TEST Data: ', data)

    data?.map((items: any) => {
      // console.log('TEST Lower Limit: ', Number(items.lower_limit))
      // console.log('TEST Upper Limit: ', Number(items.upper_limit))
      // console.log(
      //   'TEST Condition LOWER LIMIT: ',
      //   Number(totalCost) > Number(items.lower_limit) ? 'TRUE' : 'FALSE',
      // )
      // console.log(
      //   'TEST Condition UPPER LIMIT: ',

      //   Number(totalCost) <= Number(items.upper_limit) ? 'TRUE' : 'FALSE',
      // )
      if (
        Number(totalCost) > Number(items.lower_limit) &&
        Number(totalCost) <= Number(items.upper_limit)
      ) {
        // console.log('TEST Total Cost: ', totalCost)
        console.log("TEST IF CALLED: ", true);
        check = true;
      }
    });

    return check;
  };
  useEffect(() => {
    updateStateHandler({
      payload: {
        shippingPrice: shippingTax,
      },
    });
  }, []);
  const BigCommerceShippingMethods = (country: any) => {
    if (platForm_bigCommerce?.toLocaleUpperCase() === "BIGCOMMERCE") {
      console.log("Country => ", country);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("identity-token", ctxIdentiyToken);

      var raw = JSON.stringify({
        country: country.toLocaleUpperCase().toString(),
      });

      fetch(
        `${process.env.REACT_APP_ORDER_MS_API_KEY}/check_big_commerce_shipping_methods`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("BIG COMM", result.response);

          updateStateHandler({
            payload: {
              shippingDetails: result.response,
              // shippingPrice: result.response.settings.rate,
              // shippingName: result.response.name
            },
          });

          if (result.response !== null) {
            result.response.map((option: any) => {
              if (option?.enabled && option?.settings?.rate) {
                updateStateHandler({
                  payload: {
                    shippingPrice: option.settings.rate,
                    shippingName: option.name,
                  },
                });
              } else if (
                option?.enabled &&
                CheckRangeData(option.settings?.range) === true
              ) {
                option.settings?.range.map((item: any, index: any) => {
                  if (
                    Number(totalAmount) +
                      Number(taxPrice) -
                      Number(discountedAmount) >
                      item?.lower_limit &&
                    Number(totalAmount) +
                      Number(taxPrice) -
                      Number(discountedAmount) <=
                      item?.upper_limit
                  ) {
                    updateStateHandler({
                      payload: {
                        shippingPrice: item?.shipping_cost,
                        shippingName: option.name,
                      },
                    });
                  }
                });
              } else if (
                option?.enabled &&
                CheckRangeData(option.settings?.range) === false
              ) {
                updateStateHandler({
                  payload: {
                    shippingPrice: option.settings?.default_cost,
                    shippingName: option.name,
                  },
                });
              } else if (
                option?.enabled &&
                option.settings.carrier_options?.exclude_fixed_shipping_products
              ) {
                updateStateHandler({
                  payload: {
                    shippingPrice: 0,
                    shippingName: option.name,
                  },
                });
              }
            });
          } else if (result.response === null) {
            updateStateHandler({
              payload: {
                shippingPrice: 0,
                shippingName: "",
              },
            });
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  return {
    states: {
      showInstructionModal,
      activeInstructionSlide,
      onLoad,
      loadQisstPay,
      loadGooglePay,
      loadCOD,
      loadPaypal,
      loadCard,
      loadClover,
      loadCardPointe,
      loadEasyPaisa,
      loadVault,
      loadEasyPaisaDirect,
      loadSezzle,
      loadJazzCash,
      loadPayFast,
      loadForee,
      loadJazzCashC,
      loadDirectBank,
      loadSquare,
      encrypted,
      others,
      loadAlfalah,
      loadAlfa,
      loadUBL,
      sessionID,
      orderID,
      paymentAlfalah,
      showButton,
      hideGooglePay,
      loadKlarna,
      loadAffirm,
      merchantPackageId,
      activeMethod,
      cvc,
      cnic,
      jazzCashNumber,
      number,
      name,
      expiry,
      expiryValidated,
      phoneNumber,
      disable,
      epNumberValidation,
      newProcessingFee,
      error,
      qisstPay,
      userID,
      paymentLimitError,
      newRedirectURLAlfalah,
      googlePay,
      halfAmountToPay,
      processingFee,
      acceptTerms,
      loadOrder,
      lineItems,
      identityToken,
      newToken,
      openModal,
      snippet,
      setP_fee,
      wallet_Balance,
      packageSelected,
      loadQisstPayInThree,
      loadQisstPayInTwo,
      loadQisstPayInSix,
      shippingAddress,
      addressChanged,
      merchantAccounts,
      processingAmount,
      merchantEmail,
      merchantPhone,
      upSellProducts,
      showUpSellModal,
      loadNift,
      loadBrainTree,
      otpPage,
      //loadUplift,
      loadNab,
      loadBitPay,
      loadQisstPayInTwelveCC,
      loadQisstPayInSixCC,
      loadQisstPayInFourCC,
      loadQisstPayInThreeCC,
      loadPinWheel,
      merchantLogo,
      payFastToggle,
      merchantBusinessName,
      //upliftVirtualCardAvailable,
      loadAuthorizeDotNet,
      customerCard,
      toggleButton,
      customerCardId,
      customerCardNumber,
      cardSelect,
      codPackageID,
      payFastOrderID,
      payFastOrderNumber,
      cardPackageID,
      payFastPackageID,
      TokenAvailableButton,
      expiryYear,
      skyFlowCardID,
      skyFlowPinID,
    },
    setStates: {
      setShowInstructionModal,
      setActiveInstructionSlide,
      setEncrypted,
      setOthers,
      setLoadCOD,
      setHideGoogle,
      setLoadKlarna,
      setP_fee,
      setLoadAffirm,
      setLoadCard,
      setLoadClover,
      setLoadCardPointe,
      setLoadPayPal,
      setLoadQisstPay,
      setLoadQisstPayInFourCC,
      setNewProcessingFee,
      setLoadEasyPaisa,
      setLoadVault,
      setLoadSezzle,
      setProcessingAmount,
      setLoadJazzCash,
      setLoadPayFast,
      setPayFastToggle,
      setLoadAlfalah,
      setLoadAlfa,
      setLoadUBL,
      setSessionID,
      setNewRedirectURLAlfalah,
      setOrderID,
      setPayment,
      setShowButton,
      setLoadEasyPaisaDirect,
      setLoadForee,
      setWalletBalance,
      setLoadJazzCashC,
      setDirectBank,
      setLoadSquare,
      setMerchantPackageId,
      setActiveMethod,
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
      setQisstPay,
      setPaymentLimitError,
      setGooglePay,
      setHalfAmountToPay,
      setProcessingFee,
      setAcceptTerms,
      setLoadOrder,
      setNewToken,
      setOnLoad,
      setIdentityToken,
      setOpenModal,
      setLoadQisstPayInSix,
      setLoadQisstPayInThree,
      setLoadQisstPayInTwo,
      setPackageSelected,
      setAddressChanged,
      setShowUpSellModal,
      setLoadNift,
      setCodPackageID,
      setLoadBrainTree,
      //setLoadUplift,
      setLoadNab,
      setLoadBitPay,
      setLoadQisstPayInTwelveCC,
      setLoadPinWheel,
      //setUpliftVirtualCardAvailable,
      setLoadAuthorizeDotNet,
      setCustomerCard,
      setToggleButton,
      setCustomerCardId,
      setCustomerCardNumber,
      setCardSelect,
      setPayFastOrderID,
      setPayFastOrderNumber,
      setCardPackageID,
      setPayFastPackageID,
      setTokenAvailableButton,
      setExpiryYear,
      setSkyFlowCardID,
      setSkyFlowPinID,
    },
    handlers: {
      prevSlideHandler,
      nextSlideHandler,
      closeInstructionModalHandler,
      settingMerchantIdHandler,
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
      addToCartHandler,
      getBankListHandler,
      completeOrderHandler,
      niftPaymentCheckoutHandler,
      //initUpliftHandler,
      //upliftPaymentMethodHandler,
      BigCommerceShippingMethods,
    },
  };
};
