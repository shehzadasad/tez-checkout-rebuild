import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Dna  } from "react-loader-spinner";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { usePaymentSuccessHook } from "../hooks/custom/usePaymentSuccuess";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";
import CurrencyFormat from "react-currency-format";
import { stubTrue } from "lodash";
import "../styles/success.css";
import { orderService } from "../services/order.service";

const PaymentCancelPage: React.FC = () => {
  const {
    states: {
      loadQisstpay,
      loadShipping,
      timer,
      timerSuccess,
      disable,
      mins,
      secs,
      query,
      encrypted,
      paymentMethod,
      transactionID,

    },
    setStates: {
      setMins,
      setSecs,
      setDisable,
      setQueryString,
      setLoadQisstpay,
      setLoadShipping,
      setTransactionID,
    },
    handlers: { requestTimeHandler, requestOrderHandler },
  } = usePaymentSuccessHook();

  const {
    state: {
      totalAmount,
      taxPrice,
      shippingPrice,
      activeMethod,
      token,
      discountedAmount,
      isTez,
      isEventsEnabled,
      is4gives,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const history = useHistory();

  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [trackingID, setTrackingID] = useState<string>("");

  useEffect(() => {
    // console.log(paymentMethod);
    const search = window.location.search; // could be '?foo=bar'
    setQueryString(search);
    // console.log(search);
    const params = new URLSearchParams(search);
    const trackingID = params.get("tracking_id");
    const token = params.get("token");
    const transactionID = params.get("order_id");
    setTrackingID(trackingID!);
    setTransactionID(transactionID);
    requestTimeHandler(trackingID, token);
    requestOrderHandler(trackingID, token);
    updateStateHandler({
      payload: {
        token: token,
      },
    });
  }, []);

  const cancelOrderHandler = async () => {
    try {
      setOnLoad(true);
      const response = await orderService.cancelOrder(
        {
          isEventsEnabled:isEventsEnabled,
          tracking_id: trackingID,
          store_url: "https://sandbox.wordpress.qisstpay.com/wp-json/wc/v3/",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.success) {
        setTimeout(() => {
          //TODO: have to make it dynamic in previous code we are calling api where we get the redirect url and other stuff
          setOnLoad(false);
          var fromIfram = window == window.parent ? false : true;
          if (!fromIfram) {
            // window.location.href = encrpted.redirect_url;
            // console.log("in parent");
          } else {
            // console.log("in child");
            // if (encrpted.package_name == "PAYPAL") {
            //   window.location.href = encrpted.redirect_url;
            // } else {
            window.parent.postMessage({ link: "", qp_flag_teez: false }, "*");
            // }
          }
        }, 500);
      } else {
        setError(response.message);
        setOnLoad(false);
      }
    } catch (error: any) {
      setOnLoad(false);
      setError(error?.response?.data?.message ?? "Something went wrong.");
    }
  };
  // console.log("encryptedC", encrypted);
  return (
    <Container className="center-box">
      <div className="flex-box">
        <div className="checkout-container bg-checkout relative no-padding-top  overflow-scroll h-100vh ">
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
          {!is4gives && isTez != 0 ? (
            <div className="logo-container">
              <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
            </div>
          ) : (
            !is4gives && (
              <div className="logo-container">
                <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
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

          <div className="content-container">
            <div className="text-center">
              <p className="main-headings text-center mt-30">Cancel Order</p>
              <p className="transaction-text text-center mt-10">
                {" "}
                Transaction # {transactionID}
              </p>
              <img className="mt-20" src="/assets/cancel2.svg"></img>
              <p className="sm-text-success text-center mt-10">
                {" "}
                A confirmation email will be sent to <br />
                <span style={{ fontWeight: "500" }}>{encrypted?.email}</span>
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
                      {encrypted?.currency == "USD" ? "$" : encrypted?.currency}

                      <CurrencyFormat
                        value={
                          encrypted != null
                            ? (
                                Number(encrypted.total_amount) +
                                Number(encrypted?.tax_amount) +
                                Number(encrypted.shipping_amount) -
                                Number(encrypted.discounted_amount)
                              ).toFixed(2)
                            : 0
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                        suffix={encrypted?.currency != "PKR" ? "" : ".00"}
                      />
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
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
                    {encrypted?.user.name}
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
                    {encrypted?.user.phone_number}
                  </p>
                  <p
                    className={
                      loadShipping
                        ? "font-16 font-regular text-start"
                        : "text-16 font-medium text-start"
                    }
                  >
                    {encrypted?.shipping_info.address1},{" "}
                    {encrypted?.shipping_info.city}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* {paymentMethod == "Checkout" && (
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
          {paymentMethod.toString().toLowerCase() == "qisstpay" && (
            <div className="input-container mt-10">
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
          {paymentMethod.toString().toLowerCase() == "pay_in_6" && (
            <div className="input-container mt-10">
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

          {paymentMethod.toString().toLowerCase() ==
            "DIRECT_BANK_TRANSFER".toString().toLocaleLowerCase() && (
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
          {paymentMethod.toString().toLowerCase() ==
            "EASYPAISA".toString().toLocaleLowerCase() && (
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
          {paymentMethod.toString().toLowerCase() ==
            "KLARNA".toString().toLocaleLowerCase() && (
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
                      <img
                        style={{ width: "64px" }}
                        src="/assets/square.svg"
                      ></img>
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

          <div className="btn-container text-center mt-30">
            <button
              onClick={(e) => {
                cancelOrderHandler();
                // history.push(`${routes.orderReview}${query}`);
              }}
              type="button"
              className="alert-btn"
            >
              Yes, Cancel My Order
            </button>

            <div className="mt-10">
              <button
                className="base-color font-medium mt-20"
                style={{
                  zIndex: "1000",
                  cursor: "pointer",
                  border: "none",
                  background: "transparent",
                }}
                onClick={(e) =>
                  history.push(`${routes.paymentSuccessPage}${query}`)
                }
              >
                No, Don't Cancel My Order
              </button>
            </div>
            {/* {is4gives && <p className="poweredQP">Powered by Qisstpay</p>} */}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentCancelPage;
