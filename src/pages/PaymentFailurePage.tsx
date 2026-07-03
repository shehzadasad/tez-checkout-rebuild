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

const PaymentFailurePage: React.FC = () => {
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
      is4gives,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const history = useHistory();

  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [trackingID, setTrackingID] = useState<string>("");
  const [message, setMessage] = useState<any>("");

  useEffect(() => {
    // console.log(paymentMethod);
    const search = window.location.search; // could be '?foo=bar'
    setQueryString(search);
    // console.log(search);
    const params = new URLSearchParams(search);
    const trackingID = params.get("tracking_id");
    const token = params.get("token");
    const transactionID = params.get("order_id");
    const messageP = params.get("message");
    setTrackingID(trackingID!);
    setTransactionID(transactionID);
    requestTimeHandler(trackingID, token);
    requestOrderHandler(trackingID, token);
    setMessage(messageP);
    updateStateHandler({
      payload: {
        token: token,
      },
    });
  }, []);

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
            <div style={{ marginTop: "60pt" }} className="logo-container">
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
              <p
                style={{ color: "#E93A7D" }}
                className="main-headings text-center mt-30"
              >
                {message
                  ? message
                  : "Something went wrong, Please try again after sometime!"}
              </p>
              <p className="transaction-text text-center mt-10">
                {" "}
                Transaction # {transactionID}
              </p>
              <img className="mt-20" src="/assets/cancel2.svg"></img>
              <p className="sm-text-success text-center mt-10">
                Order Cancelled
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

          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <button
              className="button"
              onClick={(e) => {
                {
                  (global as any).rudderanalytics?.track("Checkout Closed");
                  window.parent.postMessage(
                    {
                      qp_flag_teez: false,
                    },
                    "*"
                  );
                }
              }}
              type="button"
            >
              Close Checkout
            </button>
          </div> */}
        </div>
      </div>
    </Container>
  );
};

export default PaymentFailurePage;
