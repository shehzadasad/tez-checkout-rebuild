import axios from "axios";
import { stat } from "fs";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { EAddressType } from "../../enums/address-type.enum";
import { isEmpty } from "../../helper/isEmpty";
import { setUserData } from "../../helper/setUserData";
import { IAddress } from "../../interfaces/address.interface";
import { IAddAddressOld } from "../../interfaces/apis/add-address.interface";
import { ISignup } from "../../interfaces/apis/signup-interface";
import { ICity } from "../../interfaces/city.interface";
import { ICountry } from "../../interfaces/country.interface";
import { IState } from "../../interfaces/state.interface";
import { routes } from "../../router/routes";
import { addressService } from "../../services/address.service";
import { locationService } from "../../services/location.service";
import { userService } from "../../services/user.service";
import { checkBlockCitiesHelper } from "../../utils/check-block-cities.helper";
import { Context as CheckoutContext } from "../context/checkoutContext";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../enums/GA-messages";

export const useUserDetailHook = () => {
  const {
    state: {},
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const {
    state: {
      name,
      lastName,
      address,
      city,
      email,
      billingAddress,
      billingCity,
      customerId,
      phoneNumber,
      emailValidated,
      countryCode,
      isGuest,
      intlNumber,
      MerchantUserId,
      isExistingUser,
      token,
      identityToken,
      time_stamp,
      totalAmount,
      discountedAmount,
      shippingPrice,
      taxPrice,
      productsObj,
      GoogleAnalyticsCred,
      currency,
      is4gives,
      is_headless,
      mall_ID,
      globalCartObject,
      rudderStackID,
      isEventsEnabled,
      checkout_anonymous_id,
    },
  } = useContext(CheckoutContext);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [cnic, setCnic] = useState<string>("");
  const [loadAddress, setLoadAddress] = useState<boolean>(true);
  const [loadEmail, setLoadEmail] = useState<boolean>(true);
  const [house, setHouse] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [cityFound, setCityFound] = useState<boolean>(true);
  const [stateFound, setStateFound] = useState<boolean>(true);
  const [zipFound, setZipFound] = useState<boolean>(true);
  const [countryFound, setCountryFound] = useState<boolean>(true);
  const [zipCode, setZipCode] = useState<string>("");
  const [shippingManual, setShippingManual] = useState<boolean>(false);
  const [billingFlag, setBillingFlag] = useState<boolean>(true);
  const [shippingFlag, setShippingFlag] = useState<boolean>(true);
  const [houseBilling, setHouseBilling] = useState<string>("");
  const [billingCityFound, setBillingCityFound] = useState<boolean>(true);
  const [billingState, setBillingState] = useState<string>("");
  const [billingStateFound, setBillingStateFound] = useState<boolean>(true);
  const [billingZipCode, setBillingZipCode] = useState<string>("");
  const [billingZipCodeFound, setBillingZipCodeFound] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [billingManual, setBillingManual] = useState<boolean>(false);
  const [country, setCountry] = useState<string>(
    is4gives ? "Philippines" : "Pakistan"
  );
  const [billingCountry, setBillingCountry] = useState<string>(
    is4gives ? "Philippines" : "Pakistan"
  );
  const [countryBillingFound, setCountryBillingFound] = useState<boolean>(true);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [shippingStates, setShippingStates] = useState<IState[]>([]);
  const [billingStates, setBillingStates] = useState<IState[]>([]);
  const [shippingCities, setShippingCities] = useState<ICity[]>([]);
  const [billingCities, setBillingCities] = useState<ICity[]>([]);
  const [shippingStateId, setShippingStateId] = useState<string>("");
  const [billingStateId, setBillingStateId] = useState<string>("");
  const [shippingCountryId, setShippingCountryId] = useState<string>(
    is4gives ? "175" : "168"
  );
  const [billingCountryId, setBillingCountryId] = useState<string>(
    is4gives ? "175" : "168"
  );
  const [clicked, setClicked] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    if (mall_ID && mall_ID !== null && globalCartObject.length === 0) {
      setError("Cart is empty. Can't proceed further - Please close checkout!");
    } else {
      setError("");
    }
  }, [globalCartObject]);

  useEffect(() => {
    getCountriesHandler();
  }, []);

  useEffect(() => {
    if (shippingCountryId != "") {
      getStatesHandler(shippingCountryId, state, "SHIPPING");
      setShippingCities([]);
    }
  }, [shippingCountryId, shippingStateId]);

  useEffect(() => {
    if (billingCountryId != "")
      getStatesHandler(billingCountryId, billingState, "BILLING");
  }, [billingCountryId]);

  useEffect(() => {
    if (shippingStateId != "") getCitiesHandler(shippingStateId, "SHIPPING");
  }, [shippingStateId]);

  useEffect(() => {
    if (billingStateId != "") getCitiesHandler(billingStateId, "BILLING");
  }, [billingStateId]);

  /**
   * @description set shipping to manual
   */
  const manualFieldsShippingHandler = () => {
    setCityFound(false);
    setStateFound(false);
    setZipFound(false);
    setShippingManual(true);
  };

  /**
   * @description set billing to manual
   */
  const manualFieldsBillingHandler = () => {
    setBillingCityFound(false);
    setBillingStateFound(false);
    setBillingZipCodeFound(false);
    setBillingManual(true);
  };

  /**
   * @description validate input (name & lastName) and update the context
   * @param e
   */
  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const re = /^[a-zA-Z ]*$/;
    if (e.target.value == "" || re.test(e.target.value)) {
      if (e.target.name == "name") {
        updateStateHandler({
          payload: {
            name: e.target.value,
          },
        });
      }
      if (e.target.name == "lastName") {
        updateStateHandler({
          payload: {
            lastName: e.target.value,
          },
        });
      }
    }
  };

  /**
   * @description change city handler
   * * trigger from location search component
   * @param event
   * @param zip
   * @param sta
   */
  const cityChangeHandler = (
    event: string,
    zip: string,
    sta: string,
    country: string,
    countryCode: string
  ) => {
    updateStateHandler({
      payload: {
        city: event != "" ? event : "",
      },
    });
    setCityFound(event != "");

    setZipCode(zip != "" ? zip : "");
    setZipFound(zip != "");
    setState(sta != "" ? sta : "");
    setStateFound(sta != "");
    setCountry(country ?? "");

    const countryIdIndex = countries.findIndex(
      (country) => country.iso2 == countryCode
    );
    if (countryIdIndex > -1) {
      setShippingCountryId(String(countries[countryIdIndex].countryId));
      getStatesHandler(
        String(countries[countryIdIndex].countryId),
        sta,
        "SHIPPING"
      );
    }
  };

  const getCountriesHandler = async () => {
    // const response = await locationService.getCountries();
    setCountries([
      {
        countryId: 168,
        name: "Pakistan",
        capital: "Islamabad",
        iso2: "PK",
        iso3: "PAK",
        emoji: "🇵🇰",
        emojiU: "U+1F1F5 U+1F1F0",
      },
      {
        countryId: 236,
        name: "United States",
        capital: "Washington",
        iso2: "US",
        iso3: "USA",
        emoji: "🇺🇸",
        emojiU: "U+1F1FA U+1F1F8",
      },
      {
        countryId: 175,
        name: "Philippines",
        capital: "Manila",
        iso2: "PH",
        iso3: "PHL",
        emoji: "🇵🇭",
        emojiU: "U+1F1F5 U+1F1ED",
      },
    ]);
    setClicked(false);
  };

  /**
   * @description change billing city handler
   * * trigger from location search component
   * @param event
   * @param zip
   * @param sta
   */
  const billingCityChangeHandler = (
    event: string,
    zip: string,
    sta: string,
    country: string,
    countryCode: string
  ) => {
    updateStateHandler({
      payload: {
        billingCity: event != "" ? event : "",
      },
    });
    setBillingCityFound(event != "");
    setBillingZipCode(zip != "" ? zip : "");
    setBillingZipCodeFound(zip != "");
    setBillingState(sta != "" ? sta : "");
    setBillingStateFound(sta != "");
    setBillingCountry(country ?? "");
    const countryIdIndex = countries.findIndex(
      (country) => country.iso2 == countryCode
    );
    if (countryIdIndex > -1)
      setBillingCountryId(String(countries[countryIdIndex].countryId) ?? "");
    getStatesHandler(
      String(countries[countryIdIndex].countryId),
      sta,
      "BILLING"
    );
  };

  /**
   * @description set checks for same billing address and update
   */
  const sameAsBillingAddressHandler = () => {
    setShippingFlag(true);
    setBillingFlag(false);
    updateStateHandler({
      payload: {
        billingAddress: "",
        billingCity: "",
      },
    });
  };

  /**
   * @description add new address of user
   * * hit add address api to save data
   */
  const addNewAddressHandler = async (name: string, phone: string) => {
    setOnLoad(true);
    let response: any;
    try {
      if (
        (isEmpty(address) || shippingManual) &&
        isEmpty(city) &&
        isEmpty(address) &&
        isEmpty(state) &&
        isEmpty(country) &&
        isEmpty(name) &&
        isEmpty(phone)
      ) {
        // const addressPayload: IAddAddressOld = {
        //   userId: Number(customerId),
        //   billingCity: billingFlag ? city : billingCity,
        //   billingState: billingFlag ? state : billingState,
        //   billingCountry: billingFlag ? country : billingCountry,
        //   billingZipCode: billingFlag ? zipCode : billingZipCode,
        //   billingAddress1: houseBilling + " " + billingAddress,
        //   billingAddress2: houseBilling + " " + billingAddress,
        //   shippingCity: city,
        //   shippingState: state,
        //   shippingCountry: country,
        //   shippingZipCode: zipCode,
        //   shippingAddress1: house + " " + address,
        //   shippingAddress2: house + " " + address,
        // };

        const addressPayload: IAddress = {
          name: name,
          phone_number: phone,
          city: city,
          state: state,
          country: country,
          zip: zipCode,
          address_1: house + " " + address,
          address_2: "",
          address_type: EAddressType.SHIPPING,
          is_default: true,
          rs_anonymous_id: rudderStackID,
        };
        if (checkBlockCitiesHelper(identityToken, city)) {
          setOnLoad(false);
          setError("Cannot place an order from your selected shipping city.");
          return;
        }
        let tkn: any = localStorage.getItem("JWTtoken");
        let iid: any = localStorage.getItem("JWTid");
        console.log("MALL ID: ", mall_ID);
        response = await addressService.addAddress(
          addressPayload,
          is_headless === "1" &&
            mall_ID === null &&
            tkn !== "null" &&
            iid !== "null"
            ? iid
            : customerId
            ? customerId
            : "",
          {
            headers: {
              Authorization: `Bearer ${tkn ? tkn : token ? token : ""}`,
              user_id: customerId,
              "X-API-Key": "abc123!",
            },
          }
        );

        updateStateHandler({
          payload: {
            country: response.country,
          },
        });

        history.push(routes.paymentSelectionPage);

        console.log(
          "=================================== ADDRESS RESPONSE: ",
          response
        );

        // --- Google Analytics --- //
        if (GoogleAnalyticsCred?.type === "UA") {
          console.log(
            "GoogleAnalyticsCred.tracking_id => ",
            GoogleAnalyticsCred?.tracking_id
          );
          ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
          ReactGA.event({
            category: "Button",
            action: GAMessages.NEW_ADDRESS,
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
            action: GAMessages.NEW_ADDRESS,
          });
        }
        // --- Google Analytics End --- //

        // if (response.success) {
        //   console.log("Added Address");
        //   history.push(routes.paymentSelectionPage);
        // } else {
        //   setError(response.message);
        //   setOnLoad(false);
        // }
      } else {
        // setError("Please fill all the fields");
        // setOnLoad(false);
        if (!isEmpty(name)) {
          setError("Please Enter Full Name");
        } else if (!isEmpty(intlNumber)) {
          setError("Please Enter Phone Number");
        } else if (!isEmpty(address)) {
          setError("Please Enter Address");
        } else if (!isEmpty(country)) {
          setError("Please Enter Country");
        } else if (!isEmpty(state)) {
          setError("Please Enter State");
        } else if (!isEmpty(city)) {
          setError("Please Enter City");
        }

        // setError("Please fill all the fields");
        setOnLoad(false);
      }
    } catch (error: any) {
      console.log(
        "=================================== ADDRESS RESPONSE: ",
        response
      );
      setError(
        error?.response?.data?.service_response.message ??
          error.response.data.service_response.message
      );
      setOnLoad(false);
    }
  };

  const updateNewAddressHandler = async (editAddress: any) => {
    if (
      (isEmpty(address) || shippingManual) &&
      isEmpty(editAddress.city) &&
      isEmpty(address) &&
      isEmpty(editAddress.state) &&
      isEmpty(editAddress.country) &&
      isEmpty(editAddress.zip) &&
      isEmpty(editAddress.name) &&
      isEmpty(editAddress.phone_number)
    ) {
      const addressPayload: IAddress = {
        name: editAddress.name,
        phone_number: editAddress.phone_number,
        city: editAddress.city,
        state: editAddress.state,
        country: editAddress.country,
        zip: editAddress.zip,
        address_1: house + " " + address,
        address_2: "",
        address_type: EAddressType.SHIPPING,
        is_default: editAddress.is_default,
        id: editAddress.id,
        rs_anonymous_id: rudderStackID,
      };

      let response: any;
      if (checkBlockCitiesHelper(identityToken, editAddress.city)) {
        setOnLoad(false);
        setError("Cannot place an order from your selected shipping city.");
        return;
      }
      response = await addressService.updateAddress(
        addressPayload,
        customerId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: customerId,
            "X-API-Key": "abc123!",
          },
        }
      );

      if (response) {
        updateStateHandler({
          payload: {
            country: response.country,
          },
        });

        // --- Google Analytics --- //
        if (GoogleAnalyticsCred?.type === "UA") {
          console.log(
            "GoogleAnalyticsCred.tracking_id => ",
            GoogleAnalyticsCred?.tracking_id
          );
          ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
          ReactGA.event({
            category: "Button",
            action: GAMessages.EDIT_ADDRESS,
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
            action: GAMessages.EDIT_ADDRESS,
          });
        }
        // --- Google Analytics End --- //
      }

      return response;
    } else {
      // setError("Please fill all the fields");
      // setOnLoad(false);
      if (!isEmpty(editAddress.name)) {
        setError("Please Enter Full Name");
      } else if (!isEmpty(editAddress.phone_number)) {
        setError("Please Enter Phone Number");
      } else if (!isEmpty(address)) {
        setError("Please Enter Address");
      } else if (!isEmpty(editAddress.country)) {
        setError("Please Enter Country");
      } else if (!isEmpty(editAddress.state)) {
        setError("Please Enter State");
      } else if (!isEmpty(editAddress.city)) {
        setError("Please Enter City");
      }

      // setError("Please fill all the fields");
      setOnLoad(false);
    }
  };

  //Checking Email Validation//
  function ValidateEmail(email: any): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false;
    }
    return true;
  }
  //Checking Email Validation END//

  /**
   * @description save user data
   * * hit sign up api to save data
   * * update context data basis of conditions
   * * if email validation true (redirect to payment screen)
   * * if email validation false (redirect to email otp screen)
   */
  const saveUserDataHandler = async () => {
    updateStateHandler({
      payload: {
        phoneNumber: intlNumber,
      },
    });
    setOnLoad(true);
    let updatedState = {
      token: token,
      customerId,
      billingAddress: "",
      billingCity: "",
      billingCountry: "",
      address: "",
      city: "",
      country: "",
      name: "",
      lastName: "",
      shippingCity: "",
      shippingCountry: "",
      state: "",
      billingZip: "",
      billingState: "",
      zipCode: "",
      shippingZip: "",
    };
    let segmentId = "12";
    if (typeof (global as any)?.rudderanalytics?.user == "function") {
      segmentId = (global as any)?.rudderanalytics?.user()?.anonymousId();
    }
    console.log("abc2");
    try {
      setOnLoad(true);
      if (
        isEmpty(name) &&
        isEmpty(lastName) &&
        (isEmpty(address) || shippingManual) &&
        isEmpty(city) &&
        isEmpty(email) &&
        isEmpty(cnic) &&
        isEmpty(phoneNumber) &&
        !ValidateEmail(email) &&
        isEmpty(address) &&
        isEmpty(state) &&
        isEmpty(country) &&
        (billingFlag ||
          ((isEmpty(billingAddress) || billingManual) &&
            isEmpty(billingCity) &&
            isEmpty(billingCountry) &&
            isEmpty(billingState)))
        // (shippingFlag ||
        //   ((isEmpty(billingAddress) || billingManual) && isEmpty(billingCity)))
      ) {
        setError("");
        if (checkBlockCitiesHelper(identityToken, city)) {
          setOnLoad(false);
          setError("Cannot place an order from your selected shipping city.");
          return;
        }
        console.log(country, state, city);

        //TODO: check lineAddressOne and Two keys
        const signupPayload: ISignup = {
          checkout_anonymous_id: checkout_anonymous_id,
          isEventsEnabled: isEventsEnabled,
          segmentId: segmentId,
          user: {
            email,
            firstName: name,
            lastName,
            phoneNumber: intlNumber,
            isGuest,
            cnic,
          },
          shipping: {
            cityName: city,
            stateName: state,
            countryName: country,
            zip: zipCode,
            addressLineOne: house + " " + address,
            addressLineTwo: house + " " + address,
          },
          billing: {
            cityName: billingFlag ? city : billingCity,
            stateName: billingFlag ? state : billingState,
            countryName: billingFlag ? country : billingCountry,
            zip: billingFlag ? zipCode : billingZipCode,
            addressLineOne: billingFlag
              ? house + " " + address
              : houseBilling + " " + billingAddress,
            addressLineTwo: billingFlag
              ? house + " " + address
              : houseBilling + " " + billingAddress,
          },
          rs_anonymous_id: rudderStackID,
        };

        const addressPayload: IAddAddressOld = {
          userId: Number(customerId),
          billingCity: billingFlag ? city : billingCity,
          billingState: billingFlag ? state : billingState,
          billingCountry: billingFlag ? country : billingCountry,
          billingZipCode: billingFlag ? zipCode : billingZipCode,
          billingAddress1: billingFlag
            ? house + " " + address
            : houseBilling + " " + billingAddress,
          billingAddress2: billingFlag
            ? house + " " + address
            : houseBilling + " " + billingAddress,
          shippingCity: city,
          shippingState: state,
          shippingCountry: country,
          shippingZipCode: zipCode,
          shippingAddress1: house + " " + address,
          shippingAddress2: house + " " + address,
        };

        const billingAddressPayload: IAddress = {
          name: name,
          phone_number: intlNumber,
          address_1: billingFlag
            ? house + " " + address
            : houseBilling + " " + billingAddress,
          address_2: billingFlag
            ? house + " " + address
            : houseBilling + " " + billingAddress,
          city: billingFlag ? city : billingCity,
          zip: billingFlag ? zipCode : billingZipCode,
          state: billingFlag ? state : billingState,
          country: billingFlag ? country : billingCountry,
          address_type: EAddressType.BILLING,
          is_default: true,
          rs_anonymous_id: rudderStackID,
        };

        const shippingAddressPayload: IAddress = {
          name: name,
          phone_number: intlNumber,
          address_1: house + " " + address,
          address_2: house + " " + address,
          city: city,
          zip: zipCode,
          state: state,
          country: country,
          address_type: EAddressType.SHIPPING,
          is_default: true,
          rs_anonymous_id: rudderStackID,
        };

        //TODO: have to change the address api resposnes
        let response: any;
        let redirect: boolean = false;
        if (isExistingUser === true) {
          response = await addressService.addAddress(
            billingAddressPayload,
            customerId,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                user_id: customerId,
                "X-API-Key": "abc123!",
              },
            }
          );
          console.log("abc2");
          response = await addressService.addAddress(
            shippingAddressPayload,
            customerId,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                user_id: customerId,
                "X-API-Key": "abc123!",
              },
            }
          );
          response.status = true;
          redirect = true;
        } else {
          console.log("abc3");
          response = await userService.signUp(signupPayload, {
            headers: {
              "identity-token": identityToken,
            },
          });
        }
        console.log(response.data.userId, "response");

        (global as any).rudderanalytics?.track(
          "signup_form_submit",
          {},
          {
            time_stamp: time_stamp,
            user_id: customerId,
            entered_number: intlNumber,
            merchant_id: MerchantUserId,
            anonymousId: rudderStackID,
            entered_info: signupPayload,
          }
        );
        if (response.success) {
          if (isGuest === true || isExistingUser === false) {
            // --- Google Analytics --- //
            if (GoogleAnalyticsCred?.type === "UA") {
              console.log(
                "GoogleAnalyticsCred.tracking_id => ",
                GoogleAnalyticsCred?.tracking_id
              );
              ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
              ReactGA.event({
                category: "Event",
                action: GAMessages.GUEST_USER,
              });
            }

            if (GoogleAnalyticsCred?.type === "GA4") {
              console.log(
                "GoogleAnalyticsCred.measurement_id => ",
                GoogleAnalyticsCred?.measurement_id
              );
              ReactGA4.initialize(GoogleAnalyticsCred?.measurement_id);
              ReactGA4.event({
                category: "Event",
                action: GAMessages.GUEST_USER,
              });
            }
            // --- Google Analytics End --- //
            // try {
            //   await axios
            //     .put(
            //       `${process.env.REACT_APP_ABANDONED_CART_URL}/ms-web-external-apis/session/update`,
            //       {
            //         userId: response.data.userId,
            //         phoneNumber: intlNumber,
            //         sessionId: cartSessionID,
            //         json: JSON.stringify({
            //           sessionID: cartSessionID.toString(),
            //           date: new Date(),
            //           email: email,
            //           abandonedStep: "Sign Up",
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
            //           billingDetails: {
            //             name: name,
            //             phone_number: intlNumber,
            //             address_1: billingFlag
            //               ? house + " " + address
            //               : houseBilling + " " + billingAddress,
            //             address_2: billingFlag
            //               ? house + " " + address
            //               : houseBilling + " " + billingAddress,
            //             city: billingFlag ? city : billingCity,
            //             zip: billingFlag ? zipCode : billingZipCode,
            //             state: billingFlag ? state : billingState,
            //             country: billingFlag ? country : billingCountry,
            //             address_type: "Billing",
            //           },
            //           shippingDetails: {
            //             name: name,
            //             phone_number: intlNumber,
            //             address_1: house + " " + address,
            //             address_2: house + " " + address,
            //             city: city,
            //             zip: zipCode,
            //             state: state,
            //             country: country,
            //             address_type: "Shipping",
            //           },
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
          }

          setTimeout(() => {
            setOnLoad(false);

            if (!isExistingUser) {
              updatedState.token = response.data.token;
              updatedState.customerId = response.data.userId.toString();
              addressService.addAddress(
                shippingAddressPayload,
                response?.data?.userId,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    user_id: response.data.userId,
                    "X-API-Key": "abc123!",
                  },
                }
              );
            }

            //TODO: update the state arg in setUserData
            updatedState = {
              ...updatedState,
              ...setUserData(
                name,
                lastName,
                address,
                city,
                country,
                billingFlag,
                billingAddress,
                billingCity,
                billingCountry,
                state,
                city,
                country
              ),
            };
            updatedState = {
              ...updatedState,
              shippingCity: city,
              state: state,
              shippingCountry: country,
            };
            if (billingFlag) {
              updatedState = {
                ...updatedState,
                billingZip: zipCode,
                billingState: state,
                billingCity: city,
                billingAddress: house + " " + address,
                billingCountry: country,
                country: country,
                state: state,
                zipCode: zipCode,
                shippingZip: zipCode,
              };
            } else {
              updatedState = {
                ...updatedState,
                billingZip: billingZipCode,
                billingState: billingState,
                billingCity: billingCity,
                billingAddress: houseBilling + " " + billingAddress,
                billingCountry: billingCountry,
                country: country,
                state: state,
                zipCode: zipCode,
                shippingZip: zipCode,
              };
            }
            updateStateHandler({
              payload: {
                ...updatedState,
                zipCode: billingFlag ? zipCode : billingZipCode,
              },
            });
            // if (emailValidated) {
            //   updateStateHandler({
            //     ...updatedState,
            //   });
            //   history.push(routes.paymentSelectionPage);
            // } else {
            //   updateStateHandler({
            //     ...updatedState,
            //     emailValidation: true,
            //   });
            //   history.push(routes.emailOtpPage);
            // }
            history.push(routes.paymentSelectionPage);
          }, 500);
        } else {
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
          //           abandonedStep: "Sign Up",
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
          //           billingDetails: {
          //             name: name,
          //             phone_number: intlNumber,
          //             address_1: billingFlag
          //               ? house + " " + address
          //               : houseBilling + " " + billingAddress,
          //             address_2: billingFlag
          //               ? house + " " + address
          //               : houseBilling + " " + billingAddress,
          //             city: billingFlag ? city : billingCity,
          //             zip: billingFlag ? zipCode : billingZipCode,
          //             state: billingFlag ? state : billingState,
          //             country: billingFlag ? country : billingCountry,
          //             address_type: "Billing",
          //           },
          //           shippingDetails: {
          //             name: name,
          //             phone_number: intlNumber,
          //             address_1: house + " " + address,
          //             address_2: house + " " + address,
          //             city: city,
          //             zip: zipCode,
          //             state: state,
          //             country: country,
          //             address_type: "Shipping",
          //           },
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
          setError(response.message);
          setOnLoad(false);
        }
      } else {
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
        //           key: "email",
        //           value: email,
        //           abandonedStep: "Sign Up",
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
        //           billingDetails: {
        //             name: name,
        //             phone_number: intlNumber,
        //             address_1: billingFlag
        //               ? house + " " + address
        //               : houseBilling + " " + billingAddress,
        //             address_2: billingFlag
        //               ? house + " " + address
        //               : houseBilling + " " + billingAddress,
        //             city: billingFlag ? city : billingCity,
        //             zip: billingFlag ? zipCode : billingZipCode,
        //             state: billingFlag ? state : billingState,
        //             country: billingFlag ? country : billingCountry,
        //             address_type: "Billing",
        //           },
        //           shippingDetails: {
        //             name: name,
        //             phone_number: intlNumber,
        //             address_1: house + " " + address,
        //             address_2: house + " " + address,
        //             city: city,
        //             zip: zipCode,
        //             state: state,
        //             country: country,
        //             address_type: "Shipping",
        //           },
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
        // setError("Please fill all the fields");
        // setOnLoad(false);
        if (!isEmpty(email)) {
          setError("Please Enter Email");
        } else if (ValidateEmail(email)) {
          setError("Please Enter Valid Email");
        } else if (!isEmpty(name)) {
          setError("Please Enter First Name");
        } else if (lastName == "") {
          setError("Please Enter Last Name");
        } else if (intlNumber == "") {
          setError("Please Enter Phone Number");
        } else if (!isEmpty(address)) {
          setError("Please Enter Address");
        } else if (!isEmpty(cnic)) {
          setError("Please Enter Cnic");
        } else if (!isEmpty(country)) {
          setError("Please Enter Country");
        } else if (shippingStates.length !== 0 && !isEmpty(state)) {
          setError("Please Enter State");
        } else if (shippingCities.length !== 0 && !isEmpty(city)) {
          setError("Please Enter City");
        } else if (!isEmpty(billingAddress)) {
          setError("Please Enter Billing Address");
        } else if (!isEmpty(billingCountry)) {
          setError("Please Enter Billing Country");
        } else if (!isEmpty(billingState)) {
          setError("Please Enter Billing State");
        } else if (!isEmpty(billingCity)) {
          setError("Please Enter Billing City");
        } else if (!isEmpty(billingZipCode)) {
          setError("Please Enter Billing Postal Code");
        }

        // setError("Please fill all the fields");
        setOnLoad(false);
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
      //           key: "email",
      //           value: email,
      //           abandonedStep: "Sign Up",
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
      //           billingDetails: {
      //             name: name,
      //             phone_number: intlNumber,
      //             address_1: billingFlag
      //               ? house + " " + address
      //               : houseBilling + " " + billingAddress,
      //             address_2: billingFlag
      //               ? house + " " + address
      //               : houseBilling + " " + billingAddress,
      //             city: billingFlag ? city : billingCity,
      //             zip: billingFlag ? zipCode : billingZipCode,
      //             state: billingFlag ? state : billingState,
      //             country: billingFlag ? country : billingCountry,
      //             address_type: "Billing",
      //           },
      //           shippingDetails: {
      //             name: name,
      //             phone_number: intlNumber,
      //             address_1: house + " " + address,
      //             address_2: house + " " + address,
      //             city: city,
      //             zip: zipCode,
      //             state: state,
      //             country: country,
      //             address_type: "Shipping",
      //           },
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
      setOnLoad(false);
      updatedState = {
        ...updatedState,
        //TODO: update the state arg in setUserData
        ...setUserData(
          name,
          lastName,
          address,
          city,
          countryCode,
          billingFlag,
          billingAddress,
          billingCity,
          billingCountry,
          state,
          city,
          country
        ),
      };
      updateStateHandler(updatedState);
    }
  };

  /**
   * @description find the country using iso and update shipping country and iso
   * @param iso
   */
  const findShippingCountryByIdHandler = (id: string) => {
    //States
    setState("");
    setShippingStateId("");

    //Citites
    updateStateHandler({
      payload: {
        city: "",
      },
    });
    setShippingCities([]);

    const index = countries.findIndex((el) => String(el.countryId) == id);
    let name = "";
    if (index > -1) {
      setCountry(countries[index].name);
      name = countries[index].name;
      setShippingCountryId(String(countries[index].countryId));
    }
    return name;
  };

  /**
   * @description find the country using iso and update the billing country and iso
   * @param iso
   */
  const findBillingCountryByIdHandler = (id: string) => {
    const index = countries.findIndex((el) => String(el.countryId) == id);
    if (index > -1) {
      setBillingCountry(countries[index].name);
      setBillingCountryId(String(countries[index].countryId));
    }
  };

  /**
   * @description find the state using stateCode and update shipping state and iso
   * @param iso
   */
  const findShippingStateByIdHandler = (id: string) => {
    //Citites
    updateStateHandler({
      payload: {
        city: "",
      },
    });
    setShippingCities([]);

    const index = shippingStates.findIndex((el) => String(el.stateId) == id);
    let name = "";
    if (index > -1) {
      setState(shippingStates[index].name);
      updateStateHandler({
        payload: {
          state: shippingStates[index].name,
          country: country,
          city: city,
        },
      });
      name = shippingStates[index].name;
      setShippingStateId(String(shippingStates[index].stateId));
    }
    return name;
  };

  /**
   * @description find the state using stateCode and update the billing state and iso
   * @param iso
   */
  const findBillingStateByIdHandler = (id: string) => {
    const index = billingStates.findIndex((el) => String(el.stateId) == id);
    if (index > -1) {
      setBillingState(billingStates[index].name);
      setBillingStateId(String(billingStates[index].stateId));
    }
  };

  /**
   * @description get states from api on the basis of country id
   * @param countryId
   */
  const getStatesHandler = async (
    countryId: string,
    thisState: string,
    type: string
  ) => {
    // console.log("yaahaaan ata bhai nc")
    // console.log(thisState)

    const response = await locationService.getStates(countryId);
    // console.log(thisState)
    // console.log("state")
    if (type == "SHIPPING") {
      const stateIdIndex = response.data.states.findIndex(
        (states) => states.name == thisState
      );
      if (stateIdIndex > -1) {
        // console.log("found state on name")
        // console.log(stateIdIndex)
        // console.log(String(response.data.states[stateIdIndex].stateId ))

        setShippingStateId(String(response.data.states[stateIdIndex].stateId));
      }
      setShippingStates([...response.data.states]);
    } else {
      const stateIdIndex = response.data.states.findIndex(
        (states) => states.name == thisState
      );
      if (stateIdIndex > -1) {
        // console.log("found state on name")
        // console.log(stateIdIndex)
        // console.log(stateIdIndex)
        setBillingStateId(String(response.data.states[stateIdIndex].stateId));
      }
      setBillingStates([...response.data.states]);
    }
  };

  const getCitiesHandler = async (stateId: string, type: string) => {
    const response = await locationService.getCities(stateId);
    if (type == "SHIPPING") {
      // console.log("found cities")
      const cityIdIndex = response.data.cities.findIndex(
        (cities) => cities.name.toLocaleLowerCase() == city.toLocaleLowerCase()
      );
      if (cityIdIndex > -1) {
        // console.log("found city on name")
        // console.log(cityIdIndex)
        // console.log(cityIdIndex)
        updateStateHandler({
          payload: {
            city: String(response.data.cities[cityIdIndex].name),
          },
        });
      }
      setShippingCities([...response.data.cities]);
    } else {
      const cityIdIndex = response.data.cities.findIndex(
        (cities) => cities.name == city
      );
      if (cityIdIndex > -1) {
        // console.log("found city on name")
        // console.log(cityIdIndex)
        // console.log(cityIdIndex)
        updateStateHandler({
          payload: {
            billingCity: String(response.data.cities[cityIdIndex].name),
          },
        });
      }

      setBillingCities([...response.data.cities]);
    }
  };

  return {
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
      shippingManual,
      billingFlag,
      shippingFlag,
      houseBilling,
      billingCityFound,
      billingState,
      billingStateFound,
      billingZipCode,
      billingZipCodeFound,
      error,
      country,
      countryFound,
      billingCountry,
      countryBillingFound,
      countries,
      shippingCities,
      billingCities,
      shippingStates,
      billingStates,
      shippingCountryId,
      billingCountryId,
      shippingStateId,
      billingStateId,
      cnic,
    },
    setStates: {
      setLoadMore,
      setOnLoad,
      setLoadAddress,
      setLoadEmail,
      setHouse,
      setCityFound,
      setZipFound,
      setStateFound,
      setState,
      setZipCode,
      setShippingManual,
      setBillingFlag,
      setShippingFlag,
      setHouseBilling,
      setBillingCityFound,
      setBillingState,
      setBillingStateFound,
      setBillingZipCode,
      setBillingZipCodeFound,
      setError,
      setCountry,
      setCountryFound,
      setBillingCountry,
      setCountryBillingFound,
      setCountries,
      setClicked,
      setShippingCountryId,
      setCnic,
    },
    handlers: {
      manualFieldsShippingHandler,
      inputChangeHandler,
      manualFieldsBillingHandler,
      cityChangeHandler,
      billingCityChangeHandler,
      sameAsBillingAddressHandler,
      saveUserDataHandler,
      getCountriesHandler,
      findShippingCountryByIdHandler,
      findBillingCountryByIdHandler,
      findShippingStateByIdHandler,
      findBillingStateByIdHandler,
      addNewAddressHandler,
      getStatesHandler,
      updateNewAddressHandler,
    },
  };
};
