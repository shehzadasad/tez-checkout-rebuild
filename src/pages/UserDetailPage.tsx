import { Container, Form, Row, Col } from "react-bootstrap";
import { useUserDetailHook } from "../hooks/custom/useUserDetail";
import { Dna } from "react-loader-spinner";
import IntlTelInput from "react-intl-tel-input";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { lazyLoad } from "../utils/loadable";
import { useContext, useEffect, useState } from "react";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import ProgressBar from "../components/progressBar/ProgressBar";
import "../styles/checkout.css";
import "../styles/signup.css";
import { usePhoneHook } from "../hooks/custom/usePhone";
import Cart from "../components/cart/cart";
import { useHistory } from "react-router-dom";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../enums/GA-messages";
import axios from "axios";
import Globalcart from "../components/cart/Globalcart";
import { Autocomplete } from "@mui/material";
import { number } from "mathjs";

const LocationSearchInput = lazyLoad(
  () => import("../components/location/AutoPlaceComponent")
);
const UserDetailPage: React.FC = () => {
  // const history = useHistory();
  function ValidateEmail(email: any): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false;
    }
    return true;
  }

  const {
    states: {
      loadMore,
      onLoad,
      house,
      zipCode,
      billingFlag,
      houseBilling,
      billingState,
      billingZipCode,
      error,
      billingCountry,
      countries,
      shippingStates,
      billingStates,
      shippingCities,
      billingCities,
      shippingCountryId,
      billingCountryId,
      shippingStateId,
      billingStateId,
      cnic,
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
      setCountry,
      setBillingCountry,
      setCountryBillingFound,
      setClicked,
      setCountries,
      setShippingCountryId,
      setCnic,
    },
    handlers: {
      manualFieldsShippingHandler,
      inputChangeHandler,
      cityChangeHandler,
      billingCityChangeHandler,
      sameAsBillingAddressHandler,
      saveUserDataHandler,
      getCountriesHandler,
      findBillingCountryByIdHandler,
      findShippingCountryByIdHandler,
      findShippingStateByIdHandler,
      findBillingStateByIdHandler,
      getStatesHandler,
    },
  } = useUserDetailHook();

  const {
    state: {
      name,
      lastName,
      phoneNumber,
      city,
      billingCity,
      emailValidated,
      email,
      countryCode,
      currency,
      taxPrice,
      shippingPrice,
      totalAmount,
      productsObj,
      discountedAmount,
      country,
      state,
      shippingZip,
      isTez,
      is4gives,
      isGuest,
      mall_ID,
      globalCartObject,
      wordUrl,
      MerchantUserId,
      rudderStackID,
      customerId,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const {
    states: { showHelpUs, acceptTerms, shortURL, limit, limitSuccess },
    setStates: {
      setPhoneValidity,
      setAcceptTerms,
      setOnLoad,
      setLimit,
      setLimitSuccess,
    },
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
  //   nid('stateChange', 'user-detail');
  //   // (global as any).analytics.page("Signup Screen-Enter User Details ");

  // }, [])
  useEffect(() => {
    console.log(billingFlag, "billingFlag");
    (global as any).rudderanalytics?.track(
      "signup_screen_success",
      {},
      {
        time_stamp: time_stamp,
        user_id: customerId,
        merchant_id: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    if (billingFlag) {
      (global as any).rudderanalytics?.track(
        "same_billing_checked",
        {},
        {
          time_stamp: time_stamp,
          user_id: customerId,
          merchant_id: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
    } else {
      (global as any).rudderanalytics?.track(
        "same_billing_unchecked",
        {},
        {
          time_stamp: time_stamp,
          user_id: customerId,
          merchant_id: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
    }
  }, [billingFlag]);
  // useEffect(()=>{
  //   if(country != ""){
  //     findShippingCountryByIsoHandler(country)
  //   }
  // },[])
  function validateCnic(cnic: any): boolean {
    if (/^\d{13}$/.test(cnic)) {
      return false;
    }
    return true;
  }
  const [countryIndex, setCountryIndex] = useState(number);
  const [stateIndex, setStateIndex] = useState(number);
  useEffect(() => {
    if (
      wordUrl &&
      (wordUrl.includes("first_name") ||
        wordUrl.includes("last_name") ||
        wordUrl.includes("customer_email") ||
        wordUrl.includes("postcode"))
    ) {
      const regex = /"first_name":"([^"]*)"/;
      const regex2 = /"last_name":"([^"]*)"/;
      const regex3 = /"customer_email":"([^"]*)"/;
      const regex4 = /"postcode":"([^"]*)"/;
      const regex5 = /"country":"([^"]*)"/;
      const regex6 = /"state":"([^"]*)"/;
      const regex7 = /"city":"([^"]*)"/;
      const match = wordUrl.match(regex);
      const match2 = wordUrl.match(regex2);
      const match3 = wordUrl.match(regex3);
      const match4 = wordUrl.match(regex4);
      const match5 = wordUrl.match(regex5);
      const match6 = wordUrl.match(regex6);
      const match7 = wordUrl.match(regex7);
      if (match5) {
        const index: number = countries.findIndex(
          (val) => match5[1] == val.iso2
        );

        if (index > -1) {
          findShippingCountryByIdHandler(countries[index].countryId.toString());
          setCountryIndex(index);
        }
      }
      // if (match6) {
      //   const indexState: number = shippingStates.findIndex(
      //     (val) => match6[1] == val.stateCode
      //   );
      //   findShippingStateByIdHandler(
      //     shippingStates[indexState].stateId.toString()
      //   );
      //   setStateIndex(indexState);
      // }
      const firstname = match[1];
      const lastname = match2[1];
      const mail = match3[1];
      const pCode = match4[1];
      setZipCode(pCode);
      updateStateHandler({
        payload: {
          name: firstname,
          lastName: lastname,
          email: mail,
          city: match7[1],
        },
      });
    }
  }, [wordUrl]);
  function setCountryFunc(value: any) {
    if (value) {
      const index: number = countries.findIndex(
        (data) => value.countryId == data.countryId
      );
      if (index > -1) {
        setCountryIndex(index);
      }
      findShippingCountryByIdHandler(value.countryId.toString());
    }
  }
  function setStateFunc(value: any) {
    if (value) {
      const index: number = shippingStates.findIndex(
        (data) => value.stateId == data.stateId
      );
      if (index > -1) {
        setStateIndex(index);
      }
      findShippingStateByIdHandler(value.stateId.toString());
    }
  }
  return (
    <>
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
            <ProgressBar from="signup" />

            <div style={{ paddingTop: "20px" }}>
              {isGuest && (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => history.goBack()}
                >
                  <img className="mr-20" src="/assets/backbtn.svg"></img>
                </div>
              )}

              <div className="">
                <div
                  // onClick={(e) => setLoadMore(!loadMore)}
                  className="drop-heading-container pointer"
                >
                  <p className="main-text">Contact Information</p>
                  {/* <img src="/assets/arrow.svg"  width="24px" height="24px"></img> */}
                </div>

                {loadMore && (
                  <div>
                    <Row className="">
                      <Col md={6} className="mt-20">
                        <TextField
                          size="small"
                          className="single-input"
                          id="filled-basic"
                          label="First Name"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          name="name"
                          value={name}
                          onChange={(e) => inputChangeHandler(e)}
                        />
                      </Col>
                      <Col md={6} className="mt-20">
                        <TextField
                          size="small"
                          className="single-input"
                          id="filled-basic"
                          label="Last Name"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={lastName}
                          name="lastName"
                          onChange={(e) => inputChangeHandler(e)}
                        />
                      </Col>
                      <Col md={12} className="mt-20">
                        <TextField
                          size="small"
                          className="single-input"
                          id="filled-basic"
                          label="Email"
                          // autoFocus
                          variant="filled"
                          style={{ width: "100%" }}
                          // disabled={emailValidated}
                          type="email"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={email}
                          onChange={(e) => {
                            updateStateHandler({
                              payload: {
                                email: e.target.value,
                              },
                            });
                          }}
                          helperText={
                            ValidateEmail(email) === true && email !== ""
                              ? "Invalid Email!"
                              : ""
                          }
                          error={ValidateEmail(email) && email !== ""}
                        />

                        {emailValidated && (
                          <img
                            className="absolute verified"
                            src="/assets/verified.png"
                          ></img>
                        )}
                        {/* <TextField
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
                      /> */}
                      </Col>
                      {isGuest == true && (
                        <Col md={12} className="mt-20">
                          {countryCode != "" && (
                            <IntlTelInput
                              containerClassName="intl-tel-input w-100"
                              inputClassName="single-input-card2 outline-color-base2 w-100 h-50 text-16"
                              fieldId="input"
                              defaultValue={phoneNumber}
                              format={true}
                              defaultCountry={countryCode.toLowerCase()}
                              preferredCountries={["pk", "us"]}
                              // onlyCountries={["pk", "bd", "lk", "us"]}
                              value={phoneNumber}
                              onSelectFlag={(e) => {
                                updateStateHandler({
                                  payload: {
                                    phoneNumber: "",
                                    intlNumber: "",
                                  },
                                });
                              }}
                              onPhoneNumberChange={(
                                isValid,
                                value,
                                countryData,
                                intlNumber
                              ) => {
                                setPhoneValidity(false);
                                localStorage.setItem(
                                  "upliftPhoneNumber",
                                  value.replace(/[()\s-]/g, "")
                                );
                                updatePhoneNumberHandler(
                                  isValid,
                                  value,
                                  intlNumber,
                                  countryData
                                );
                                if (isValid) {
                                  setPhoneValidity(isValid);
                                }
                                // setCountryCode(countryData.iso2);
                                // props.setCountryCode(countryData.iso2);
                              }}
                              onPhoneNumberBlur={(isValid) => {
                                setPhoneValidity(isValid);
                              }}
                            />
                          )}
                          {limitSuccess != "" && (
                            <p style={{ color: "green", marginTop: "5px" }}>
                              {limitSuccess}
                            </p>
                          )}
                          {limit != "" && (
                            <p style={{ color: "red", marginTop: "5px" }}>
                              {limit}
                            </p>
                          )}
                        </Col>
                      )}
                      {/* <Col lg={12} className="mt-20">
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
                    </Col> */}

                      <Col lg={12} className="mt-20">
                        <LocationSearchInput
                          cityHandler={cityChangeHandler}
                          shippingCountryId={shippingCountryId}
                          setClicked={getStatesHandler}
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
                      <Col lg={12} className="mt-20">
                        <TextField
                          className=""
                          size="small"
                          id="filled-basic"
                          label="Cnic"
                          variant="filled"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={cnic}
                          onChange={(e) => {
                            setCnic(e.target.value);
                            updateStateHandler({
                              payload: { userCnic: e.target.value },
                            });
                          }}
                          helperText={
                            validateCnic(cnic) === true && cnic !== ""
                              ? "Invalid CNIC Please enter valid CNIC"
                              : null
                          }
                          error={validateCnic(cnic) && cnic !== ""}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} className="mt-20">
                        {countries.length ? (
                          <Autocomplete
                            value={countries[countryIndex]}
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
                              setCountryFunc(value);
                            }}
                          />
                        ) : null}
                      </Col>
                      <Col xs={6} md={6} lg={6} className="mt-20">
                        {shippingStates.length ? (
                          <Autocomplete
                            value={shippingStates[stateIndex]}
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
                              setStateFunc(value);
                            }}
                          />
                        ) : null}
                        {/* <TextField
                          size="small"
                          className=""
                          id="filled-basic"
                          label="State"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={state}
                          // disabled={stateFound}
                          onChange={(e) => {
                            setState(e.target.value);
                          }}
                        /> */}
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

                      {/* <Col xs={6} md={6} lg={6} className="mt-20">
                        <TextField
                          size="small"
                          className=""
                          id="filled-basic"
                          label="City"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={city}
                          // disabled={cityFound}
                          onChange={(e) =>
                            updateStateHandler({
                              payload: {
                                city: e.target.value,
                              },
                            })
                          }
                        />
                      </Col> */}

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

                      {/* <Col xs={6} md={6} lg={6} className="mt-20">
                        <TextField
                          size="small"
                          className=""
                          id="filled-basic"
                          label="Country"
                          variant="filled"
                          style={{ width: "100%" }}
                          type="text"
                          InputProps={{
                            className: "user-input-card-",
                          }}
                          value={country}
                          // disabled={countryFound}
                          onChange={(e) => {
                            setCountry(e.target.value);
                          }}
                        />
                      </Col> */}
                      {/* <div
                      onClick={manualFieldsShippingHandler}
                      className="manualTrigger"
                    >
                      Set Address Manually
                    </div> */}
                    </Row>
                  </div>
                )}
                <div className="flex mt-20">
                  <Form.Check
                    className="text-16 font-regular"
                    id={`inline-${"radio"}-2`}
                    checked={billingFlag}
                    onChange={(e) => {
                      setBillingFlag(e.target.checked);
                    }}
                  />
                  <p style={{ alignSelf: "center" }} className="sm-text">
                    Billing same as shipping?
                  </p>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: "0px" }}>
              <div style={{ paddingTop: "0px" }}>
                <div>
                  <div>
                    {billingFlag === false && (
                      <Row className="mt-20">
                        <>
                          <Col lg={12} className="mt-20">
                            {/* <h1>{billingFlag !== false ? "TRUE" : billingFlag === false ? "FALSE" : "XD"}</h1> */}
                            <LocationSearchInput
                              cityHandler={() => {}}
                              billingHandler={billingCityChangeHandler}
                              diffBilling={false}
                              from="billing"
                            />
                          </Col>
                          <Col lg={12} className="mt-20">
                            <TextField
                              size="small"
                              className=""
                              id="filled-basic"
                              label="Suite, Office, etc."
                              variant="filled"
                              style={{ width: "100%" }}
                              type="text"
                              InputProps={{
                                className: "user-input-card-",
                              }}
                              value={houseBilling}
                              onChange={(e) => {
                                setHouseBilling(e.target.value);
                              }}
                            />
                          </Col>
                          <Col xs={12} md={12} lg={12} className="mt-20">
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
                                />
                              )}
                              onChange={(e, value) => {
                                if (value) {
                                  findBillingCountryByIdHandler(
                                    value.countryId.toString()
                                  );
                                }
                              }}
                            />

                            {/* <TextField
                              size="small"
                              className=""
                              id="filled-basic"
                              label="Billing Country"
                              variant="filled"
                              style={{ width: "100%" }}
                              type="text"
                              InputProps={{
                                className: "user-input-card- red",
                              }}
                              value={billingCountry}
                              // disabled={countryBillingFound}
                              onChange={(e) => {
                                setBillingCountry(e.target.value);
                              }}
                            /> */}
                          </Col>
                          <Col md={6} lg={6} className="mt-20">
                            <Autocomplete
                              id="combo-box-demo"
                              options={billingStates}
                              getOptionLabel={(option) => option.name}
                              style={{ width: "100%" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="States"
                                  variant="filled"
                                />
                              )}
                              onChange={(e, value) => {
                                if (value) {
                                  findBillingStateByIdHandler(
                                    value.stateId.toString()
                                  );
                                }
                              }}
                            />
                            {/* <TextField
                              size="small"
                              className=""
                              id="filled-basic"
                              label="State"
                              variant="filled"
                              style={{ width: "100%" }}
                              type="text"
                              InputProps={{
                                className: "user-input-card-",
                              }}
                              value={billingState}
                              // disabled={billingStateFound}
                              onChange={(e) => {
                                setBillingState(e.target.value);
                              }}
                            /> */}
                          </Col>
                          <Col md={12} lg={12} className="mt-20">
                            <Autocomplete
                              id="combo-box-demo"
                              options={billingCities}
                              getOptionLabel={(option) => option.name}
                              style={{ width: "100%" }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="City"
                                  variant="filled"
                                />
                              )}
                              onChange={(e, value) => {
                                if (value) {
                                  updateStateHandler({
                                    payload: {
                                      billingCity: value.name,
                                    },
                                  });
                                }
                              }}
                            />

                            {/* <TextField
                              size="small"
                              className=""
                              id="filled-basic"
                              label="City"
                              variant="filled"
                              style={{ width: "100%" }}
                              type="text"
                              InputProps={{
                                className: "user-input-card-",
                              }}
                              value={billingCity}
                              // disabled={billingCityFound}
                              onChange={(e) => {
                                updateStateHandler({
                                  payload: {
                                    billingCity: e.target.value,
                                  },
                                });
                              }}
                            /> */}
                          </Col>

                          <Col md={6} lg={6} className="mt-20">
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
                              value={billingZipCode}
                              // disabled={billingZipCodeFound}
                              onChange={(e) => {
                                setBillingZipCode(e.target.value);
                              }}
                            />
                          </Col>

                          {/* <div
                          onClick={manualFieldsShippingHandler}
                          className="manualTrigger"
                        >
                          Set Address Manually
                        </div> */}
                        </>
                      </Row>
                    )}
                  </div>
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
                  disabled={
                    (mall_ID &&
                      mall_ID !== null &&
                      globalCartObject.length === 0) ||
                    onLoad === true
                      ? true
                      : false
                  }
                  onClick={(e) => {
                    if (!onLoad) {
                      saveUserDataHandler();
                      // history.push("/payment-selection"); // Change the route to /payment-method
                    }
                  }}
                  className={
                    mall_ID && mall_ID !== null && globalCartObject.length === 0
                      ? "disable-btn"
                      : "basic-btn"
                  }
                >
                  {onLoad === true ? "Please Wait..." : "Proceed to Payment"}
                </button>
              </div>
              {/* {is4gives && <p className="poweredQP">Powered by Qisstpay</p>} */}
            </div>
          </div>
        </div>
      </Container>

      {/* mall make this uncomment */}

      {/* {mall_ID === "" ? (
        ""
      ) : mall_ID === null ? ( */}
      {/* <Cart
        countryCode={countryCode}
        currency={currency}
        taxPrice={taxPrice}
        vaultPoints={"0"}
        processingFee={""}
        shippingPrice={"0"}
        totalAmount={totalAmount}
        productsObj={productsObj}
        discountedAmount={discountedAmount}
      /> */}
      {/* ) : (
        <Globalcart show={""} />
      )} */}
    </>
  );
};

export default UserDetailPage;
