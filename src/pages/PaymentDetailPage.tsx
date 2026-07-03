import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import usePaymentDetailHook from "../hooks/custom/usePaymentDetail";
import { usePaymentSelectionHook } from "../hooks/custom/usePaymentSelection";
import { routes } from "../router/routes";

const PaymentDetailPage: React.FC = () => {
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
      isTez,
      processingFee,
      is4gives,
      walletBalance,
      discountedAmount,
      walletToggleButtonCheck,
      customerId,
      MerchantUserId,
      rudderStackID,
      user_type,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const history = useHistory();

  useEffect(() => {
    (global as any).rudderanalytics?.track(
      "installment_plan_open",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
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

  let payIn3Amount: string | number;
  useEffect(() => {
    payIn3Amount =
      totalAmount / 3 + ((totalAmount / 100) * Number(processingFee)) / 3;
  }, []);

  // useEffect(() => {
  //   // @ts-ignore:next-line
  //   // nid('stateChange', 'payment-detail');
  // }, [])
  function backButtonClicked() {
    (global as any).rudderanalytics?.track(
      "back_button_click_installment",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    history.replace(routes.paymentSelectionPage);
  }
  return (
    <div className="center-box">
      <div
        onClick={() => backButtonClicked()}
        className="flex align-center pt-20 pl-20 m-0"
      >
        <img src="/assets/backbtn.svg"></img>
        <h3 className="topHeading no-padding-top">Select Payment Method</h3>
      </div>
      <div className="flex-box">
        <div className="checkout-container bg-checkout relative overflow-scroll h-100vh">
          {!is4gives &&
            (isTez != 0 ? (
              <div className="logo-container">
                <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
              </div>
            ) : (
              <div className="logo-container">
                <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
              </div>
            ))}

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

          <div className="input-container mt-30">
            <div className="drop-container">
              <p className="text-16 ">PAYMENT SCHEDULE</p>
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
                            {(
                              (totalAmount +
                                Number(shippingPrice) +
                                Number(taxPrice) +
                                (totalAmount / 100) * Number(processingFee) -
                                (walletToggleButtonCheck === "TRUE"
                                  ? Number(walletBalance)
                                  : 0) -
                                discountedAmount) /
                              2
                            ).toFixed(2)}
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
                          <p className="text-16 font-medium">Second Payment</p>
                          <p className="text-16 font-medium">
                            {currency}{" "}
                            {(
                              (totalAmount +
                                Number(shippingPrice) +
                                Number(taxPrice) +
                                (totalAmount / 100) * Number(processingFee) -
                                (walletToggleButtonCheck === "TRUE"
                                  ? Number(walletBalance)
                                  : 0) -
                                discountedAmount) /
                              2
                            ).toFixed(2)}
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
                            {(
                              (totalAmount +
                                Number(shippingPrice) +
                                Number(taxPrice) +
                                (totalAmount / 100) * Number(processingFee) -
                                (walletToggleButtonCheck === "TRUE"
                                  ? Number(walletBalance)
                                  : 0) -
                                discountedAmount) /
                              3
                            ).toFixed(2)}
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
                          <p className="text-16 font-medium">Second Payment</p>
                          <p className="text-16 font-medium">
                            {currency}{" "}
                            {(
                              (totalAmount +
                                Number(shippingPrice) +
                                Number(taxPrice) +
                                (totalAmount / 100) * Number(processingFee) -
                                (walletToggleButtonCheck === "TRUE"
                                  ? Number(walletBalance)
                                  : 0) -
                                discountedAmount) /
                              3
                            ).toFixed(2)}
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
                            {currency}{" "}
                            {(
                              (totalAmount +
                                Number(shippingPrice) +
                                Number(taxPrice) +
                                (totalAmount / 100) * Number(processingFee) -
                                (walletToggleButtonCheck === "TRUE"
                                  ? Number(walletBalance)
                                  : 0) -
                                discountedAmount) /
                              3
                            ).toFixed(2)}
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
                          <p className="text-16 font-medium">Second Payment</p>
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
                          <p className="text-16 font-medium">Second Payment</p>
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
                          <p className="text-16 font-medium">Second Payment</p>
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
                          <p className="text-16 font-medium">Fourth Payment</p>
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                          <p className="text-16 font-medium">Second Payment</p>
                          <p className="text-16 font-medium">
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                          <p className="text-16 font-medium">Fourth Payment</p>
                          <p className="text-16 font-medium">
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                          <p className="text-1 font-medium">Seventh Payment</p>
                          <p className="text-16 font-medium">
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                            {currency} {Number(twelfthAmount).toLocaleString()}
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
                          <p className="text-1 font-medium">Eleventh Payment</p>
                          <p className="text-16 font-medium">
                            {currency} {Number(twelfthAmount).toLocaleString()}
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

          <div className="btn-container mt-20 mb-20">
            <button
              onClick={(e) => history.replace(routes.paymentSelectionPage)}
              type="button"
              className="basic-btn"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
