import { Container, Form, Row, Col } from "react-bootstrap";
import { useUserDetailHook } from "../hooks/custom/useUserDetail";
import TextField from "@mui/material/TextField";
import { lazyLoad } from "../utils/loadable";
import { useContext } from "react";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
const LocationSearchInput = lazyLoad(
  () => import("../components/location/AutoPlaceComponent")
);

const UserDetailPage: React.FC = () => {
  const {
    states: {
      loadMore,
      onLoad,
      loadAddress,
      loadEmail,
      house,
      cityFound,
      stateFound,
      zipFound,
      state,
      zipCode,
      billingFlag,
      houseBilling,
      billingCityFound,
      billingState,
      billingStateFound,
      billingZipCode,
      billingZipCodeFound,
      error,
    },
    setStates: {
      setLoadMore,
      setLoadAddress,
      setLoadEmail,
      setHouse,
      setZipCode,
      setBillingFlag,
      setShippingFlag,
      setHouseBilling,
      setBillingState,
      setState,
      setBillingZipCode,
    },
    handlers: {
      manualFieldsShippingHandler,
      inputChangeHandler,
      cityChangeHandler,
      billingCityChangeHandler,
      sameAsBillingAddressHandler,
      saveUserDataHandler,
    },
  } = useUserDetailHook();

  const {
    state: { name, lastName, city, billingCity, emailValidated, email, isTez },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  return (
    <Container className="center-box">
      <h3 className="topHeading">Sign Up</h3>

      <div className="flex-box">
        <div className="checkout-container bg-checkout relative overflow-scroll h-100vh">
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
          {isTez != 0 ? (
            <div className="logo-container">
              <img className="tezlogo" src="/assets/oneClick2x.png"></img>
            </div>
          ) : (
            <div className="logo-container">
              <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
            </div>
          )}

          <div className="input-container">
            <div className="drop-container">
              <div
                onClick={(e) => setLoadMore(!loadMore)}
                className="drop-heading-container pointer"
              >
                <p className="text-16 bold text-start">Shipping Address</p>
                <img src="/assets/arrowD.png"></img>
              </div>

              {loadMore && (
                <div>
                  <Row className="">
                    <Col md={6} className="mt-20">
                      <TextField
                        className="single-input"
                        id="filled-basic"
                        label="First Name"
                        variant="filled"
                        style={{ width: "100%" }}
                        autoFocus
                        type="text"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        name="name"
                        value={name}
                        onChange={(e) => inputChangeHandler(e)}
                      />
                    </Col>
                    <Col md={6} className="mt-20">
                      <TextField
                        className="single-input"
                        id="filled-basic"
                        label="Last Name"
                        variant="filled"
                        style={{ width: "100%" }}
                        type="text"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        value={lastName}
                        name="lastName"
                        onChange={(e) => inputChangeHandler(e)}
                      />
                    </Col>
                    <Col lg={12} className="mt-20">
                      <TextField
                        className=""
                        id="filled-basic"
                        label="House/Apartment#"
                        variant="filled"
                        style={{ width: "100%" }}
                        type="text"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        value={house}
                        onChange={(e) => {
                          setHouse(e.target.value);
                        }}
                      />
                    </Col>

                    <Col lg={12} className="mt-20">
                      <LocationSearchInput
                        cityHandler={cityChangeHandler}
                        billingHandler={() => {}}
                        from="shipping"
                      />
                    </Col>

                    <Col md={12} lg={12} className="mt-20">
                      <TextField
                        className=""
                        id="filled-basic"
                        label="City"
                        variant="filled"
                        style={{ width: "100%" }}
                        type="text"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        value={city}
                        disabled={cityFound}
                        onChange={(e) =>
                          updateStateHandler({
                            payload: {
                              city: e.target.value,
                            },
                          })
                        }
                      />
                    </Col>
                    <Col md={6} lg={6} className="mt-20">
                      <TextField
                        className=""
                        id="filled-basic"
                        label="State"
                        variant="filled"
                        style={{ width: "100%" }}
                        type="text"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        value={state}
                        disabled={stateFound}
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                      />
                    </Col>
                    <Col md={6} lg={6} className="mt-20">
                      <TextField
                        className=""
                        id="filled-basic"
                        label="Postal Code"
                        variant="filled"
                        style={{ width: "100%" }}
                        type="number"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        value={zipCode}
                        disabled={zipFound}
                        onChange={(e) => {
                          setZipCode(e.target.value);
                        }}
                      />
                    </Col>
                    <div
                      onClick={manualFieldsShippingHandler}
                      className="manualTrigger"
                    >
                      Set Address Manually
                    </div>
                  </Row>
                </div>
              )}
            </div>
          </div>

          <div className="input-container mt-30">
            <div className="drop-container">
              <div
                onClick={(e) => setLoadAddress(!loadAddress)}
                className="drop-heading-container pointer"
              >
                <p className="text-16 bold text-start">Billing Address</p>
                <img src="/assets/arrowD.png"></img>
              </div>

              {loadAddress && (
                <div>
                  <Row className="mt-20">
                    <Col lg={12}>
                      <Form>
                        <Form.Check
                          defaultChecked
                          onChange={sameAsBillingAddressHandler}
                          className="text-16 font-regular"
                          label="Same as Shipping Address"
                          name="group1"
                          type={"radio"}
                          id={`inline-${"radio"}-1`}
                        />
                        <Form.Check
                          onChange={(e) => {
                            setBillingFlag(true);
                            setShippingFlag(false);
                          }}
                          className="text-16 font-regular"
                          label="Use a Different Billing Address"
                          name="group1"
                          type={"radio"}
                          id={`inline-${"radio"}-2`}
                        />
                      </Form>
                    </Col>

                    {billingFlag && (
                      <>
                        <Col lg={12} className="mt-20">
                          <TextField
                            className=""
                            id="filled-basic"
                            label="House/Apartment#"
                            variant="filled"
                            style={{ width: "100%" }}
                            type="text"
                            InputProps={{
                              className: "user-input-card",
                            }}
                            value={houseBilling}
                            onChange={(e) => {
                              setHouseBilling(e.target.value);
                            }}
                          />
                        </Col>

                        <Col lg={12} className="mt-20">
                          <LocationSearchInput
                            cityHandler={() => {}}
                            billingHandler={billingCityChangeHandler}
                            diffBilling={billingFlag}
                            from={"billing"}
                          />
                        </Col>

                        <Col md={12} lg={12} className="mt-20">
                          <TextField
                            className=""
                            id="filled-basic"
                            label="City"
                            variant="filled"
                            style={{ width: "100%" }}
                            type="text"
                            InputProps={{
                              className: "user-input-card",
                            }}
                            value={billingCity}
                            disabled={billingCityFound}
                            onChange={(e) => {
                              updateStateHandler({
                                payload: {
                                  billingCity: e.target.value,
                                },
                              });
                            }}
                          />
                        </Col>
                        <Col md={6} lg={6} className="mt-20">
                          <TextField
                            className=""
                            id="filled-basic"
                            label="State"
                            variant="filled"
                            style={{ width: "100%" }}
                            type="text"
                            InputProps={{
                              className: "user-input-card",
                            }}
                            value={billingState}
                            disabled={billingStateFound}
                            onChange={(e) => {
                              setBillingState(e.target.value);
                            }}
                          />
                        </Col>
                        <Col md={6} lg={6} className="mt-20">
                          <TextField
                            className=""
                            id="filled-basic"
                            label="Postal Code"
                            variant="filled"
                            style={{ width: "100%" }}
                            type="number"
                            InputProps={{
                              className: "user-input-card",
                            }}
                            value={billingZipCode}
                            disabled={billingZipCodeFound}
                            onChange={(e) => {
                              setBillingZipCode(e.target.value);
                            }}
                          />
                        </Col>
                        <div
                          onClick={manualFieldsShippingHandler}
                          className="manualTrigger"
                        >
                          Set Address Manually
                        </div>
                      </>
                    )}
                  </Row>
                </div>
              )}
            </div>
          </div>

          <div className="input-container mt-30">
            <div className="drop-container">
              <div
                onClick={(e) => setLoadEmail(!loadEmail)}
                className="drop-heading-container pointer"
              >
                <p className="text-16 bold text-start">Enter Email Address</p>
                <img src="/assets/arrowD.png"></img>
              </div>

              {loadEmail && (
                <div>
                  <Row className="mt-30">
                    <Col md={12} className="relative">
                      <TextField
                        className="single-input"
                        id="filled-basic"
                        label="Email"
                        variant="filled"
                        style={{ width: "100%" }}
                        disabled={emailValidated}
                        type="email"
                        InputProps={{
                          className: "user-input-card",
                        }}
                        value={email}
                        onChange={(e) => {
                          updateStateHandler({
                            payload: {
                              email: e.target.value,
                            },
                          });
                        }}
                      />
                      {emailValidated && (
                        <img
                          className="absolute verified"
                          src="/assets/verified.png"
                        ></img>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </div>

          <div className="btn-container mt-30 mb-30">
            {error != "" && (
              <div className="w-100 mt-20 flex ">
                <p className="pl-10 error-msg">{error}</p>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                saveUserDataHandler();
              }}
              className="basic-btn"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserDetailPage;
