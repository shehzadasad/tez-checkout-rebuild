import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { usePaymentSuccessHook } from "../hooks/custom/usePaymentSuccuess";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";
import CurrencyFormat from "react-currency-format";
import { stubTrue } from "lodash";
import "../styles/success.css";
import "../styles/checkout.css";
import { generalServiceTwo } from "../services/generalTwo.service";
import { facebookEvents } from "../services/facebookEvents.service";
import { getCurrencySymbol } from "../utils/get-currency-symbol.helper";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { useLocation } from "react-router-dom";
import { GAMessages } from "../enums/GA-messages";

const PaymentSuccessPage: React.FC = () => {
  const [fourGiveLoader, setFourGiveLoader] = useState(true);

  const {
    states: {
      loadShipping,
      disable,
      query,
      encrypted,
      paymentMethod,
      transactionID,
    },
    setStates: {
      setQueryString,
      setLoadShipping,
      setTransactionID,
      setTrackingId,
    },
    handlers: {
      requestOrderHandler,
      EasyPaisaTimerHandler,
      getOrderDetailHandler,
    },
  } = usePaymentSuccessHook();

  const {
    state: {
      activeMethod,
      identityToken,
      orderStatus,
      isExistingUser,
      isTez,
      is4gives,
      processingFee,
      discountedAmount,
      walletToggleButtonCheck,
      walletBalance,
      GoogleAnalyticsCred,
      shippingPrice,
      rudderStackID,
    },

    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
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
        action: GAMessages.ORDER_SUCCESS_PAGE,
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
        action: GAMessages.ORDER_SUCCESS_PAGE,
      });
    }
    // --- Google Analytics End --- //
  }, [GoogleAnalyticsCred]);

  const history = useHistory();

  function FbScript(Encrp: any) {
    console.log("Encrp");
    console.log(Encrp);
    if (Encrp) {
      let totalAamount = Encrp.amount ? Encrp.amount : "0";
      let currencyy = Encrp.currency ? Encrp.currency : "PKR";

      if (typeof window !== "undefined") {
        console.log("FACEBOOK = ");
        console.log((window as any).fbq);

        let prods = Encrp.line_items;
        let prodIds = [];
        let totalQty = 0;
        let contentNames = [];

        if ((window as any).fbq) {
          for (let i = 0; i < prods.length; i++) {
            let prd = prods[i];
            totalQty = totalQty + prd.quantity;
            prodIds.push(prd.id);
            contentNames.push(prd.title ? prd.title : prd.name);
          }

          (window as any).fbq("track", "Purchase", {
            value: totalAamount,
            currency: currencyy,
            content_type: "product_group",
            num_items: totalQty,
            content_ids: prodIds,
            content_name: contentNames,
          });
        }
      }
    }
  }

  const getMerchantScripts = async (iden: any, Encrp: any) => {
    // try {
    //   const response = await facebookEvents.getFacebookScript("", {
    //     headers: {
    //       "identity-token": iden,
    //       Accept: "application/json",
    //     },
    //   });
    //   // if (response) {
    //   console.log(response);
    //   if (response && response.data) {
    //     let data = response.data;
    //     if (data) {
    //       if (data.length) {
    //         var sc = document.createElement("script");
    //         sc.setAttribute("src", data[0]);
    //         sc.setAttribute("type", "text/javascript");
    //         document.head.appendChild(sc);
    //         setTimeout(FbScript.bind(null, Encrp), 5000);
    //       }
    //     }
    //   }
    //   // }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  useEffect(() => {
    if (encrypted) {
      let qS = encrypted.query_string;
      let qSs = [];
      qS = qS.replace("?identity-token=", "");
      qSs = qS.split("&queryUrl=");
      // setTimeout(getMerchantScripts.bind(null, qSs[0], encrypted), 5000);

      getMerchantScripts(qSs[0], encrypted);
    }
  }, [encrypted]);

  // useEffect(() => {
  //   console.log('hijk')
  //   // if(encrypted) {
  //   FbScript(encrypted);
  //   // }
  // }, [(window as any).fbq])

  useEffect(() => {
    const search = window.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const trackingID = params.get("tracking_id");
    const paramToken = params.get("token");
    const transactionId = params.get("order_id");
    setQueryString(search);
    updateStateHandler({
      payload: {
        token: paramToken,
      },
    });
    setTrackingId(trackingID!);
    setTransactionID(transactionId);
    requestOrderHandler(trackingID, paramToken);
    getIsFourGivesValue();

    // @ts-ignore:next-line
    // nid("applicationSubmit", ["payment_completed"]);
    // @ts-ignore:next-line
    // nid("sendData");
    // @ts-ignore:next-line
    // nid("stop");
  }, []);

  useEffect(() => {
    if (identityToken) {
      getIsFourGivesValue();
    }
  }, [identityToken]);

  const getIsFourGivesValue = async () => {
    console.log("getIsFourGivesValue");

    // const checkout_url  = window.location.href;

    let response = await generalServiceTwo.fourGives({
      headers: {
        "identity-token": identityToken!,
        // "Authorization": `Bearer ${token}`,
        // "Content-Type": "application/json"
      },
    });

    try {
      console.log("is 4 gives");
      console.log(response);

      let updatedState = {
        is4gives: false,
      };

      if (response.data && response.data.has_custom_credit_card) {
        updatedState.is4gives = true;
      } else {
        updatedState.is4gives = false;
      }

      updateStateHandler({
        payload: { ...updatedState },
      });
      setFourGiveLoader(false);
    } catch (e) {
      setFourGiveLoader(false);
    }

    console.log("getIsFourGivesValue 3");
  };

  const [newMail, setNewMail] = useState<string>("");

  useEffect(() => {
    let newEmail: any = localStorage.getItem("JWTEmail");
    setNewMail(newEmail);
  }, []);

  const checkEasyPaisaStatus =
    activeMethod == "EASYPAISA" && orderStatus != "COMPLETED";
  const time = new Date();
  time.setSeconds(time.getSeconds() + 70); // 30 seconds timer
  const message =
    orderStatus == "CANCELLED" && activeMethod == "EASYPAISA" ? (
      "Your order is cancelled."
    ) : (
      <>
        {orderStatus == "" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p>Please Click the refresh button to check your order status</p>
            {/* <img  src="/assets/refresh.gif" className="reload-gif" /> */}
            <button
              onClick={getOrderDetailHandler}
              style={{
                fontSize: "12px",
                background: "#e82e81",
                border: "none",
                color: "white",
                borderRadius: "10px",
                marginTop: "10px",
              }}
              className=""
            >
              Check Status
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Your order is {orderStatus}
            {/* <img  src="/assets/refresh.gif" className="reload-gif" /> */}
            <button
              onClick={getOrderDetailHandler}
              style={{
                fontSize: "12px",
                background: "#e82e81",
                border: "none",
                color: "white",
                borderRadius: "10px",
                marginTop: "10px",
              }}
              className=""
            >
              Check Status
            </button>
          </div>
        )}
      </>
    );
  return (
    <Container className="center-box">
      <div className="flex-box">
        <div className="checkout-container bg-checkout relative no-padding-top  overflow-scroll h-100vh ">
          {!fourGiveLoader && !is4gives && (
            <div className="logo-container mt-20">
              <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
            </div>
          )}

          {!fourGiveLoader && is4gives && (
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

          <div className="content-container">
            <div className="text-center">
              {isExistingUser && (
                <div>
                  <div>
                    <p className="main-headings text-center mt-30 inline-timer">
                      {checkEasyPaisaStatus ? message : "Order Complete"}{" "}
                    </p>
                    <div>
                      <p className="transaction-text text-center mt-10">
                        {" "}
                        Transacction # {transactionID}
                      </p>
                    </div>
                  </div>

                  <img
                    className="mt-20"
                    src={
                      checkEasyPaisaStatus
                        ? "/assets/cancel2.svg"
                        : "/assets/checkscreen.svg"
                    }
                  ></img>
                </div>
              )}

              {!isExistingUser && (
                <div className="orderSuccessGif">
                  <img
                    className="mt-20"
                    src={
                      checkEasyPaisaStatus
                        ? "/assets/cancel2.svg"
                        : "/assets/checkscreen.svg"
                    }
                  ></img>

                  <div className="checkoutSuccessGif">
                    <p className="main-headings text-center mt-30 inline-timer">
                      {checkEasyPaisaStatus ? message : "Order Complete"}{" "}
                    </p>
                    <div>
                      <p className="transaction-text text-center mt-10">
                        {" "}
                        Transaction # {transactionID}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* {!isExistingUser && (
                <div>
                  <img src="/assets/orderPlace.gif" className="orderPlaceGif" />
                </div>
              )} */}

              <p className="sm-text-success text-center mt-10">
                {" "}
                A confirmation email will be sent to <br />
                <span style={{ fontWeight: "500" }}>
                  {newMail && newMail !== "null" && newMail}
                  {encrypted?.email && encrypted?.email}
                </span>
              </p>
            </div>
          </div>

          <div className="container-success pointer">
            <div className="drop-container pointer">
              <div className="  align-center">
                <Row>
                  <Col className="align-self-center" xs={8} lg={8} md={8}>
                    <p className="card-text text-start">Order Total</p>
                  </Col>

                  <Col
                    style={{ textAlign: "end" }}
                    className="align-self-center"
                    xs={4}
                    lg={4}
                    md={4}
                  >
                    <p className="text-16 font-medium ">
                      {encrypted?.currency == "USD"
                        ? "$"
                        : encrypted?.currency + " "}
                      <CurrencyFormat
                        value={
                          encrypted != null
                            ? // Number(processingFee) != null ||
                              //   Number(processingFee) != undefined ||
                              //   processingFee != "" ||
                              //   Number(processingFee) != 0
                              //   ?
                              //   // ((Number(encrypted.total_amount) -
                              //   //   Number(encrypted.tax_amount) - Number(encrypted.shipping_amount)) /
                              //   //   100) *
                              //   // Number(processingFee) +
                              //   // Number(encrypted.total_amount) -
                              //   // Number(encrypted.tax_amount) - Number(encrypted.shipping_amount)
                              //   Number(encrypted.total_amount)
                              //   :
                              //   Number(encrypted.total_amount)
                              encrypted?.currency == "PKR"
                              ? walletToggleButtonCheck === "TRUE" &&
                                Number(walletBalance) >
                                  Number(encrypted.full_amount)
                                ? Number(encrypted?.full_amount)
                                : walletToggleButtonCheck === "TRUE" &&
                                  Number(walletBalance) <
                                    Number(encrypted?.full_amount)
                                ? Number(encrypted?.full_amount) -
                                  Number(walletBalance)
                                : Number(encrypted?.full_amount)
                              : walletToggleButtonCheck === "TRUE" &&
                                Number(walletBalance) >
                                  Number(encrypted?.full_amount)
                              ? Number(encrypted?.full_amount).toFixed(2)
                              : walletToggleButtonCheck === "TRUE" &&
                                Number(walletBalance) <
                                  Number(encrypted?.full_amount)
                              ? (
                                  Number(encrypted?.full_amount) -
                                  Number(walletBalance)
                                ).toFixed(2)
                              : Number(encrypted?.full_amount).toFixed(2)
                            : //((Number(encrypted.total_amount) / 100 * Number(processingFee))).toFixed(2)
                              //   Number(encrypted.total_amount)) -
                              // Number(encrypted.discounted_amount)
                              0
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                        //suffix={encrypted?.currency != 'PKR' ? '.00' : ''}
                        suffix={
                          encrypted?.currency == "PKR"
                            ? ""
                            : Number.isInteger(
                                Number(encrypted?.total_amount) -
                                  Number(discountedAmount)
                              ) === true
                            ? ".00"
                            : ""
                        }
                      />
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          {encrypted?.installment_amount ? (
            <div className="container-success mt-10 pointer">
              <div className="drop-container pointer">
                <div className="  align-center">
                  <Row>
                    <Col className="align-self-center" xs={8} lg={8} md={8}>
                      <p className="card-text text-start">Installment Amount</p>
                    </Col>

                    <Col
                      style={{ textAlign: "end" }}
                      className="align-self-center"
                      xs={4}
                      lg={4}
                      md={4}
                    >
                      <p className="text-16 font-medium ">
                        {encrypted?.currency == "USD"
                          ? "$"
                          : encrypted?.currency + " "}
                        <CurrencyFormat
                          value={
                            encrypted != null
                              ? encrypted?.currency == "PKR"
                                ? walletToggleButtonCheck === "TRUE" &&
                                  Number(walletBalance) >
                                    Number(encrypted.full_amount)
                                  ? Number(encrypted?.installment_amount)
                                  : walletToggleButtonCheck === "TRUE" &&
                                    Number(walletBalance) <
                                      Number(encrypted?.full_amount)
                                  ? Number(encrypted?.installment_amount) -
                                    Number(walletBalance)
                                  : Number(encrypted?.installment_amount)
                                : walletToggleButtonCheck === "TRUE" &&
                                  Number(walletBalance) >
                                    Number(encrypted?.full_amount)
                                ? Number(encrypted?.installment_amount).toFixed(
                                    2
                                  )
                                : walletToggleButtonCheck === "TRUE" &&
                                  Number(walletBalance) <
                                    Number(encrypted?.full_amount)
                                ? (
                                    Number(encrypted?.installment_amount) -
                                    Number(walletBalance)
                                  ).toFixed(2)
                                : Number(encrypted?.installment_amount).toFixed(
                                    2
                                  )
                              : //((Number(encrypted.total_amount) / 100 * Number(processingFee))).toFixed(2)
                                //   Number(encrypted.total_amount)) -
                                // Number(encrypted.discounted_amount)
                                0
                          }
                          displayType={"text"}
                          thousandSeparator={true}
                          //suffix={encrypted?.currency != 'PKR' ? '.00' : ''}
                          suffix={
                            encrypted?.currency == "PKR"
                              ? ""
                              : Number.isInteger(
                                  Number(encrypted?.installment_amount) -
                                    Number(discountedAmount)
                                ) === true
                              ? ".00"
                              : ""
                          }
                        />
                      </p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="container-success mt-10 pointer">
            <div className="drop-container pointer">
              <div
                onClick={(e) => {
                  setLoadShipping(!loadShipping);
                }}
                className=" flex align-center"
              >
                <div className="drop-heading-container w-100">
                  <div>
                    <p
                      className={
                        loadShipping
                          ? "card-text font-regular text-start"
                          : "card-text font-medium text-start"
                      }
                    >
                      Shipping Information
                    </p>
                  </div>
                  <img src="/assets/arrow.svg"  width="24px" height="24px"></img>
                </div>
              </div>

              {loadShipping && (
                <div className="mt-20">
                  <p
                    className={
                      loadShipping
                        ? "font-16 font-regular text-start"
                        : "text-16 font-medium text-start"
                    }
                  >
                    {encrypted?.shipping_info?.first_name}
                  </p>
                  <p
                    className={
                      loadShipping
                        ? "font-16 font-regular text-start"
                        : "text-16 font-medium text-start"
                    }
                  >
                    {encrypted?.user.email}
                  </p>
                  <p
                    className={
                      loadShipping
                        ? "font-16 font-regular text-start"
                        : "text-16 font-medium text-start"
                    }
                  >
                    {encrypted?.shipping_info?.phone}
                  </p>
                  <p
                    className={
                      loadShipping
                        ? "font-16 font-regular text-start"
                        : "text-16 font-medium text-start"
                    }
                  >
                    {/* {encrypted?.shipping_info.country} */}
                    {/* City is repeating */}
                    {encrypted?.shipping_info.address1}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* {paymentMethod == "qisstpay" && (
            <div className="input-container mt-10 pointer">
              <div className="drop-container">
                <div
                  onClick={(e) => {
                    setLoadQisstpay(!loadQisstpay);
                  }}
                  className=" align-center"
                >
                  <p className="text-16 font-regular text-start">
                    Payment Method
                  </p>
                  <div className="drop-heading-container mt-10 w-100">
                    <p className="text-16 font-medium text-start">
                      <img
                        className="width-110"
                        src="/assets/svgQisst.svg"
                      ></img>
                    </p>
                    <p></p>
                    <img src="/assets/arrowD.png"></img>
                  </div>
                </div>

                {loadQisstpay && (
                  <div className="tabs-container mt-10 pointer">
                    <div className="tab tab-active  w-100">
                      <p className="center-text tab-text font-medium">
                        {encrypted?.payment_type == "SPLIT_PAY"
                          ? "PAY IN 6"
                          : "PAY IN 4"}
                      </p>
                      <p className="center-text text-12 font-regular">
                        Debit/Credit Card
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {paymentMethod.toString().toLowerCase() == "cod" && (
            <div className="container-success mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="card-text font-medium text-start">
                      Cash on Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "qisstpay" && (
            <div className="container-success mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <img src="/assets/pay_in_4.svg"></img>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "pay_in_2" && (
            <div className="container-success mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <img
                        style={{ height: "20pt" }}
                        src="/assets/Pay in 2.svg"
                      ></img>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "pay_in_6" && (
            <div className="container-success mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <img src="/assets/split.svg"></img>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "clover" && (
            <div className="container-success mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      PAID WITH CLOVER
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "paypal" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <img className="width-110" src="/assets/paypal.svg"></img>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod.toString().toLowerCase() === "wallet" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <p className="text-16 font-medium text-start">
                        PAID BY VAULT Q-POINTS
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod.toString().toLowerCase() == "googlepay" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <img
                        style={{ width: "64px" }}
                        src="/assets/googlepay.svg"
                      ></img>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod.toString().toLocaleUpperCase() ==
            "DIRECT_BANK_TRANSFER" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <p className="text-16 font-medium text-start">
                        DIRECT BANK TRANSFER
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "easypaisa" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <img className="width-110" src="/assets/epLogo.svg"></img>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "card" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <>
                        <img
                          style={{ height: "20px" }}
                          src="/assets/usCard1.svg"
                        ></img>
                      </>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "klarna" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <>
                        <img
                          style={{ height: "20px" }}
                          src="/assets/klarna.svg"
                        ></img>
                      </>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {paymentMethod.toString().toLowerCase() == "square" && (
            <div className="input-container mt-10">
              <div className="drop-container">
                <div className=" flex align-center">
                  <div className="drop-heading-container w-100">
                    <p className="text-16 font-medium text-start">
                      <>
                        <img
                          style={{ height: "20px" }}
                          src="/assets/square.svg"
                        ></img>
                      </>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* {paymentMethod != "cod" && (
            <div className="content-container ">
              <div className="timer-box">
               
                <p className="flex-box align-center">
                  <p className="padding-sides-20 font-regular">
                    <span className="font-bold">
                      {mins}:{Number(secs) < 10 ? `0${secs}` : secs}{" "}
                    </span>
                    until your order is automatically confirmed and your card is
                    charged.
                  </p>
                </p>
              </div>
            </div>
          )}
          {paymentMethod == "cod" && (
            <div className="content-container ">
              <div className="timer-box">
              
                <p className="flex-box align-center">
                  <p className="padding-sides-20 font-regular">
                    <span className="font-bold">
                      {mins}:{Number(secs) < 10 ? `0${secs}` : secs}{" "}
                    </span>
                    Your order is automatically confirmed after this time.
                    Please pay the entire order amount when you receive your
                    order.
                  </p>
                </p>
              </div>
            </div>
          )} */}

          {/* {is4gives && (
            <p className="poweredQP poweredQPMarginLeft">Powered by Qisstpay</p>
          )} */}

          <div className="btn-container text-center mt-30">
            {/* {!disable &&
              paymentMethod != "EASYPAISA" &&
              paymentMethod != "KLARNA" && (
                <>
                  <div className="mb-10">
                    <button
                      className="cancel_btn "
                      style={{ zIndex: "1000", cursor: "pointer" }}
                      onClick={(e) => {
                        history.push(`${routes.orderCancel}${query}`);
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                </>
              )} */}
            {activeMethod == "EASYPAISA" && orderStatus != "" && (
              <button
                onClick={(e) => {
                  history.push(`${routes.orderReview}${query}`);
                }}
                type="button"
                className="basic-btn dm-sans"
              >
                Order Details
              </button>
            )}
            {activeMethod != "EASYPAISA" && (
              <button
                onClick={(e) => {
                  history.push(`${routes.orderReview}${query}`);
                }}
                type="button"
                className="basic-btn dm-sans"
              >
                Order Details
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentSuccessPage;
