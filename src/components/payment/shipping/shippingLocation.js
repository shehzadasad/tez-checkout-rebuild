import { React, useEffect, useState } from "react";
import { Container, Form, Row, Col, Modal, Button } from "react-bootstrap";
import "react-intl-tel-input/dist/main.css";
import "../../../styles/checkout.css";
import { Context as CheckoutContext } from "../../../hooks/context/checkoutContext";
import MenuItem from "@mui/material/MenuItem";
import { useContext } from "react";
import { Chip, TextField } from "@mui/material";
import CurrencyFormat from "react-currency-format";
import axios, { get } from "axios";
import { routes } from "../../../router/routes";
import { useHistory } from "react-router-dom";
import { checkBlockCitiesHelper } from "../../../utils/check-block-cities.helper";
import { addressService } from "../../../services/address.service";
import { useUserDetailHook } from "../../../hooks/custom/useUserDetail";
import { usePaymentSelectionHook } from "../../../hooks/custom/usePaymentSelection";
import LocationSearchInput from "../../location/AutoPlaceComponent";
import { getCurrencySymbol } from "../../../utils/get-currency-symbol.helper";
import ReactGA4 from "react-ga4";
import ReactGA from "react-ga";
import { GAMessages } from "../../../enums/GA-messages";
import { number } from "mathjs";

