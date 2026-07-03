import { Container, Form, Row, Col } from "react-bootstrap";
import { useUserDetailHook } from "../../../hooks/custom/useUserDetail";
import { Dna } from "react-loader-spinner";
import { TextField, IconButton, MenuItem, Autocomplete } from "@mui/material";
import IntlTelInput from "react-intl-tel-input";
import { lazyLoad } from "../../../utils/loadable";
import { useContext, useEffect, useState } from "react";
import { Context as CheckoutContext } from "../../../hooks/context/checkoutContext";
import ProgressBar from "../../../components/progressBar/ProgressBar";
import "../../../styles/checkout.css";
import "../../../styles/signup.css";
import Cart from "../../../components/cart/cart";
import { useHistory } from "react-router-dom";
import { usePhoneHook } from "../../../hooks/custom/usePhone";
import { routes } from "../../../router/routes";

const LocationSearchInput = lazyLoad(
  () => import("../../../components/location/AutoPlaceComponent")
);

const EditAddress: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const {
    states: {
      loadMore,
      onLoad,
      house,
      zipCode,
      countries,
      error,
      shippingStates,
      shippingCities,
      shippingCountryId,
      shippingStateId,
    },
    setStates: { setHouse, setZipCode },
    handlers: {
      cityChangeHandler,
      findShippingCountryByIdHandler,
      findShippingStateByIdHandler,
      addNewAddressHandler,
    },
  } = useUserDetailHook();

  const {
    state: {
      lastName,
      city,
      billingCity,
      emailValidated,
      email,
      countryCode,
      currency,
      taxPrice,
      phoneNumber,
      shippingPrice,
      totalAmount,
      productsObj,
      discountedAmount,
      processingFee,
      country,
      state,
      shippingZip,
      isTez,
      shipping_flag,
      customerId,
      MerchantUserId,
      rudderStackID,
      user_type,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const {
    states: { showHelpUs, phoneValidity, acceptTerms, shortURL },
    setStates: { setPhoneValidity, setAcceptTerms, setOnLoad },
    handlers: {
      getCountryCodeHandler,
      closeHelpUsModalHandler,
      showHelpUsModalHandler,
      sendOtpHandler,
      updatePhoneNumberHandler,
      guestCheckoutHandler,
      handleKeyPressHandler,
      bityCall,
    },
  } = usePhoneHook();

  const [curr, setCurr] = useState("EUR");
  const [cit, setCit] = useState("isb");
  const history = useHistory();
  const handleChange = (event: any) => {
    setCurr(event.target.value);
  };
  const handleChange2 = (event: any) => {
    setCit(event.target.value);
  };

  // useEffect(() => {
  //   // @ts-ignore:next-line
  //   nid("stateChange", "user-detail");
  //   // (global as any).analytics.page("Signup Screen-Enter User Details ");
  // }, []);
  const backButtonPaymentScreen = () => {
    (global as any).rudderanalytics?.track(
      "back_button_click_newaddress",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    history.goBack();
  };
  return (
    <div>
      <Container className="center-box">
        <div className="flex-box">
          <div className="checkout-container bg-checkout relative">
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
            <div className="logo-container">
              <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
            </div>

            {/*<ProgressBar from="signup" />*/}

            <div style={{ paddingTop: "20px" }}>
              <div className="">
                <div
                  // onClick={(e) => setLoadMore(!loadMore)}

                  className="drop-heading-container pointer"
                  style={{ justifyContent: "left" }}
                >
                  <IconButton
                    style={{ cursor: "pointer" }}
                    onClick={() => backButtonPaymentScreen()}
                  >
                    <img
                      className="mr-20"
                      src="/assets/backbtn.svg"
                      alt="back-btn"
                    />
                  </IconButton>
                  <p className="main-text">Shipping Information</p>
                  {/* <img src="/assets/arrow.svg"></img> */}
                </div>

                {loadMore && (
                  <div>
                    <Row className="">
                      <Col lg={12} className="mt-20">
                        <TextField
                          className=""
                          size="small"
                          id="filled-basic"
                          label="Full Name"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </Col>
                      <Col lg={12} className="mt-20">
                        {/* <TextField
                          className=""
                          size="small"
                          id="filled-basic"
                          label="Phone Number"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                          }}
                        /> */}
                        <IntlTelInput
                          containerClassName="intl-tel-input w-100"
                          inputClassName="single-input-card2 outline-color-base2 w-100 h-50 text-16"
                          fieldId="input"
                          autoPlaceholder
                          format={true}
                          defaultValue={phoneNumber}
                          defaultCountry={countryCode}
                          preferredCountries={["pk", "us"]}
                          // onlyCountries={["pk", "bd", "lk", "us"]}
                          value={phone}
                          onPhoneNumberChange={(
                            isValid,
                            value,
                            countryData,
                            intlNumber
                          ) => {
                            setPhone(value);
                            // if (isValid) {
                            //   setPhoneValidity(isValid);
                            // }
                          }}
                          // onPhoneNumberBlur={(isValid) => {
                          //   setPhoneValidity(isValid);
                          // }}
                        />
                      </Col>
                      <Col lg={12} className="mt-20">
                        <LocationSearchInput
                          cityHandler={cityChangeHandler}
                          billingHandler={() => {}}
                          from="shipping"
                        />
                      </Col>
                      <Col lg={12} className="mt-20">
                        <TextField
                          className=""
                          size="small"
                          id="filled-basic"
                          label="House/Apartment"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={house}
                          onChange={(e) => {
                            setHouse(e.target.value);
                          }}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} className="mt-20">
                        <Autocomplete
                          id="combo-box-demo"
                          options={countries}
                          getOptionLabel={(option) => option.name}
                          style={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country"
                              variant="filled"
                              className="user-input-card-"
                            />
                          )}
                          onChange={(e, value) => {
                            if (value) {
                              findShippingCountryByIdHandler(
                                value.countryId.toString()
                              );
                            }
                          }}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} className="mt-20">
                        <Autocomplete
                          id="combo-box-demo"
                          options={shippingStates}
                          getOptionLabel={(option) => option.name}
                          style={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="State"
                              variant="filled"
                              className="user-input-card-"
                            />
                          )}
                          onChange={(e, value) => {
                            if (value) {
                              findShippingStateByIdHandler(
                                value.stateId.toString()
                              );
                            }
                          }}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} className="mt-20">
                        <Autocomplete
                          id="combo-box-demo"
                          options={shippingCities}
                          getOptionLabel={(option) => option.name}
                          style={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              variant="filled"
                              className="user-input-card-"
                            />
                          )}
                          onChange={(e, value) => {
                            if (value) {
                              updateStateHandler({
                                payload: {
                                  city: value.name,
                                },
                              });
                            }
                          }}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} className="mt-20">
                        <TextField
                          size="small"
                          className=""
                          id="filled-basic"
                          label="Postal Code"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="number"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={zipCode}
                          disabled={city != "" ? false : true}
                          // disabled={zipFound}
                          onChange={(e) => {
                            setZipCode(e.target.value);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-20 mb-20">
              {error != "" && (
                <div className="w-100 mb-20 mt-20 flex ">
                  <p className="pl-10 error-msg">{error}</p>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  if (!onLoad) {
                    addNewAddressHandler(name, phone);
                  }
                }}
                className="basic-btn"
              >
                Add Address
              </button>
            </div>
          </div>
        </div>
      </Container>
      <Cart
        countryCode={countryCode}
        currency={currency}
        taxPrice={taxPrice}
        vaultPoints={"0"}
        processingFee={processingFee}
        shippingPrice={
          shipping_flag && shipping_flag === "true"
            ? shippingPrice
            : shipping_flag && shipping_flag === "false"
            ? "0"
            : !shipping_flag && shippingPrice
        }
        totalAmount={totalAmount}
        productsObj={productsObj}
        discountedAmount={discountedAmount}
      />
    </div>
  );
};

export default EditAddress;
