import { useContext, useEffect, useState } from "react";
import { Container, Modal, Col, Row, Form } from "react-bootstrap";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import "./cart.css";
import { post, get } from "axios";
import Loader from "react-loader-spinner";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext.ts";
import * as Sentry from "@sentry/react";
import CurrencyFormat from "react-currency-format";
import { percentageHelper } from "../../utils/helper";
import { getCurrencySymbol } from "../../utils/get-currency-symbol.helper";
// import "../../../styles/phoneScreen.css";
import usePaymentDetailHook from "../../hooks/custom/usePaymentDetail.tsx";
export default function Cart(props) {
  const {
    states: {
      tabPay4,
      tabPay6,
      threeAmount,
      lastThreeAmount,
      halfAmountToPay,
      p_fee,
      thirdInstallmentDate,
      secondInstallmentDate,
      sixthAmount,
      sixthInstallmentDate,
      secondHalfAmountToPay,
      fourthInstallmentDate,
      fifthInstallmentDate,
      lastSixthAmount,
      twelfthAmount,
      lastTwelfthAmount,
      seventhInstallmentDate,
      eighthInstallmentDate,
      ninthInstallmentDate,
      tenthInstallmentDate,
      eleventhInstallmentDate,
      twelfthInstallmentDate,
    },

    setStates: {},
    handlers: { updateAmountHandler },
  } = usePaymentDetailHook();
  const {
    state: {
      totalAmount,
      currency,
      shippingPrice,
      taxPrice,
      packageSelectedQP,
      processingFee,
      is4gives,
      MerchantUserId,
      user_type,
      rudderStackID,
      platform_fee,
      wordUrl,
      totalProccessingFee,
      customerId,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const urlParams = new URLSearchParams(wordUrl);
  const shippingTootal = urlParams.get("shipping_total");
  const wordTax = urlParams.get("tax");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadOrder, setLoadOrder] = useState(false);
  const [platform_check, setPlatform_check] = useState(false);
  const [lineItems, setLineItems] = useState([]);
  const {
    state: { isTez, meta, merchantWalletIsEnabled },
  } = useContext(CheckoutContext);
  var totalWordTaxNumber = parseInt(wordTax, 10);
  useEffect(() => {
    if (wordTax != 0) {
      updateStateHandler({
        payload: {
          taxPrice: wordTax,
        },
      });
    }
  }, [taxPrice]);

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

  let payIn3Amount = "";
  useEffect(() => {
    payIn3Amount =
      totalAmount / 3 + ((totalAmount / 100) * Number(processingFee)) / 3;
  }, []);
  useEffect(() => {
    getlineItems();
  }, [props.productsObj]);
  useEffect(() => {
    if (!is4gives) {
      const validPackageSelections = [
        "PAY_IN_2",
        "PAY_IN_3",
        "PAY_IN_4",
        "PAY_IN_4_CC",
        "PAY_IN_6",
        "PAY_IN_6_CC",
        "PAY_IN_12_CC",
      ];

      if (
        validPackageSelections.includes(packageSelectedQP) &&
        totalProccessingFee !== 0 &&
        totalProccessingFee !== ""
      ) {
        const updatedState = {
          payload: {
            platform_fee: (totalProccessingFee / 100) * totalAmount,
            // shippingPrice: shippingTootal,
          },
        };
        updateStateHandler(updatedState);
        setPlatform_check(true);
      }
    } else {
      const validPackageSelections = [
        "PAY_IN_2",
        "PAY_IN_3",
        "PAY_IN_4",
        "PAY_IN_4_CC",
        "PAY_IN_6",
        "PAY_IN_6_CC",
        "PAY_IN_12_CC",
      ];

      if (
        validPackageSelections.includes(packageSelectedQP) &&
        totalProccessingFee !== 0 &&
        totalProccessingFee !== ""
      ) {
        const updatedState = {
          payload: {
            // shippingPrice: shippingTootal,
            platform_fee:
              (totalAmount + shippingTootal) * (totalProccessingFee / 100),
          },
        };
        updateStateHandler(updatedState);
        setPlatform_check(true);
      }
    }
  }, [
    totalProccessingFee,
    platform_fee,
    is4gives,
    packageSelectedQP,
    shippingTootal,
    totalAmount,
  ]);
  const getlineItems = async () => {
    let lineItem = [];
    let lineItemForApi = [];
    let lineItemForEvent = [];
    let ids = [];
    await props.productsObj?.map((item) => {
      // console.log("ITEM");
      // console.log(item);
      // const decodedName = decodeURIComponent(item.title);
      // const decodedSrc = decodeURIComponent(item.src);
      lineItem.push({
        id: String(item.product_id ? item.product_id : item.id),
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
      lineItemForEvent.push({
        product_id: String(item.product_id ? item.product_id : item.id),
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
          weight: item.weight,
          unit: item.unit,
          dimensions: {
            height: "NA",
            width: "NA",
            length: "NA",
          },
        },
      });
      lineItemForApi.push({
        productID: Number(item.product_id ? item.product_id : item.id),
        productQuantity: Number(item.quantity),
        amount:
          isTez == 0
            ? Number(item.price)
            : Number(item.price) * Number(item.quantity),
        weight: item.weight ? item.weight / 1000 : 0,
        unit: "kg",
      });
    });
    updateStateHandler({
      payload: {
        line_items: lineItemForApi,
        line_items_event: lineItemForEvent,
      },
    });
    setLineItems(lineItem);
  };
  const calculateTotalAmount = () => {
    const urlParams = new URLSearchParams(wordUrl);
    const shippingTotal = urlParams.get("shipping_total");
    console.log();
    return meta == ""
      ? Number(props.totalAmount) +
          Number(props.taxPrice) +
          Number(
            shippingTotal == 0 || shippingTotal == ""
              ? props.shippingPrice
              : shippingTotal
          ) -
          Number(props.discountedAmount) +
          +Number(platform_fee)
      : Number(props.totalAmount) +
          Number(platform_fee).toFixed(2) +
          Number(
            200 + Number(percentageHelper(2.6, Number(props.totalAmount)))
          ) -
          Number(props.discountedAmount);
  };
  const dividedAmount = calculateTotalAmount() - platform_fee;
  const itemCartClicked = () => {
    if (loadOrder) {
      global.rudderanalytics?.track(
        "cart_closed",
        {},
        {
          time_stamp: time_stamp,
          user_type: user_type,
          user_id: customerId,
          merchant_id: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
    } else {
      global.rudderanalytics?.track(
        "cart_opened",
        {},
        {
          time_stamp: time_stamp,
          user_type: user_type,
          user_id: customerId,
          merchant_id: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
    }
    setLoadOrder(!loadOrder);
  };
  return (
    <div className="input-container-no-m mt-10 mb-50  no-border-radius  pointer">
      <div className="drop-container pointer">
        <div className="  align-center">
          {/* <div className="drop-heading-container w-100"> */}
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
                onClick={(e) => {
                  // window.location.href = "/order/review" + query;
                  itemCartClicked();
                }}
                className={`${!loadOrder ? "loadLoader-arrow" : null}`}
                style={{ cursor: "pointer" }}
                src="/assets/arrow.svg"
                width="24px"
                height="24px"
              ></img>
            </Col>
          </Row>

          {/* </div> */}
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
                        src={item.src}
                      ></img>
                    </Col>
                    <Col
                      className="flex align-center quantity-price-con"
                      xs={8}
                      md={8}
                      lg={8}
                    >
                      <div className="w-100">
                        <p className="item-text">{item.name}</p>
                        <p
                          style={{ textAlign: "end" }}
                          className="text-14 price-text price-con"
                        >
                          {/* {item.unit_price} */}
                          <CurrencyFormat
                            value={
                              props.currency === "PKR"
                                ? isNaN(Number(item.unit_price))
                                  ? Number(props.totalAmount).toFixed(2)
                                  : Number(item.unit_price).toFixed(2)
                                : isNaN(Number(item.unit_price).toFixed(2))
                                ? Number(props.totalAmount).toFixed(2)
                                : Number(item.unit_price).toFixed(2)
                            }
                            displayType={"text"}
                            thousandSeparator={true}
                            suffix={
                              props.currency === "PKR"
                                ? ""
                                : Number.isInteger(calculateTotalAmount()) ===
                                  true
                                ? ".00"
                                : ""
                            }
                            prefix={
                              props.currency === "PKR"
                                ? getCurrencySymbol(props.currency) + " "
                                : getCurrencySymbol(props.currency)
                            }
                          />
                        </p>

                        <div className="mt-10">
                          <p className="item-text">QTY: {item.quantity}</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
            </Row>
          </div>
        )}
        {packageSelectedQP == "PAY_IN_2" ||
        packageSelectedQP == "PAY_IN_3" ||
        packageSelectedQP == "PAY_IN_4" ||
        packageSelectedQP == "PAY_IN_4_CC" ||
        packageSelectedQP == "PAY_IN_6" ||
        packageSelectedQP == "PAY_IN_6_CC" ||
        packageSelectedQP == "PAY_IN_12_CC" ? (
          <>
            <Row className="mt-30">
              <Col className="align-self-center" xs={10} lg={10} md={10}>
                <p className="item-cart">PAYMENT SCHEDULE</p>
              </Col>
              <Col
                className="align-self-center"
                style={{ textAlign: "end" }}
                xs={2}
                lg={2}
                md={2}
              ></Col>
            </Row>
            <div className="center-box">
              <div className="mt-10 mb-20">
                {/* {props.paymentType == "BOTH" && (
                <div className="tabs-container mt-30">
                  <div  
                    onClick={(e) => {
                      setTabPay4(true);
                      setTabPay6(false);
                      settingmerchandID("PAY_IN_4");
                    }}
                    className={
                      tabPay4
                        ? "tab tab-active center-box"
                        : "tab pointer center-box"
                    }
                  >
                    <p className="center-text tab-text font-medium">Pay In 4</p>
                    <p className="center-text text-12 font-light">
                      Debit/Credit Card
                    </p>
                  </div>

                  <div
                    onClick={(e) => {
                      setTabPay6(!tabPay6); 
                      setTabPay4(false);
                      settingmerchandID("SPLIT_PAY");
                    }}
                    className={tabPay6 ? "tab tab-active" : "tab pointer"}
                  >
                    <p className="center-text tab-text font-medium">Pay In 6</p>
                    <p className="center-text text-12 font-light">
                      Credit Card Only
                    </p>
                  </div>
                </div>
              )}
              {props.paymentType != "BOTH" && (
                <div className="tabs-container mt-30">
                  <div className={"tab tab-active  w-100"}>
                    <p className="center-text tab-text font-medium">
                      {props.selectedPaymentPackage == "PAY_IN_4"
                        ? "PAY IN 4"
                        : "PAY IN 4"}
                    </p>
                    <p className="center-text text-12 font-light">
                      {props.selectedPaymentPackage == "PAY_IN_4"
                        ? "Debit/Credit Card"
                        : "Debit/Credit Card"}
                    </p>
                  </div>
                </div>
              )} */}
                {packageSelectedQP == "PAY_IN_2" && (
                  <>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-2.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">First Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {(dividedAmount / 2 + platform_fee).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex w-100">
                        <div className="align-self-center">
                          <img src="/assets/circle-4.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Second Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency} {(dividedAmount / 2).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {secondInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {packageSelectedQP == "PAY_IN_3" && (
                  <>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img
                            style={{ width: "70%" }}
                            src="/assets/circle1-3.svg"
                          ></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">First Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {(dividedAmount / 3 + platform_fee).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex w-100">
                        <div className="align-self-center">
                          <img
                            style={{ width: "70%" }}
                            src="/assets/circle2-3.svg"
                          ></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Second Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency} {(dividedAmount / 3).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {secondInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img
                            style={{ width: "70%" }}
                            src="/assets/circle3-3.svg"
                          ></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Final Payment</p>
                            <p className="text-16 font-medium">
                              {currency} {(dividedAmount / 3).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {thirdInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {packageSelectedQP == "PAY_IN_4" && (
                  <>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-1.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">First Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {(dividedAmount / 4 + platform_fee).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex w-100">
                        <div className="align-self-center">
                          <img src="/assets/circle-2.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Second Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency} {(dividedAmount / 4).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {secondInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-3.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Third Payment</p>
                            <p className="text-16 font-medium">
                              {currency} {(dividedAmount / 4).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {thirdInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-4.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">Final Payment</p>
                            <p className="text-16 font-medium">
                              {currency} {(dividedAmount / 4).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {fourthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {packageSelectedQP == "PAY_IN_4_CC" && (
                  <>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-1.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">First Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(halfAmountToPay).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex w-100">
                        <div className="align-self-center">
                          <img src="/assets/circle-2.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Second Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(halfAmountToPay).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {secondInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-3.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Third Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(halfAmountToPay).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {thirdInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-4.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">Final Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(secondHalfAmountToPay).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {fourthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {(packageSelectedQP == "PAY_IN_6" ||
                  packageSelectedQP == "PAY_IN_6_CC") && (
                  <>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-1.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">First Payment</p>
                            <p className="text-16 font-medium">
                              {currency} {Number(sixthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-1.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Second Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency} {Number(sixthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {secondInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-1.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">Third Payment</p>
                            <p className="text-16 font-medium">
                              {currency} {Number(sixthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {thirdInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="payment-container mt-20">
                      <div className="payment-card flex w-100">
                        <div className="align-self-center">
                          <img src="/assets/circle-2.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Fourth Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency} {Number(sixthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {fourthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-3.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Fifth Payment</p>
                            <p className="text-16 font-medium">
                              {currency} {Number(sixthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {fifthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle-4.png"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">Final Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(lastSixthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {sixthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {packageSelectedQP == "PAY_IN_12_CC" && (
                  <>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle01.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">First Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle02.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Second Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {secondInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-30">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle03.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">Third Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {thirdInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="payment-container mt-20">
                      <div className="payment-card flex w-100">
                        <div className="align-self-center">
                          <img src="/assets/circle04.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">
                              Fourth Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {fourthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle05.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Fifth Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {fifthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle06.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Sixth Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {sixthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle07.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">
                              Seventh Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {seventhInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle08.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Eighth Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {eighthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle09.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Ninth Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {ninthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle10.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">Tenth Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {tenthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle11.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-1 font-medium">
                              Eleventh Payment
                            </p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(twelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {eleventhInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="payment-container mt-20">
                      <div className="payment-card flex">
                        <div className="align-self-center">
                          <img src="/assets/circle12.svg"></img>
                        </div>
                        <div className="payment-detail pl-20 w-100">
                          <div className="flex space-btw">
                            <p className="text-16 font-medium">Final Payment</p>
                            <p className="text-16 font-medium">
                              {currency}{" "}
                              {Number(lastTwelfthAmount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-16 text-grey font-regular">
                              {twelfthInstallmentDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : null}
        <hr />
        <Row>
          <Col md={8} lg={8} xs={6}>
            <p className="order-text2 mt-05">Sub Total</p>
          </Col>
          <Col md={4} lg={4} xs={6}>
            <p className="order-text2 order-text-total text-end bold">
              <CurrencyFormat
                value={
                  props.currency === "PKR"
                    ? Number(props.totalAmount).toFixed(2)
                    : Number(props.totalAmount).toFixed(2)
                }
                displayType={"text"}
                thousandSeparator={true}
                suffix={
                  props.currency === "PKR"
                    ? ""
                    : Number.isInteger(calculateTotalAmount()) === true
                    ? ".00"
                    : ""
                }
                prefix={
                  props.currency === "PKR"
                    ? getCurrencySymbol(props.currency) + " "
                    : getCurrencySymbol(props.currency)
                }
              />
            </p>
          </Col>
          {meta == "" || isTez == 0 ? (
            <>
              {props.shippingPrice != 0 || shippingTootal != 0 ? (
                <>
                  <Col md={8} lg={8} xs={6}>
                    <p className="order-text2 mt-05">Shipping</p>
                  </Col>
                  <Col md={4} lg={4} xs={6}>
                    <p className="order-text2 order-text-total mt-05 text-end bold">
                      {/* {currency}
                        {shippingPrice} */}
                      <CurrencyFormat
                        value={
                          props.currency === "PKR"
                            ? Number(
                                shippingTootal == 0
                                  ? shippingPrice
                                  : shippingTootal
                              ).toFixed(2)
                            : Number(
                                shippingTootal == 0
                                  ? shippingPrice
                                  : shippingTootal
                              ).toFixed(2)
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={
                          props.currency === "PKR"
                            ? ""
                            : Number.isInteger(calculateTotalAmount()) === true
                            ? ".00"
                            : ""
                        }
                        prefix={
                          props.currency === "PKR"
                            ? getCurrencySymbol(props.currency) + " "
                            : getCurrencySymbol(props.currency)
                        }
                      />
                    </p>
                  </Col>
                </>
              ) : null}
              {Number(props.taxPrice) == 0 ? (
                taxPrice ? (
                  <>
                    <Col md={8} lg={8} xs={6}>
                      <p className="order-text2 mt-05">Tax</p>
                    </Col>
                    <Col md={4} lg={4} xs={6}>
                      <p className="order-text2 order-text-total mt-05 text-end bold">
                        <CurrencyFormat
                          value={
                            props.currency === "PKR"
                              ? Number(taxPrice).toFixed(2)
                              : Number(taxPrice).toFixed(2)
                          }
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={
                            props.currency === "PKR"
                              ? ""
                              : Number.isInteger(calculateTotalAmount()) ===
                                true
                              ? ".00"
                              : ""
                          }
                          prefix={
                            props.currency === "PKR"
                              ? getCurrencySymbol(props.currency) + " "
                              : getCurrencySymbol(props.currency)
                          }
                        />
                      </p>
                    </Col>
                  </>
                ) : null
              ) : (
                <>
                  <Col md={8} lg={8} xs={6}>
                    <p className="order-text2 mt-05">Tax</p>
                  </Col>
                  <Col md={4} lg={4} xs={6}>
                    <p className="order-text2 order-text-total mt-05 text-end bold">
                      <CurrencyFormat
                        value={
                          props.currency === "PKR"
                            ? Number(props.taxPrice).toFixed(2)
                            : Number(props.taxPrice).toFixed(2)
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={
                          props.currency === "PKR"
                            ? ""
                            : Number.isInteger(calculateTotalAmount()) === true
                            ? ".00"
                            : ""
                        }
                        prefix={
                          props.currency === "PKR"
                            ? getCurrencySymbol(props.currency) + " "
                            : getCurrencySymbol(props.currency)
                        }
                      />
                    </p>
                  </Col>
                </>
              )}

              {!platform_check ? null : (
                <>
                  <Col md={8} lg={8} xs={6}>
                    <p className="order-text2 mt-05">Platform Fee</p>
                  </Col>
                  <Col md={4} lg={4} xs={6}>
                    <p className="order-text2 order-text-total mt-05 text-end bold">
                      {props.currency === "PKR" ? (
                        <CurrencyFormat
                          value={Number(platform_fee).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={getCurrencySymbol(props.currency) + " "}
                        />
                      ) : (
                        <CurrencyFormat
                          value={Number(platform_fee).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={
                            Number.isInteger(Number(platform_fee)) === true
                              ? ".00"
                              : ""
                          }
                          prefix={getCurrencySymbol(props.currency)}
                        />
                      )}
                    </p>
                  </Col>
                </>
              )}
            </>
          ) : (
            <>
              <Col md={8} lg={8} xs={6}>
                <p className="order-text2 mt-05">Service Charges</p>
              </Col>
              <Col md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-total mt-05 text-end bold">
                  <CurrencyFormat
                    value={
                      props.currency === "PKR"
                        ? Number(
                            200 +
                              Number(
                                percentageHelper(2.6, Number(props.totalAmount))
                              ).toFixed(2)
                          )
                        : Number(
                            200 +
                              Number(
                                percentageHelper(2.6, Number(props.totalAmount))
                              )
                          ).toFixed(2)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={
                      props.currency === "PKR"
                        ? ""
                        : Number.isInteger(calculateTotalAmount()) === true
                        ? ".00"
                        : ""
                    }
                    prefix={
                      props.currency === "PKR"
                        ? getCurrencySymbol(props.currency) + " "
                        : getCurrencySymbol(props.currency)
                    }
                  />
                </p>
              </Col>
            </>
          )}

          <Col md={8} lg={8} xs={6}>
            <p className="order-text2 mt-05">Discount</p>
          </Col>
          <Col md={4} lg={4} xs={6}>
            <p className="order-text2 order-text-total mt-05 text-end bold">
              <CurrencyFormat
                value={
                  props.currency === "PKR"
                    ? Number(props.discountedAmount).toFixed(2)
                    : Number(props.discountedAmount).toFixed(2)
                }
                displayType={"text"}
                thousandSeparator={true}
                suffix={
                  props.currency === "PKR"
                    ? ""
                    : Number.isInteger(calculateTotalAmount()) === true
                    ? ".00"
                    : ""
                }
                prefix={
                  props.currency === "PKR"
                    ? getCurrencySymbol(props.currency) + " "
                    : getCurrencySymbol(props.currency)
                }
              />
            </p>
          </Col>

          {Number(props.vaultPoints) != 0 &&
          Number(props.vaultPoints) <
            calculateTotalAmount() + Number(props.processingFee) ? (
            <>
              <Col md={8} lg={8} xs={6}>
                <p className="order-text2 mt-05">Vault Points</p>
              </Col>
              <Col md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-total mt-05 text-end bold">
                  <CurrencyFormat
                    value={
                      props.currency === "PKR"
                        ? Math.round(Number(props.vaultPoints))
                        : Math.round(Number(props.vaultPoints))
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={
                      props.currency === "PKR" && ""
                      // : Number.isInteger(calculateTotalAmount()) === true
                      // ? '.00'
                      // : ''
                    }
                    prefix={
                      props.currency === "PKR"
                        ? "- " + getCurrencySymbol(props.currency) + " "
                        : "- " + getCurrencySymbol(props.currency)
                    }
                  />
                </p>
              </Col>
            </>
          ) : (
            ""
          )}

          {Number(props.vaultPoints) != 0 &&
          Number(props.vaultPoints) >
            calculateTotalAmount() + Number(props.processingFee) ? (
            <>
              <Col md={8} lg={8} xs={6}>
                <p className="order-text2 mt-05">Points Deducted</p>
              </Col>
              <Col md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-total mt-05 text-end bold">
                  <CurrencyFormat
                    value={
                      props.currency === "PKR"
                        ? calculateTotalAmount().toFixed(2)
                        : calculateTotalAmount().toFixed(2)
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={
                      props.currency === "PKR"
                        ? ""
                        : Number.isInteger(calculateTotalAmount()) === true
                        ? ".00"
                        : ""
                    }
                    prefix={
                      props.currency === "PKR"
                        ? "-" + " " + getCurrencySymbol(props.currency) + " "
                        : "-" + " " + getCurrencySymbol(props.currency)
                    }
                  />
                </p>
              </Col>
            </>
          ) : (
            ""
          )}

          <hr className="mt-20" />

          {merchantWalletIsEnabled === true &&
          Number(props.vaultPoints) <
            calculateTotalAmount() + Number(props.processingFee) ? (
            <>
              <Col md={8} lg={8} xs={6}>
                <p className="order-text2 order-text-total-text mt-05">Total</p>
              </Col>
              <Col md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-final-total mt-05 text-end bold">
                  {/*FOR PK*/}
                  {/* {props.countryCode.toString()} */}
                  {/* {props.currency.toString()} */}
                  {props.currency === "PKR" ? (
                    <CurrencyFormat
                      value={
                        props.processingFee
                          ? calculateTotalAmount()
                              // +
                              // Number(platform_fee)
                              .toFixed(2) - Number(props.vaultPoints).toFixed(2)
                          : (
                              calculateTotalAmount() - Number(props.vaultPoints)
                            ).toFixed(2)
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={getCurrencySymbol(props.currency) + " "}
                    />
                  ) : (
                    <>
                      <CurrencyFormat
                        value={
                          props.processingFee
                            ? (
                                calculateTotalAmount() + Number(platform_fee)
                              ).toFixed(2) -
                              Number(props.vaultPoints).toFixed(2)
                            : (
                                calculateTotalAmount() -
                                Number(props.vaultPoints)
                              ).toFixed(2)
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={
                          Number.isInteger(
                            calculateTotalAmount() + Number(platform_fee)
                          ) === true
                            ? ".00"
                            : ""
                        }
                        prefix={getCurrencySymbol(props.currency)}
                      />
                    </>
                  )}

                  {/* <CurrencyFormat
                value={
                  props.processingFee !== "" ||
                  props.processingFee !== undefined ||
                  props.processingFee !== null
                    ? props.countryCode === "pk" ||
                      props.countryCode === "92" ||
                      props.currency === "PKR"
                      ? calculateTotalAmount() + props.processingFee
                      : calculateTotalAmount().toFixed(2) + props.processingFee
                    : props.countryCode === "pk" ||
                      props.countryCode === "92" ||
                      props.currency === "PKR"
                    ? calculateTotalAmount()
                    : calculateTotalAmount().toFixed(2)
                }
                displayType={"text"}
                thousandSeparator={true}
                // suffix={props.countryCode == 'us' ? '.00' : ''}
                suffix={
                  props.countryCode === "pk" ||
                  props.countryCode === "92" ||
                  props.currency === "PKR"
                    ? ""
                    : Number.isInteger(calculateTotalAmount()) === true
                    ? ".00"
                    : ""
                }
                prefix={
                  props.countryCode == "pk" ||
                  props.countryCode == "92" ||
                  props.currency == "PKR"
                    ? getCurrencySymbol(props.currency) + " "
                    : getCurrencySymbol(props.currency)
                }
              /> */}
                </p>
              </Col>
            </>
          ) : merchantWalletIsEnabled === true &&
            Number(props.vaultPoints) >
              calculateTotalAmount() + Number(props.processingFee) ? (
            <>
              <Col md={8} lg={8} xs={6}>
                <p className="order-text2 order-text-total-text mt-05">Total</p>
              </Col>
              <Col md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-final-total mt-05 text-end bold">
                  {/*FOR PK*/}
                  {/* {props.countryCode.toString()} */}
                  {/* {props.currency.toString()} */}
                  {props.currency === "PKR" ? (
                    <CurrencyFormat
                      value={0}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={getCurrencySymbol(props.currency) + " "}
                    />
                  ) : (
                    <>
                      <CurrencyFormat
                        value={0}
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={
                          Number.isInteger(
                            calculateTotalAmount()
                            // + Number(props.processingFee)
                          ) === true
                            ? ".00"
                            : ""
                        }
                        prefix={getCurrencySymbol(props.currency)}
                      />
                    </>
                  )}

                  {/* <CurrencyFormat
                  value={
                    props.processingFee !== "" ||
                    props.processingFee !== undefined ||
                    props.processingFee !== null
                      ? props.countryCode === "pk" ||
                        props.countryCode === "92" ||
                        props.currency === "PKR"
                        ? calculateTotalAmount() + props.processingFee
                        : calculateTotalAmount().toFixed(2) + props.processingFee
                      : props.countryCode === "pk" ||
                        props.countryCode === "92" ||
                        props.currency === "PKR"
                      ? calculateTotalAmount()
                      : calculateTotalAmount().toFixed(2)
                  }
                  displayType={"text"}
                  thousandSeparator={true}
                  // suffix={props.countryCode == 'us' ? '.00' : ''}
                  suffix={
                    props.countryCode === "pk" ||
                    props.countryCode === "92" ||
                    props.currency === "PKR"
                      ? ""
                      : Number.isInteger(calculateTotalAmount()) === true
                      ? ".00"
                      : ""
                  }
                  prefix={
                    props.countryCode == "pk" ||
                    props.countryCode == "92" ||
                    props.currency == "PKR"
                      ? getCurrencySymbol(props.currency) + " "
                      : getCurrencySymbol(props.currency)
                  }
                /> */}
                </p>
              </Col>
            </>
          ) : (
            <>
              <Col md={8} lg={8} xs={6}>
                <p className="order-text2 order-text-total-text mt-05">Total</p>
              </Col>
              <Col md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-final-total mt-05 text-end bold">
                  {/*FOR PK*/}
                  {/* {props.countryCode.toString()} */}
                  {/* {props.currency.toString()} */}
                  {props.currency === "PKR" ? (
                    <CurrencyFormat
                      value={
                        props.processingFee
                          ? calculateTotalAmount()
                              // +
                              // Number(platform_fee)
                              .toFixed(2)
                          : calculateTotalAmount().toFixed(2)
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={getCurrencySymbol(props.currency) + " "}
                    />
                  ) : (
                    <CurrencyFormat
                      value={
                        props.processingFee
                          ? (
                              calculateTotalAmount() +
                              Number(props.processingFee)
                            ).toFixed(2)
                          : calculateTotalAmount().toFixed(2)
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={
                        Number.isInteger(
                          calculateTotalAmount() + Number(props.processingFee)
                        ) === true
                          ? ".00"
                          : ""
                      }
                      prefix={getCurrencySymbol(props.currency)}
                    />
                  )}

                  {/* <CurrencyFormat
                value={
                  props.processingFee !== "" ||
                  props.processingFee !== undefined ||
                  props.processingFee !== null
                    ? props.countryCode === "pk" ||
                      props.countryCode === "92" ||
                      props.currency === "PKR"
                      ? calculateTotalAmount() + props.processingFee
                      : calculateTotalAmount().toFixed(2) + props.processingFee
                    : props.countryCode === "pk" ||
                      props.countryCode === "92" ||
                      props.currency === "PKR"
                    ? calculateTotalAmount()
                    : calculateTotalAmount().toFixed(2)
                }
                displayType={"text"}
                thousandSeparator={true}
                // suffix={props.countryCode == 'us' ? '.00' : ''}
                suffix={
                  props.countryCode === "pk" ||
                  props.countryCode === "92" ||
                  props.currency === "PKR"
                    ? ""
                    : Number.isInteger(calculateTotalAmount()) === true
                    ? ".00"
                    : ""
                }
                prefix={
                  props.countryCode == "pk" ||
                  props.countryCode == "92" ||
                  props.currency == "PKR"
                    ? getCurrencySymbol(props.currency) + " "
                    : getCurrencySymbol(props.currency)
                }
              /> */}
                </p>
              </Col>
            </>
          )}

          {/* {Number(props.vaultPoints) >
          calculateTotalAmount() + Number(props.processingFee) ? (
            <>
              <Col className="mt-1" md={8} lg={8} xs={6}>
                <p className="order-text2 order-text-total-text mt-05">
                  Remaining Vault Balance
                </p>
              </Col>
              <Col className="mt-1" md={4} lg={4} xs={6}>
                <p className="order-text2 order-text-final-total mt-05 text-end bold">
                 
                  {props.currency === 'PKR' ? (
                    <CurrencyFormat
                      value={
                        props.processingFee
                          ? Number(props.vaultPoints) -
                            calculateTotalAmount() +
                            props.processingFee
                          : Number(props.vaultPoints) - calculateTotalAmount()
                      }
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={getCurrencySymbol(props.currency) + ' '}
                    />
                  ) : (
                    <CurrencyFormat
                      value={
                        props.processingFee
                          ? Number(props.vaultPoints) -
                            calculateTotalAmount().toFixed(2) +
                            props.processingFee
                          : Number(props.vaultPoints) -
                            calculateTotalAmount().toFixed(2)
                      }
                      displayType={'text'}
                      thousandSeparator={true}
                      suffix={
                        Number.isInteger(calculateTotalAmount()) === true
                          ? '.00'
                          : ''
                      }
                      prefix={getCurrencySymbol(props.currency)}
                    />
                  )}
                </p>
              </Col>
            </>
          ) : (
            ''
          )} */}
        </Row>
      </div>
    </div>
  );
}