export function ShippingAddress(props) {
  const [loadShipping, setLoadShipping] = useState(true);
  const [loadAddress, setLoadAddress] = useState(false);
  const [billingFlag, setBillingFlag] = useState(true);
  const history = useHistory();

  // const [currency, setCurrency] = useState("");
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingArr, setShippingArr] = useState([]);
  const [billingArr, setBillingArr] = useState([]);
  const [mapit, setMapit] = useState(false);
  // const [shippingName, setShippingName] = useState("");
  const [addressName, setAddressName] = useState(props.address);
  const [selected, setSelected] = useState("");
  const [selectedAdd, setSelectedAdd] = useState(null);
  const [editedAdd, setEditedAdd] = useState(null);

  const {
    state: {
      shippingDetails,
      shippingPrice,
      shippingName,
      shippingValidate,
      currency,
      encrypted,
      identityToken,
      user_type,
      customerId,
      token,
      selectedShipping,
      platForm_bigCommerce,
      GoogleAnalyticsCred,
      totalAmount,
      discountedAmount,
      taxPrice,
      processingFee,
      newShippingDetails,
      is_headless,
      mall_ID,
      time_stamp,
      rudderStackID,
      userID,
      MerchantUserId,
      shippingAddress,
      line_items,
      wordUrl,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const {
    states: {
      house,
      countries,
      shippingStates,
      shippingCities,
      shippingCountryId,
      shippingStateId,
    },
    setStates: { setHouse, setAddress, setShippingCountryId },
    handlers: {
      cityChangeHandler,
      findShippingCountryByIdHandler,
      findShippingStateByIdHandler,
      updateNewAddressHandler,
      getStatesHandler,
    },
  } = useUserDetailHook();

  const {
    handlers: { BigCommerceShippingMethods },
  } = usePaymentSelectionHook();
  useEffect(() => {
    // if (props?.address != "") {
    let shippingArray = [];
    let selectedAddress = null;
    if (props.shippingAddress != undefined) {
      props.shippingAddress.map((singleAdd) => {
        shippingArray.push(singleAdd);
        if (singleAdd.is_default) {
          if (singleAdd.country.toLocaleUpperCase() === "UNITED STATES") {
            if (singleAdd.phone_number.charAt(0) === "1") {
              localStorage.setItem(
                "defaultNumber",
                singleAdd.phone_number.slice(1)
              );
            } else {
              localStorage.setItem(
                "defaultNumber",
                singleAdd.phone_number.replace(/[()\s-]/g, "")
              );
            }
          }
          selectedAddress = singleAdd;
        } else {
          localStorage.removeItem("defaultNumber");
        }

        // if (singleAdd.shipping != null) {
        //   shippingArray.push(singleAdd.shipping);
        // }
      });
      setShippingArr([...shippingArray]);
    }

    setAddressName(props.address);
    setSelectedAdd(selectedAddress);
    setAddressName(selectedAddress?.address_1 ?? "");
    // }
    if (props.from == "review") {
      setAddressName(props.shippingAdd);
    }

    setBillingArr(props.encrypted);
  }, [props.shippingAddress]);
  const [addressChanged, setAddressChanged] = useState(false);

  useEffect(() => {
    if (props?.setAddressChanged) props?.setAddressChanged(true);
  }, [addressName]);
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    if (selectedAdd) {
      updateStateHandler({
        payload: {
          address: selectedAdd.address_1,
          city: selectedAdd.city,
          country: selectedAdd.country,
          state: selectedAdd.state,
          shippingCity: selectedAdd.city,
          shippingCountry: selectedAdd.country,
          selectedShipping: selectedAdd,
        },
      });
      BigCommerceShippingMethods(
        selectedAdd.country === "United States" ? "US" : "PK"
      );
    }
  }, [selectedAdd]);
  const [totalTaxAmountMall, setTotalTaxAmountMall] = useState(0);
  // need to rmv
  //   const [dataToIni, setdataToIni] = useState(
  //    [ {
  //     "success": true,
  //     "message": "success",
  //     "data": [
  //         {
  //             "taxes": [{
  //               "id": 59,
  //               "merchantId": 768624,
  //               "ruleName": "test",
  //               "description": "test",
  //               "country": "Pakistan",
  //               "region": "[\"Balochistan\",\"Azad Kashmir\",\"Gilgit-Baltistan\",\"Federally Administered Tribal Areas\",\"Islamabad Capital Territory\",\"Khyber Pakhtunkhwa\",\"Punjab\",\"Sindh\"]",
  //               "taxPercentage": 10.0,
  //               "shippingTax": false,
  //               "product_id_key":[47715105997083]
  //           }],
  //             "shipping": [
  //                 {
  //                     "merchantName": "ABC Mall",
  //                     "merchantUserID": 768624,
  //                     "shippingCategories": [
  //                         {
  //                             "title": "1st of qiestpay",
  //                             "fee": 10.0,
  //                             "ruleTitle": null
  //                         },
  //                         {
  //                           "title": "2nd of qiestpay",
  //                           "fee": 45.0,
  //                           "ruleTitle": null
  //                       }
  //                     ]
  //                 }
  //             ]
  //         },
  //         {
  //             "taxes": [ {
  //               "id": 17,
  //               "merchantId": 123,
  //               "ruleName": "test",
  //               "description": "test",
  //               "country": "Pakistan",
  //               "region": "[\"Balochistan\",\"Azad Kashmir\",\"Gilgit-Baltistan\",\"Federally Administered Tribal Areas\",\"Islamabad Capital Territory\",\"Khyber Pakhtunkhwa\",\"Punjab\",\"Sindh\"]",
  //               "taxPercentage": 10.0,
  //               "shippingTax": false,
  //               "product_id_key":[47715069198619]
  //           }],
  //             "shipping": [
  //                 {
  //                     "merchantName": "test",
  //                     "merchantUserID": 123,
  //                     "shippingCategories": [
  //                         {
  //                             "title": "first shipping 1",
  //                             "fee": 23.0,
  //                             "ruleTitle": null
  //                         },
  //                         {
  //                           "title": "first shipping 2",
  //                           "fee": 76.0,
  //                           "ruleTitle": null
  //                       }
  //                     ]
  //                 }
  //             ]
  //         }
  //     ]
  // }]
  // )
  //
  const [shippingTax, setShippingTax] = useState(0);
  const GlobalCartShipping = async () => {
    updateStateHandler({
      payload: {
        shippingPrice: 0,
        taxPrice: 0,
      },
    });
    const urlParams = new URLSearchParams(wordUrl);
    const shippingTootal = urlParams.get("shipping_total");
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch(
        `${process.env.REACT_APP_WEB_EXTERNAL_MS_API_KEY}/v1/1cc/v3/merchant/taxes`,
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            merchants: [
              {
                identity_token: identityToken,
                products: line_items,
                address: {
                  city: selectedAdd.city,
                  state: selectedAdd.state,
                  country: selectedAdd.country,
                  address: selectedAdd.address_1,
                },
              },
            ],
            isMobile: isMobileUrl ? isMobileUrl : false,
          }),
        }
      )
        .then((response) => response.json())
        .then((response) => {
          {
            if (urlTax !== "0" || shippingTootal !== "0") {
              if (response) {
                setselectedMerchants([
                  {
                    title:
                      response[0].data[0].shipping[0].shippingCategories[0]
                        .title,
                    cost: shippingTootal,
                    merchant_user_name:
                      response[0].data[0].shipping[0].merchantName,
                    merchant_user_id:
                      response[0].data[0].shipping[0].merchantUserID,
                  },
                ]);
                updateStateHandler({
                  payload: {
                    selectedMerchants: selectedMerchants,
                  },
                });
              }
            } else if (response) {
              setShippingData(response);
              updateStateHandler({
                payload: {
                  shippingdetailsAPI: response,
                },
              });
              updateStateHandler({
                payload: {
                  selectedMerchants: [],
                },
              });
              // setShippingData(dataToIni);

              // const tax = response?.map((element) => element.data.taxes[0]);
              // let totalTaxPercentage = 0;
              // for (let i = 0; i < tax.length; i++) {
              //   totalTaxPercentage += tax[i].taxPercentage;
              // }
              const taxAmount = (16 / 100) * totalAmount;
              // updateStateHandler({
              //   payload: {
              //     taxPrice: taxAmount,
              //   },
              // });
              setAddressChanged(false);

              if (response) {
                if (
                  platForm_bigCommerce?.toLocaleUpperCase() === "BIGCOMMERCE"
                ) {
                  if (
                    shippingAddress.country.toLocaleUpperCase() ===
                    "UNITED STATES"
                  )
                    BigCommerceShippingMethods("US");
                  else {
                    BigCommerceShippingMethods("PK");
                  }
                }

                if (response[0]?.data) {
                  // setWpShippingFlag(true);
                  // updateStateHandler({
                  //   payload: {
                  //     shippingDetails:
                  //       response[0]?.data?.shipping[0].shippingCategories,
                  //     // shippingPrice:
                  //     // response?.data?.shipping[0].shippingCategories?.fee == 0 ||
                  //     // response?.data?.shipping[0]?.shippingCategories.fee == ""
                  //     //   ? shippingTootal
                  //     //   :
                  //     // shippingTootal != "0" || shippingTootal != null
                  //     //   ? shippingTootal
                  //     //   : response[0]?.data?.shipping[0].shippingCategories[0]
                  //     //       .fee,
                  //     shippingName: response[0]?.data?.shipping[0]?.title,
                  //   },
                  // });
                  setShippingTax(
                    shippingTootal != "0" || shippingTootal != null
                      ? shippingTootal
                      : response[0]?.data?.shipping[0].shippingCategories[0].fee
                  );
                  if (
                    shippingPrice == 0 &&
                    response[0]?.data?.shipping[0].shippingCategories[0].fee ==
                      0
                  ) {
                    updateStateHandler({
                      payload: {
                        // shippingPrice: shippingTootal,
                      },
                    });
                  }
                } else {
                  console.log("res");

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
              } else {
                if (
                  platForm_bigCommerce?.toLocaleUpperCase() === "BIGCOMMERCE"
                ) {
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
            }
            updateStateHandler({
              payload: {
                // shippingPrice:
                //   response[0]?.data?.shipping[0].shippingCategories[0].fee,
                shippingName:
                  response[0]?.data?.shipping[0].shippingCategories[0].title,
                shippingValidate: true,
              },
            });
          }
        })
        .catch((error) => console.log("errorr", error));
    } catch (error) {
      console.log("errorr", error);
    }
  };
  useEffect(() => {
    // Step 2: Calculate total amount for each product in line_items
    const productAmounts = {};
    line_items.forEach((item) => {
      const { productID, amount } = item;
      productAmounts[productID] = (productAmounts[productID] || 0) + amount;
    });
    const mall_taxes = [];
    let totalTax = 0;
    shippingData[0]?.data?.forEach((response) => {
      response.taxes.forEach((tax) => {
        const productIDs = Array.isArray(tax.product_id_key)
          ? tax.product_id_key
          : [tax.product_id_key];
        const matchingProducts = productIDs?.filter((id) => productAmounts[id]);
        if (matchingProducts?.length > 0) {
          const totalAmount = matchingProducts.reduce(
            (acc, id) => acc + productAmounts[id],
            0
          );
          const taxAmount = (tax.taxPercentage / 100) * totalAmount;
          mall_taxes.push({
            merchant_user_id: tax.merchantId,
            tax_amount: taxAmount,
          });
          totalTax += taxAmount;
        }
      });
    });
    setTotalTaxAmountMall(totalTax);
    updateStateHandler({
      payload: {
        taxes: totalTaxAmountMall,
        taxPrice: totalTaxAmountMall,
        mall_taxes: mall_taxes,
      },
    });
  }, [shippingData, line_items]);

  const urlParams = new URLSearchParams(wordUrl);
  const shippingTootal = urlParams.get("shipping_total");
  const urlTax = urlParams.get("tax");
  const isMobileUrl = urlParams?.get("isMobile");

  // const shippingCalulation = (
  //   shippingArray,
  //   totalAmount,
  //   shippingInfo
  // ) => {
  //   // console.log("SHIPPING NEW METHDDSFDF : ");
  //   // console.log(shippingArray);
  //   // console.log(shippingInfo?.total_amount);
  //   // let total_amount = shippingInfo ? shippingInfo.total_amount : 0;
  //   let tA = totalAmount;
  //   // console.log("TA TOTAL AMOUNT");
  //   // console.log(tA);
  //   // ? props.totalAmount
  //   // : props.encrpted.total_amount;
  //   if (shippingArray != undefined && shippingArray != "") {
  //     var shippin = shippingArray;
  //     // console.log("SHHH");
  //     // console.log(shippin);
  //     let tempShippings = [];
  //     for (let i = 0; i < shippin.length; i++) {
  //       let tempShip = shippin[i];

  //       // console.log("temmpppppp ship aray");
  //       // console.log(tempShip);

  //       let userCity = shippingInfo?.city ?? city?.toLocaleLowerCase();
  //       // ? props.shippingCity.toLowerCase()
  //       // : props.encrpted.shipping_info
  //       // ? props.encrpted.shipping_info.city
  //       //   ? props.encrpted.shipping_info.city.toLowerCase()
  //       //   : null
  //       // : null;
  //       let userState = shippingInfo?.state ?? state?.toLocaleLowerCase();
  //       // ? props.state.toLowerCase()
  //       // : props.encrpted.shipping_info
  //       // ? props.encrpted.shipping_info.state
  //       //   ? props.encrpted.shipping_info.state.toLowerCase()
  //       //   : null
  //       // : null;

  //       let userCountry = shippingInfo?.country ?? country?.toLocaleLowerCase();
  //       // ? props.shippingCountry.toLowerCase()
  //       // : props.encrpted.shipping_info
  //       // ? props.encrpted.shipping_info.country
  //       //   ? props.encrpted.shipping_info.country.toLowerCase()
  //       //   : null
  //       // : null;
  //       // console.log("HELlllloooo");
  //       // console.log(userCity);
  //       // console.log(userState);
  //       // console.log(userCountry);
  //       let tempShipMin = tempShip.minAmount;
  //       let tempShipMax = tempShip.maxAmount;

  //       // console.log("USER CITY");
  //       // console.log(tempShip.cities);

  //       if (
  //         tempShipMax ||
  //         tempShipMax == 0 ||
  //         tempShipMin ||
  //         tempShipMin == 0
  //       ) {
  //         let max = tempShipMax ? tempShipMax : 99999999999;
  //         let min = tempShipMin ? tempShipMin : 0;
  //         if (tA <= min || tA > max) {
  //           continue;
  //         }
  //         // console.log("no continue");
  //       }

  //       if (tempShip.cities) {
  //         let citiess = tempShip.cities;
  //         let indexx = false;

  //         //Check cities
  //         for (let j = 0; j < citiess.length; j++) {
  //           // console.log(
  //           //   "IF == " +
  //           //     citiess[j].toLowerCase() +
  //           //     " == " +
  //           //     (userCity ? userCity.toLowerCase() : userCity)
  //           // );
  //           // console.log(
  //           //   citiess[j].toLowerCase() ==
  //           //     (userCity ? userCity.toLowerCase() : userCity)
  //           // );
  //           if (
  //             citiess[j].toLowerCase() ==
  //             (userCity ? userCity.toLowerCase() : userCity)
  //           ) {
  //             // console.log("IF CHECKED");
  //             indexx = true;
  //             break;
  //           }
  //         }
  //         // console.log("indexx" + indexx);

  //         //Check states
  //         if (!indexx) {
  //           if (!tempShip.cities || tempShip.cities.length < 1) {
  //             let statess = tempShip.states;

  //             for (let k = 0; k < statess.length; k++) {
  //               // console.log(
  //               //   "IF == " + statess[k].toLowerCase() + " == " + userState
  //               // );
  //               // console.log(statess[k].toLowerCase() == userState);
  //               if (statess[k].toLowerCase() == userState) {
  //                 // console.log("IF CHECKED");
  //                 indexx = true;
  //                 break;
  //               }
  //             }
  //           }
  //         }

  //         if (indexx) {
  //           // console.log("INDEX SUCCESSFUL");
  //           let flat_fee = tempShip.shippingFlatFee;

  //           let add_fee = (tempShip.shippingPercentFee * tA) / 100;
  //           // console.log("ADDDD FEEEEE = ");
  //           // console.log(tA);
  //           // console.log(encrypted);
  //           // console.log(tempShip.shippingPercentFee);
  //           // console.log(totalAmount ? totalAmount : encrypted.total_amount);
  //           // console.log(add_fee);
  //           // console.log("SHIPPPING COSTTT = " + (flat_fee + add_fee));
  //           tempShip.cost = Math.ceil(flat_fee + add_fee);

  //           tempShippings.push(tempShip);
  //         } else {
  //           if (
  //             (!tempShip.cities && !tempShip.states) ||
  //             (tempShip.cities &&
  //               tempShip.cities.length < 1 &&
  //               tempShip.states &&
  //               tempShip.states.length < 1)
  //           ) {
  //             if (tempShip.country) {
  //               if (tempShip.country.toLowerCase() == userCountry) {
  //                 let flat_fee = tempShip.shippingFlatFee;
  //                 let add_fee = (tempShip.shippingPercentFee * tA) / 100;
  //                 // console.log("SHIPPPING COSTTT = " + (flat_fee + add_fee));
  //                 tempShip.cost = Math.ceil(flat_fee + add_fee);
  //                 tempShippings.push(tempShip);
  //                 // console.log("2222+++++");
  //                 // console.log(tempShippings);
  //               }
  //             }
  //           }
  //         }
  //       } else {
  //         let shippingObj = {
  //           code: "",
  //           cost: "",
  //           title: "",
  //         };
  //         shippingObj.code = tempShip.code;
  //         shippingObj.cost = tempShip.flat_fee;
  //         shippingObj.title = tempShip.title;
  //         tempShippings.push(shippingObj);
  //       }
  //     }

  //     // setShippingMethods(tempShippings);
  //     updateStateHandler({
  //       payload: {
  //         shippingDetails: tempShippings,
  //       },
  //     });

  //     // console.log("TEMP SHIPPINGS : ");
  //     // console.log(tempShippings);
  //     if (tempShippings && tempShippings.length > 0) {
  //       updateStateHandler({
  //         payload: {
  //           shippingValidate: false,
  //         },
  //       });
  //     } else {
  //       // props.setTheShippingScreenNew(false);

  //       updateStateHandler({
  //         payload: {
  //           shippingPrice: shippingTootal,
  //           shippingValidate: true,
  //         },
  //       });
  //     }
  //     // if (window.location.pathname != "/failure") {
  //     if (tempShippings != undefined) {
  //       // console.log(tempShippings);
  //       cheapestShippingMethod(tempShippings);
  //     }
  //   } else {
  //     // shippingValidation(true);
  //     updateStateHandler({
  //       payload: {
  //         shippingValidate: true,
  //       },
  //     });
  //   }

  //   // updateStateHandler({
  //   //   payload: {
  //   //     shippingPrice: encrypted.shipping_amount,
  //   //   },
  //   // });
  // };
  // {
  //   "success": true,
  //   "message": "success",
  //   "data": {
  //       "taxes": [
  //           {
  //               "id": 59,
  //               "merchantId":2,
  //               "ruleName": "test",
  //               "description": "test",
  //               "country": "Pakistan",
  //               "region": "[\"Balochistan\",\"Azad Kashmir\",\"Gilgit-Baltistan\",\"Federally Administered Tribal Areas\",\"Islamabad Capital Territory\",\"Khyber Pakhtunkhwa\",\"Punjab\",\"Sindh\"]",
  //               "taxPercentage": 15.0,
  //               "shippingTax": false
  //           },
  //              {
  //               "id": 60,
  //               "merchantId":3,
  //               "ruleName": "test",
  //               "description": "test",
  //               "country": "Pakistan",
  //               "region": "[\"Balochistan\",\"Azad Kashmir\",\"Gilgit-Baltistan\",\"Federally Administered Tribal Areas\",\"Islamabad Capital Territory\",\"Khyber Pakhtunkhwa\",\"Punjab\",\"Sindh\"]",
  //               "taxPercentage": 15.0,
  //               "shippingTax": false
  //           }
  //       ],
  //       "shipping": [
  //         {"merchantID":3,
  //          "shippingCategories":[ {
  //               "title": "Standard Shipping",
  //               "fee": 150.0,
  //               "ruleTitle": null
  //           },
  //           {
  //               "title": "Standard Shipping",
  //               "fee": 150.0,
  //               "ruleTitle": null
  //           }]
  //         },
  //          {"merchantID":2,
  //          "shippingCategories":[ {
  //               "title": "Standard Shipping",
  //               "fee": 150.0,
  //               "ruleTitle": null
  //           },
  //           {
  //               "title": "Standard Shipping",
  //               "fee": 150.0,
  //               "ruleTitle": null
  //           }]
  //         }
  //       ]
  //   }
  // }
  useEffect(() => {
    // mall make this uncomment
    if (shippingTootal == 0 && urlTax == 0) {
      GlobalCartShipping();
    } else {
      GlobalCartShipping();
      updateStateHandler({
        payload: {
          shippingPrice: shippingTootal,
        },
      });
    }
  }, [selectedAdd]);

  useEffect(() => {
    if (window.location.pathname == "/failure") {
      updateStateHandler({
        payload: {
          shippingPrice: props.encrypted.shipping_amount,
          shippingName: props.encrypted.shipping_title,
          shippingValidate: true,
        },
      });
    }
  }, [billingArr]);
  const [selectedShippings, setSelectedShippings] = useState([]);
  const [disableButtonShipping, setDisableButtonShipping] = useState(0);
  const [selectedMerchants, setselectedMerchants] = useState([]);

  const handleChange = (cost, title, marName, marId) => {
    if (shippingData) {
      // const newSelection = { title, cost };
      // setSelectedShippings((prevSelections) => [
      //   ...prevSelections,
      //   newSelection,
      // ]);
      const floatcost = cost.toFixed(2);
      console.log(floatcost);
      const selectedItem = {
        title: title,
        cost: floatcost,
        merchant_user_name: marName,
        merchant_user_id: marId,
      };

      const index = selectedMerchants.findIndex(
        (item) => selectedItem.merchant_user_id == item.merchant_user_id
      );

      if (index > -1) {
        const marArray = [...selectedMerchants];
        marArray.splice(index, 1);

        setselectedMerchants([...marArray, selectedItem]);
        updateStateHandler({
          payload: {
            selectedMerchants: selectedMerchants,
          },
        });
      } else {
        // global.rudderanalytics?.track(
        //   "shipping_method_changed",
        //   {},
        //   {
        //     user_type: user_type,
        //     merchantId: marId,
        //     anonymousId: rudderStackID,
        //     user_id: customerId,
        //     new_method: {
        //       shippingPrice: cost,
        //       shippingName: title,
        //       shippingValidate: true,
        //     },
        //   }
        // );

        setselectedMerchants([...selectedMerchants, selectedItem]);

        updateStateHandler({
          payload: {
            selectedMerchants: selectedMerchants,
          },
        });
      }
    } else {
      updateStateHandler({
        payload: {
          shippingPrice: cost,
          shippingName: title,
          shippingValidate: true,
        },
      });
      if (window.location.pathname == "/failure") {
        console.log("CONSOLE LOG FAILURE");

        encrypted.shipping_amount = cost;
        encrypted.shipping_name = title;
      }
    }
  };
  useEffect(() => {
    updateStateHandler({
      payload: {
        selectedMerchants: selectedMerchants,
      },
    });
    selectedMerchants.forEach((e) => {
      const index = shippingData[0]?.data?.findIndex(
        (item) => item.shipping[0].merchantUserID == e.merchant_user_id
      );
      if (index > -1) {
        let totalCostShippindData = [...shippingData];
        totalCostShippindData[0].data[index].totalShippingCost = e.cost;
        setShippingData(totalCostShippindData);
        setDisableButtonShipping(disableButtonShipping + 1);
      }
    });
  }, [selectedMerchants]);
  useEffect(() => {
    const shippingApiTotal = selectedMerchants.reduce((total, item) => {
      return total + Number(item.cost);
    }, 0);
    updateStateHandler({
      payload: {
        shippingPrice: shippingApiTotal,
      },
    });
  }, [selectedMerchants]);

  const removeAddressHandler = async (addressId) => {
    try {
      const res = await addressService.deleteAddress(
        { id: addressId },
        customerId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: customerId,
            "X-API-Key": "abc123!",
          },
        }
      );

      if (res.data.status) {
        // --- Google Analytics --- //
        if (GoogleAnalyticsCred?.type === "UA") {
          console.log(
            "GoogleAnalyticsCred.tracking_id => ",
            GoogleAnalyticsCred?.tracking_id
          );
          ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
          ReactGA.event({
            category: "Button",
            action: GAMessages.ADDRESS_REMOVED,
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
            action: GAMessages.ADDRESS_REMOVED,
          });
        }
        // --- Google Analytics End --- //

        let selectedAddress = "";

        const arr = shippingArr.filter((add) => add.id != addressId);
        setShippingArr([...arr]);
        arr.forEach((add) => {
          if (add.is_default) selectedAddress = add;
        });
        setSelectedAdd(selectedAddress);
        setAddressName(selectedAddress.address_1);
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const markAsDefaultAddress = async (ship) => {
    global.rudderanalytics?.track(
      "address_changed",
      {},
      {
        time_stamp: time_stamp,
        merchantId: MerchantUserId,
        anonymousId: rudderStackID,
        user_id: customerId,
      }
    );
    try {
      let iid = localStorage.getItem("JWTid");
      let tkn = localStorage.getItem("JWTtoken");
      const res = await addressService.markAsDefaultAddress(
        {
          id: ship.id,
          is_default: true,
          rs_anonymous_id: rudderStackID,
        },
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
            Authorization: `Bearer ${
              is_headless === "1" &&
              mall_ID === null &&
              tkn !== "null" &&
              iid !== "null"
                ? tkn
                : token
                ? token
                : ""
            }`,
            user_id:
              is_headless === "1" &&
              mall_ID === null &&
              tkn !== "null" &&
              iid !== "null"
                ? iid
                : customerId
                ? customerId
                : "",
            "X-API-Key": "abc123!",
          },
        }
      );

      if (res.status) {
        // --- Google Analytics --- //
        if (GoogleAnalyticsCred?.type === "UA") {
          console.log(
            "GoogleAnalyticsCred.tracking_id => ",
            GoogleAnalyticsCred?.tracking_id
          );
          ReactGA.initialize(GoogleAnalyticsCred?.tracking_id);
          ReactGA.event({
            category: "Button",
            action: GAMessages.DEFAULT_ADDRESS,
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
            action: GAMessages.DEFAULT_ADDRESS,
          });
        }
        // --- Google Analytics End --- //

        const arr = shippingArr.map((add) => {
          return {
            ...add,
            is_default: ship.id == add.id,
          };
        });
        setLoadAddress(false);
        setSelectedAdd({ ...ship });
        setAddressName(ship.address_1);
        setShippingArr([...arr]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelEditHandler = (index) => {
    const arr = shippingArr;
    arr[index].edit = false;
    setShippingArr([...arr]);
    setHouse("");
  };

  const updateAdd = async () => {
    console.log("trigger1", shippingArr);
    try {
      const updatedData = await updateNewAddressHandler(editedAdd);
      console.log(updatedData);

      const arr = shippingArr.map((add) => {
        if (add.id == updatedData.id) {
          return { ...updatedData, edit: false };
        } else {
          return { ...add, edit: false };
        }
      });
      if (updatedData.is_default) {
        setSelectedAdd({ ...updatedData });
      }
      setShippingArr([...arr]);
      updateStateHandler({
        payload: {
          country: updatedData.country,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const EditAddressNewww = (index) => {
    let sS = shippingArr.map((add) => {
      return { ...add, edit: false };
    });

    sS[index].edit = true;

    setShippingArr(sS);
    setEditedAdd({ ...sS[index] });
    // setHouse(sS[index].address_2);
    // setAddress(sS[index].address_1);
    const countryIdIndex = countries.findIndex(
      (country) => country.name == sS[index].country
    );
    if (countryIdIndex > -1) {
      setShippingCountryId(String(countries[countryIdIndex].countryId));
      getStatesHandler(
        String(countries[countryIdIndex].countryId),
        sS[index].state,
        "SHIPPING"
      );
    }

    console.log("============================= EDIT ADDRESS:", sS);
  };
  const dropDownClickedAddress = () => {
    global.rudderanalytics?.track(
      "address_dropdown_open",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: userID,
        merchantId: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    setLoadAddress(!loadAddress);
  };
  // const dropDownClickedShipping = () => {
  //   global.rudderanalytics?.track(
  //     "shipping_dropdown_open",
  //     {},
  //     {
  //       user_type: user_type,
  //       user_id: userID,
  //       merchantId: MerchantUserId,
  //       anonymousId: rudderStackID,
  //     }
  //   );
  //   setLoadShipping(!loadShipping);
  // };
  const addnewAddressClicked = () => {
    global.rudderanalytics?.track(
      "add_new_address_click",
      {},
      {
        time_stamp: time_stamp,
        user_type: user_type,
        user_id: userID,
        merchantId: MerchantUserId,
        anonymousId: rudderStackID,
      }
    );
    history.push(routes.editAddress);
  };
  const test = (data) => {
    let check = false;
    let totalCost =
      Number(totalAmount) + Number(taxPrice) - Number(discountedAmount);
    // console.log('TEST Data: ', data)

    data.map((items) => {
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
    // console.log("SHIPPING DETAILS: ", shippingDetails);
    // console.log("SHIPPING DETAILS: ", shippingName);
    // console.log("SHIPPING DETAILS: ", shippingPrice);
  }, []);

  const [show, setShow] = useState(false);
  const [ShipId, setShipId] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (id) => (setShow(true), setShipId(id));

  return (
    <>
      <Modal
        id="deleteModal"
        show={show}
        onHide={handleClose}
        size="xs"
        centered
      >
        <Modal.Body style={{ maxHeight: "60pt" }}>
          <p>Are you sure you want to delete address?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="cancelBtn"
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={() => removeAddressHandler(ShipId)}
            className="deleteBtn"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="shipping-address-container">
        {shippingData[0]?.data?.map((merchant, index) => (
          <div key={index}>
            {/* {shippingDetails?.length > 0 && ( */}
            <div
              style={{ borderBottom: "1px solid gainsboro" }}
              className="padding-10 pointer"
            >
              <Row
                style={{ cursor: "pointer" }}
                // onClick={(e) => dropDownClickedShipping()}
              >
                <Col xs={10} lg={11}>
                  <div className="shipping">
                    <img className="shipping-icon" src="/assets/box.svg"></img>
                    <div className="flex align-center">
                      <p className="self-align-center shippingText">
                        {merchant?.shipping[0]?.merchantName} Shipping
                      </p>
                    </div>
                  </div>
                </Col>
                {/* <Col xs={2} lg={1}>
                    <img
                      src="/assets/arrow.svg"
                      width="24px"
                      height="24px"
                    ></img>
                  </Col> */}
              </Row>

              {/* {platForm_bigCommerce?.toLocaleUpperCase() !== "BIGCOMMERCE" ? (
              <> */}
              {selectedMerchants ? (
                <>
                  <p className="sm-text sm-shipping">
                    Selected Shipping Rate:{" "}
                    {merchant.totalShippingCost
                      ? merchant.totalShippingCost
                      : "Not Selected"}
                  </p>
                </>
              ) : (
                <>
                  {" "}
                  {"props.from " != "review" ? (
                    <p className="sm-text sm-shipping">
                      {shippingName == "" || shippingName === "NO SHIPPING"
                        ? "Please Select Shipping"
                        : shippingName +
                          " " +
                          " " +
                          currency +
                          " " +
                          (currency === "PKR"
                            ? shippingPrice
                            : Number(shippingPrice).toFixed(2))}
                    </p>
                  ) : (
                    <p className="sm-text sm-shipping">
                      Shipping Fee {"props.currency"}{" "}
                      {"props.shippingMethods[0]?.cost"}
                    </p>
                  )}
                </>
              )}
              {/* </>
            ) : (
              <p className="sm-text sm-shipping">Select shipping option.</p>
            )} */}
              {loadShipping && (
                <div>
                  <Row>
                    <Col xs={12} md={12}>
                      <div className={""}>
                        {/* {shippingDetails?.map((option, index) =>
                                platForm_bigCommerce?.toLocaleUpperCase() ===
                                "BIGCOMMERCE" ? (
                                  option.enabled === true && (
                                    <MenuItem>
                                      <div
                                        style={{ width: "100%" }}
                                        onClick={(e) => {
                                          if (
                                            platForm_bigCommerce?.toLocaleUpperCase() !==
                                            "BIGCOMMERCE"
                                          ) {
                                            handleChange(
                                              option.cost,
                                              option.title
                                            );
                                          } else {
                                            if (
                                              Object.keys(
                                                option.settings
                                              ).indexOf("rate") === 0
                                            ) {
                                              console.log("FIRST");
                                              handleChange(
                                                option.settings.rate,
                                                option.name
                                              );
                                            }

                                            if (
                                              option.settings?.range?.length > 0
                                            ) {
                                              test(option.settings?.range) ===
                                              true
                                                ? option.settings?.range.map(
                                                    (item, index) => {
                                                      if (
                                                        Number(totalAmount) +
                                                          Number(taxPrice) -
                                                          Number(
                                                            discountedAmount
                                                          ) >
                                                          item?.lower_limit &&
                                                        Number(totalAmount) +
                                                          Number(taxPrice) -
                                                          Number(
                                                            discountedAmount
                                                          ) <=
                                                          item?.upper_limit
                                                      ) {
                                                        handleChange(
                                                          item?.shipping_cost,
                                                          option.name
                                                        );
                                                      }
                                                    }
                                                  )
                                                : handleChange(
                                                    option.settings
                                                      ?.default_cost,
                                                    option.name
                                                  );

                                              console.log("SECOND");
                                            }
                                            if (
                                              option.settings.carrier_options
                                                ?.exclude_fixed_shipping_products
                                            ) {
                                              console.log("THIRD");
                                              handleChange(0, option.name);
                                            }
                                          }
                                        }}
                                      >
                                        <div>{option.title}</div>
                                        {option.cost && (
                                          <div>
                                            <CurrencyFormat
                                              value={
                                                currency === "PKR"
                                                  ? Number(option.cost)
                                                  : Number(option.cost).toFixed(
                                                      2
                                                    )
                                              }
                                              displayType={"text"}
                                              thousandSeparator={true}
                                              suffix={
                                                currency !== "PKR"
                                                  ? ""
                                                  : Number.isInteger(
                                                      option.cost
                                                    )
                                                  ? ".00"
                                                  : ""
                                              }
                                              prefix={getCurrencySymbol(
                                                currency
                                              )}
                                            />
                                            <hr />
                                          </div>
                                        )}

                                        {/*Big Commerce Case*/}
                        {/* {platForm_bigCommerce?.toLocaleUpperCase() ===
                                          "BIGCOMMERCE" &&
                                          option?.enabled &&
                                          option?.name && (
                                            <div>{option?.name}</div>
                                          )}
                                        {platForm_bigCommerce?.toLocaleUpperCase() ===
                                          "BIGCOMMERCE" &&
                                          option?.enabled &&
                                          option?.settings?.rate && (
                                            <div>
                                              <CurrencyFormat
                                                value={
                                                  currency === "PKR"
                                                    ? Number(
                                                        option.settings.rate
                                                      )
                                                    : Number(
                                                        option.settings.rate
                                                      ).toFixed(2)
                                                }
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                suffix={
                                                  currency !== "PKR"
                                                    ? ""
                                                    : Number.isInteger(
                                                        option.settings.rate
                                                      )
                                                    ? ".00"
                                                    : ""
                                                }
                                                prefix={getCurrencySymbol(
                                                  currency
                                                )}
                                              />
                                              <hr />
                                            </div>
                                          )}
                                        {platForm_bigCommerce?.toLocaleUpperCase() ===
                                          "BIGCOMMERCE" &&
                                          option?.enabled &&
                                          option?.settings?.range && (
                                            <div> */}
                        {/* <h1>
                                    {Number(totalAmount) +
                                      Number(taxPrice) +
                                      Number(shippingPrice) -
                                      Number(discountedAmount)}
                                  </h1>
                                  <h1>
                                    {option?.settings?.range.map((Item) => {
                                      return <h1>{Item.upper_limit}</h1>
                                    })}
                                  </h1> */}
                        {/* {test(option?.settings?.range) ===
                                              false ? (
                                                <>
                                                  <CurrencyFormat
                                                    value={
                                                      currency === "PKR"
                                                        ? option.settings
                                                            ?.default_cost
                                                        : option.settings?.default_cost.toFixed()
                                                    }
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    suffix={
                                                      currency != "PKR"
                                                        ? ""
                                                        : Number.isInteger(
                                                            option.settings
                                                              ?.default_cost
                                                          )
                                                        ? ".00"
                                                        : ""
                                                    }
                                                    prefix={getCurrencySymbol(
                                                      currency
                                                    )}
                                                  />
                                                </>
                                              ) : (
                                                option.settings?.range.map(
                                                  (Item) => {
                                                    return (
                                                      <>
                                                        <CurrencyFormat
                                                          value={
                                                            Number(
                                                              totalAmount
                                                            ) +
                                                              Number(taxPrice) -
                                                              Number(
                                                                discountedAmount
                                                              ) >
                                                              Item?.lower_limit &&
                                                            Number(
                                                              totalAmount
                                                            ) +
                                                              Number(taxPrice) -
                                                              Number(
                                                                discountedAmount
                                                              ) <=
                                                              Item?.upper_limit
                                                              ? currency ===
                                                                "PKR"
                                                                ? Item?.shipping_cost
                                                                : Item?.shipping_cost.toFixed(
                                                                    2
                                                                  )
                                                              : ""
                                                          }
                                                          displayType={"text"}
                                                          thousandSeparator={
                                                            true
                                                          }
                                                          suffix={
                                                            currency != "PKR"
                                                              ? ""
                                                              : Number.isInteger(
                                                                  Item?.shipping_cost
                                                                )
                                                              ? ".00"
                                                              : ""
                                                          }
                                                          prefix={getCurrencySymbol(
                                                            currency
                                                          )}
                                                        />
                                                      </>
                                                    );
                                                  }
                                                )
                                              )}
                                              <hr />
                                            </div>
                                          )}
                                        {platForm_bigCommerce?.toLocaleUpperCase() ===
                                          "BIGCOMMERCE" &&
                                          option?.enabled &&
                                          option?.settings?.carrier_options && (
                                            <div>
                                              <CurrencyFormat
                                                value={0}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                suffix={
                                                  currency != "PKR" ? "" : ".00"
                                                }
                                                prefix={getCurrencySymbol(
                                                  currency
                                                )}
                                              />
                                              <hr />
                                            </div>
                                          )}
                                      </div>
                                    </MenuItem>
                                  )
                                ) : ( */}
                        <>
                          {merchant?.shipping[0]?.shippingCategories?.map(
                            (category, i) => (
                              <MenuItem key={i}>
                                <div
                                  style={{ width: "100%" }}
                                  onClick={(e) => {
                                    // option.fee &&
                                    handleChange(
                                      category.fee !== undefined
                                        ? category.fee
                                        : category.cost,
                                      category.title,
                                      merchant?.shipping[0].merchantName,
                                      merchant?.shipping[0].merchantUserID
                                    );
                                  }}
                                >
                                  <div>
                                    {category?.title == "null"
                                      ? category?.title
                                      : category?.title}
                                  </div>
                                  {category.fee && (
                                    <div>
                                      <CurrencyFormat
                                        value={
                                          currency === "PKR"
                                            ? Number(category.fee)
                                            : Number(category.fee).toFixed()
                                        }
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        suffix={currency !== "PKR" ? "" : ".00"}
                                        prefix={getCurrencySymbol(currency)}
                                      />
                                      <hr />
                                    </div>
                                  )}
                                  {category.cost && (
                                    <div>
                                      <CurrencyFormat
                                        value={
                                          currency === "PKR"
                                            ? Number(category.cost)
                                            : Number(category.cost).toFixed()
                                        }
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        suffix={currency !== "PKR" ? "" : ".00"}
                                        prefix={getCurrencySymbol(currency)}
                                      />
                                      <hr />
                                    </div>
                                  )}
                                </div>
                              </MenuItem>
                            )
                          )}
                        </>
                        {/* ) */}
                        {/* ) */}
                        {/* } */}
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            {/* )} */}
          </div>
        ))}
        {/* : ""} */}
        <div className="padding-10 pointer">
          <Row
            style={{ cursor: "pointer" }}
            onClick={() => dropDownClickedAddress()}
          >
            <Col xs={10} lg={11}>
              <div className="shipping">
                <img
                  className="shipping-icon"
                  src="/assets/addresslocation.svg"
                ></img>
                <p className="self-align-center shippingText">Address</p>
              </div>
            </Col>
            <Col xs={2} lg={1}>
              <img src="/assets/arrow.svg" width="24px" height="24px"></img>
            </Col>
          </Row>
          <p className="sm-text sm-shipping">
            {addressName == "" ? "Select Address" : addressName}
          </p>
          {loadAddress && (
            <>
              {props.from != "review" ? (
                <>
                  <MenuItem>
                    <div
                      style={{ width: "100%" }}
                      onClick={(e) => {
                        // setAddressName("");
                        // setSelected("");
                        // setAddress(false);
                      }}
                    >
                      <div>Please Select</div>
                    </div>
                  </MenuItem>

                  <div
                    className=" "
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    <p
                      style={{ paddingLeft: "20px" }}
                      className="self-align-center shippingText"
                    >
                      Shipping
                    </p>
                    {shippingArr &&
                      shippingArr?.map((ship, i) => (
                        <>
                          <div className="firstName-Tick-div">
                            {ship.is_default && (
                              <img
                                className="tickIconImg"
                                src="/assets/tickIcon.svg"
                              ></img>
                            )}

                            <p
                              className={`mt-05 ${
                                !ship.edit ? "hover-grey" : ""
                              }`}
                            >
                              {/* {ship?.address} */}

                              {!ship.edit && (
                                <div
                                  className="address-text-grey"
                                  onClick={(e) => {
                                    props.setError("");
                                    if (
                                      checkBlockCitiesHelper(
                                        identityToken,
                                        ship.city
                                      )
                                    ) {
                                      props.setError(
                                        "Cannot place an order from your selected shipping city."
                                      );
                                    }

                                    // updateOnFail(ship?.address);

                                    setSelected("shipping");

                                    if (!ship.edit) {
                                      markAsDefaultAddress(ship);
                                    }

                                    // updateOnFail(ship);
                                  }}
                                >
                                  {/* <div className="firstName-Tick-div"> */}

                                  <p>{ship.name}</p>
                                  {/* </div> */}

                                  <p>{ship.phone_number}</p>
                                  <p>{ship.address_1}</p>
                                  <p>
                                    {/* {ship.country}, */}
                                    {/* {ship.state}, 
                                    {ship.city},{" "}
                                    {ship.zip} */}
                                  </p>
                                </div>
                              )}

                              {ship.edit && (
                                <div>
                                  <Row>
                                    <Col>
                                      <input
                                        className="editAddressInput"
                                        type="text"
                                        placeholder="First Name"
                                        value={editedAdd.name}
                                        onChange={(e) =>
                                          setEditedAdd({
                                            ...editedAdd,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col>
                                      <input
                                        className="editAddressInput"
                                        type="text"
                                        placeholder="Phone Number"
                                        value={editedAdd.phone_number}
                                        onChange={(e) =>
                                          setEditedAdd({
                                            ...editedAdd,
                                            phone_number: e.target.value,
                                          })
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col className="mb-6">
                                      <LocationSearchInput
                                        cityHandler={cityChangeHandler}
                                        billingHandler={() => {}}
                                        from="shipping"
                                        prevAddress={ship.address_1}
                                        className="mb-6"
                                      />
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col className="mb-6">
                                      <TextField
                                        className=""
                                        size="small"
                                        id="filled-basic"
                                        label="House/Apartment#"
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
                                  </Row>

                                  <Row>
                                    <Col>
                                      <TextField
                                        id="filled-basic"
                                        select
                                        label="Country"
                                        value={shippingCountryId}
                                        onChange={(e) => {
                                          // setCountry(e.target.value);
                                          const name =
                                            findShippingCountryByIdHandler(
                                              e.target.value
                                            );
                                          setEditedAdd({
                                            ...editedAdd,
                                            country: name,
                                          });
                                        }}
                                        size="small"
                                        className="mb-6"
                                        variant="filled"
                                        style={{ width: "100%" }}
                                        InputProps={{
                                          className: "user-input-card-",
                                        }}
                                      >
                                        {countries.map((option) => (
                                          <MenuItem
                                            key={option.name}
                                            value={option.countryId}
                                          >
                                            {option.name}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Col>
                                    <Col>
                                      <TextField
                                        id="filled-basic"
                                        select
                                        label="State"
                                        value={shippingStateId}
                                        disabled={
                                          shippingCountryId != "" ? false : true
                                        }
                                        onChange={(e) => {
                                          const name =
                                            findShippingStateByIdHandler(
                                              e.target.value
                                            );
                                          setEditedAdd({
                                            ...editedAdd,
                                            state: name,
                                          });
                                          // setState(e.target.value);
                                        }}
                                        size="small"
                                        className=""
                                        variant="filled"
                                        style={{ width: "100%" }}
                                        InputProps={{
                                          className: "user-input-card-",
                                        }}
                                      >
                                        {shippingStates.map((option) => (
                                          <MenuItem
                                            key={option.stateId}
                                            value={option.stateId}
                                          >
                                            {option.name}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col>
                                      <TextField
                                        id="filled-basic"
                                        select
                                        label="City"
                                        value={editedAdd.city}
                                        onChange={(e) =>
                                          setEditedAdd({
                                            ...editedAdd,
                                            city: e.target.value,
                                          })
                                        }
                                        disabled={
                                          shippingStateId != "" ? false : true
                                        }
                                        size="small"
                                        className=""
                                        variant="filled"
                                        style={{ width: "100%" }}
                                        InputProps={{
                                          className: "user-input-card-",
                                        }}
                                      >
                                        {shippingCities.map((option) => (
                                          <MenuItem
                                            key={option.name}
                                            value={option.name}
                                          >
                                            {option.name}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Col>
                                    <Col>
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
                                        value={editedAdd.zip}
                                        disabled={
                                          editedAdd.city != "" ? false : true
                                        }
                                        // disabled={zipFound}
                                        onChange={(e) => {
                                          editedAdd({
                                            ...editedAdd,
                                            zip: e.target.value,
                                          });
                                        }}
                                      />
                                    </Col>
                                  </Row>

                                  <div className="editAddressCancelSaveDiv">
                                    <button
                                      className="editAddressCancelBtn"
                                      type="button"
                                      onClick={() => cancelEditHandler(i)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      className="editAddressSaveBtn"
                                      onClick={() => updateAdd()}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* {
                                ship.edit &&  
                              } */}
                            </p>
                          </div>

                          {!ship.edit && (
                            <div className="remove-edit-div">
                              {/* <p 
                                className="address-remove-text"
                                onClick={() => handleShow(ship.id)}
                              >
                                Remove 
                              </p> */}
                              <p
                                onClick={() => EditAddressNewww(i)}
                                className="address-edit-text"
                              >
                                Edit
                              </p>
                            </div>
                          )}
                        </>
                      ))}
                    <div
                      onClick={(e) => {
                        //  console.log("click ")
                        // if(window.location.pathname == "/failure") {
                        //   const search = window.location.search;
                        //   window.location.href='/changeaddress'+search+"&&"+'from=failure'
                        // }else{
                        addnewAddressClicked();
                        // }
                      }}
                      style={{ justifyContent: "center" }}
                      className="flex mt-10"
                    >
                      <img
                        style={{ cursor: "pointer" }}
                        src="/assets/editaddress.svg"
                      ></img>
                      <p></p>
                    </div>
                  </div>
                  {/* </MenuItem> */}
                </>
              ) : (
                <>
                  {/* <MenuItem> */}
                  <div
                    style={{ width: "100%" }}
                    onClick={(e) => {
                      setLoadAddress(false);
                    }}
                  >
                    <p className="self-align-center shippingText">Shipping</p>

                    <p>{props?.shippingAdd}</p>
                  </div>
                  {/* </MenuItem> */}
                </>
              )}
            </>
          )}
        </div>

        {/* </Row> */}
      </div>
    </>
  );
}
export default ShippingAddress;
