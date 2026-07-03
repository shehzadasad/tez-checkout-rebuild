import React, { useContext, useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";

interface IProps {
  from: string;
  diffBilling: boolean;
  cityHandler: Function;
  billingHandler: Function;
  setClicked: Function;
  shippingCountryId: string;
  prevAddress?: string;
}

const LocationSearchInput: React.FC<IProps> = ({
  from,
  diffBilling,
  cityHandler,
  billingHandler,
  setClicked,
  shippingCountryId,
  prevAddress,
}: IProps) => {
  const {
    state: { wordUrl },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (prevAddress) {
      setAddress(prevAddress);
      updateStateHandler({
        payload: {
          address: prevAddress,
        },
      });
    }
  }, [prevAddress]);

  const changeHandler = (address: string) => {
    setAddress(address);

    if (from == "shipping") {
      updateStateHandler({
        payload: {
          address: address,
        },
      });
    }

    if (from == "billing" && diffBilling === false) {
      updateStateHandler({
        payload: {
          billingAddress: address,
        },
      });
    }
  };

  useEffect(() => {
    if (address == "") {
      // updateStateHandler({
      //   payload: {
      //     address: "",
      //   },
      // });
    }
  }, []);
  const selectHandler = async (address: string) => {
    try {
      setAddress(address);
      if (shippingCountryId != "") {
        // setClicked(shippingCountryId, "SHIPPING");
      }
      const response = await geocodeByAddress(address);
      //console.log("response", response);
      if (from == "shipping") {
        // let city = "";
        // let state = "";
        // let zip = "";
        let locationDetail = {
          city: "",
          state: "",
          zip: "",
          country: "",
          countryCode: "",
        };
        for (const component of response[0].address_components) {
          const componentType = component.types[0];
          //console.log("component", component);
          //console.log("componentType", componentType);
          updateStateHandler({
            payload: {
              address: response[0].formatted_address,
            },
          });

          switch (componentType) {
            case "locality": {
              locationDetail.city = component.long_name;
              // city = component.long_name;
              // cityHandler(city, "", "");
              // this.props.handleCity(city, "", "");
              break;
            }
            case "administrative_area_level_1": {
              locationDetail.state = component.long_name;
              // state = component.long_name;
              // cityHandler(city, "", state);
              // this.props.handleCity(city, "", state);
              break;
            }
            case "postal_code": {
              locationDetail.zip = `${component.long_name}`;
              // zip = `${component.long_name}`;
              // cityHandler(city, zip, state);
              // this.props.handleCity(city, zip, state);
              break;
            }
            case "country": {
              locationDetail.country = component.long_name;
              locationDetail.countryCode = component.short_name;
              break;
            }
          }
        }
        cityHandler(
          locationDetail.city,
          locationDetail.zip,
          locationDetail.state,
          locationDetail.country,
          locationDetail.countryCode
        );
      }

      if (from == "billing" && diffBilling === false) {
        // let city = "";
        // let state = "";
        // let zip = "";
        // let address = "";

        let locationDetail = {
          city: "",
          state: "",
          zip: "",
          country: "",
          countryCode: "",
        };

        for (const component of response[0].address_components) {
          const componentType = component.types[0];
          updateStateHandler({
            payload: {
              billingAddress: response[0].formatted_address,
            },
          });

          switch (componentType) {
            case "locality": {
              locationDetail.city = component.long_name;
              // city = component.long_name;
              // billingHandler(city, "", "");
              //   this.props.changeBilling(city, "", "");
              break;
            }
            case "administrative_area_level_1": {
              locationDetail.state = component.long_name;
              // state = component.long_name;
              // billingHandler(city, "", state);
              //   this.props.changeBilling(city, "", state);
              break;
            }
            case "postal_code": {
              locationDetail.zip = component.long_name;
              // zip = `${component.long_name}`;
              // billingHandler(city, zip, state);
              //   this.props.changeBilling(city, zip, state);
              break;
            }
            case "country": {
              locationDetail.country = component.long_name;
              locationDetail.countryCode = component.short_name;
              break;
            }
          }
        }
        billingHandler(
          locationDetail.city,
          locationDetail.zip,
          locationDetail.state,
          locationDetail.country,
          locationDetail.countryCode
        );
      }
    } catch (error: any) {
      console.error("Error", error);
    }
  };
  useEffect(() => {
    if (wordUrl && wordUrl.includes("address_1")) {
      console.log(wordUrl);
      const regex = /"address_1":"([^"]*)"/;
      const match = wordUrl.match(regex);
      const address_1 = match[1];
      setAddress(address_1);
      updateStateHandler({
        payload: {
          address: address_1,
        },
      });
      // }
    }
  }, [wordUrl]);
  return (
    <PlacesAutocomplete
      value={address}
      onChange={changeHandler}
      onSelect={selectHandler}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Shipping Address",
              className: "user-input-card- city-search",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {/* {loading && <div>Loading...</div>} */}
            {/* {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })} */}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
// import React, { useContext, useEffect, useState, ChangeEvent } from "react";

// import PlacesAutocomplete, {
//   geocodeByAddress,
// } from "react-places-autocomplete";
// import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
// import { TextField } from "@mui/material";

// interface IProps {
//   from: string;
//   diffBilling: boolean;
//   cityHandler: Function;
//   billingHandler: Function;
//   setClicked: Function;
//   shippingCountryId: string;
//   prevAddress?: string;
// }

// const LocationSearchInput: React.FC<IProps> = ({
//   from,
//   diffBilling,
//   cityHandler,
//   billingHandler,
//   setClicked,
//   shippingCountryId,
//   prevAddress,
// }: IProps) => {
//   const {
//     actions: { updateStateHandler },
//   } = useContext(CheckoutContext);
//   const [address, setAddress] = useState("");

//   useEffect(() => {
//     if (prevAddress) {
//       setAddress(prevAddress);
//       updateStateHandler({
//         payload: {
//           address: prevAddress,
//         },
//       });
//     }
//   }, [prevAddress]);

//   // const changeHandler = (address: string) => {
//   //   setAddress(address);

//   //   if (from == "shipping") {
//   //     updateStateHandler({
//   //       payload: {
//   //         address: address,
//   //       },
//   //     });
//   //   }

//   //   if (from == "billing" && diffBilling === false) {
//   //     updateStateHandler({
//   //       payload: {
//   //         billingAddress: address,
//   //       },
//   //     });
//   //   }
//   // };

//   useEffect(() => {
//     if (address == "") {
//       // updateStateHandler({
//       //   payload: {
//       //     address: "",
//       //   },
//       // });
//     }
//   }, []);
//   // const selectHandler = async (address: string) => {
//   //   // try {
//   //   setAddress(address);
//   //   //   if (shippingCountryId != "") {
//   //   //     // setClicked(shippingCountryId, "SHIPPING");
//   //   //   }
//   //   //   const response = await geocodeByAddress(address);
//   //   //   //console.log("response", response);
//   //   //   if (from == "shipping") {
//   //   //     // let city = "";
//   //   //     // let state = "";
//   //   //     // let zip = "";
//   //   //     let locationDetail = {
//   //   //       city: "",
//   //   //       state: "",
//   //   //       zip: "",
//   //   //       country: "",
//   //   //       countryCode: "",
//   //   //     };
//   //   //     for (const component of response[0].address_components) {
//   //   //       const componentType = component.types[0];
//   //   //       //console.log("component", component);
//   //   //       //console.log("componentType", componentType);
//   //   //       updateStateHandler({
//   //   //         payload: {
//   //   //           address: response[0].formatted_address,
//   //   //         },
//   //   //       });

//   //   //       switch (componentType) {
//   //   //         case "locality": {
//   //   //           locationDetail.city = component.long_name;
//   //   //           // city = component.long_name;
//   //   //           // cityHandler(city, "", "");
//   //   //           // this.props.handleCity(city, "", "");
//   //   //           break;
//   //   //         }
//   //   //         case "administrative_area_level_1": {
//   //   //           locationDetail.state = component.long_name;
//   //   //           // state = component.long_name;
//   //   //           // cityHandler(city, "", state);
//   //   //           // this.props.handleCity(city, "", state);
//   //   //           break;
//   //   //         }
//   //   //         case "postal_code": {
//   //   //           locationDetail.zip = `${component.long_name}`;
//   //   //           // zip = `${component.long_name}`;
//   //   //           // cityHandler(city, zip, state);
//   //   //           // this.props.handleCity(city, zip, state);
//   //   //           break;
//   //   //         }
//   //   //         case "country": {
//   //   //           locationDetail.country = component.long_name;
//   //   //           locationDetail.countryCode = component.short_name;
//   //   //           break;
//   //   //         }
//   //   //       }
//   //   //     }
//   //   //     cityHandler(
//   //   //       locationDetail.city,
//   //   //       locationDetail.zip,
//   //   //       locationDetail.state,
//   //   //       locationDetail.country,
//   //   //       locationDetail.countryCode
//   //   //     );
//   //   //   }

//   //   //   if (from == "billing" && diffBilling === false) {
//   //   //     // let city = "";
//   //   //     // let state = "";
//   //   //     // let zip = "";
//   //   //     // let address = "";

//   //   //     let locationDetail = {
//   //   //       city: "",
//   //   //       state: "",
//   //   //       zip: "",
//   //   //       country: "",
//   //   //       countryCode: "",
//   //   //     };

//   //   //     for (const component of response[0].address_components) {
//   //   //       const componentType = component.types[0];
//   //   //       updateStateHandler({
//   //   //         payload: {
//   //   //           billingAddress: response[0].formatted_address,
//   //   //         },
//   //   //       });

//   //   //       switch (componentType) {
//   //   //         case "locality": {
//   //   //           locationDetail.city = component.long_name;
//   //   //           // city = component.long_name;
//   //   //           // billingHandler(city, "", "");
//   //   //           //   this.props.changeBilling(city, "", "");
//   //   //           break;
//   //   //         }
//   //   //         case "administrative_area_level_1": {
//   //   //           locationDetail.state = component.long_name;
//   //   //           // state = component.long_name;
//   //   //           // billingHandler(city, "", state);
//   //   //           //   this.props.changeBilling(city, "", state);
//   //   //           break;
//   //   //         }
//   //   //         case "postal_code": {
//   //   //           locationDetail.zip = component.long_name;
//   //   //           // zip = `${component.long_name}`;
//   //   //           // billingHandler(city, zip, state);
//   //   //           //   this.props.changeBilling(city, zip, state);
//   //   //           break;
//   //   //         }
//   //   //         case "country": {
//   //   //           locationDetail.country = component.long_name;
//   //   //           locationDetail.countryCode = component.short_name;
//   //   //           break;
//   //   //         }
//   //   //       }
//   //   //     }
//   //   //     billingHandler(
//   //   //       locationDetail.city,
//   //   //       locationDetail.zip,
//   //   //       locationDetail.state,
//   //   //       locationDetail.country,
//   //   //       locationDetail.countryCode
//   //   //     );
//   //   //   }
//   //   // } catch (error: any) {
//   //   //   console.error("Error", error);
//   //   // }
//   // };

//   // return (
//   // <PlacesAutocomplete
//   //   value={address}
//   //   onChange={changeHandler}
//   //   onSelect={selectHandler}
//   // >
//   //   {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//   //     <div>
//   //       <input
//   //         {...getInputProps({
//   //           placeholder: "Shipping Address",
//   //           className: "user-input-card- city-search",
//   //         })}
//   //       />
//   //       <div className="autocomplete-dropdown-container">
//   //         {/* {loading && <div>Loading...</div>} */}
//   //         {/* {suggestions.map((suggestion) => {
//   //           const className = suggestion.active
//   //             ? "suggestion-item--active"
//   //             : "suggestion-item";
//   //           // inline style for demonstration purpose
//   //           const style = suggestion.active
//   //             ? { backgroundColor: "#fafafa", cursor: "pointer" }
//   //             : { backgroundColor: "#ffffff", cursor: "pointer" };
//   //           return (
//   //             <div
//   //               {...getSuggestionItemProps(suggestion, {
//   //                 className,
//   //                 style,
//   //               })}
//   //             >
//   //               <span>{suggestion.description}</span>
//   //             </div>
//   //           );
//   //         })} */}
//   //       </div>
//   //     </div>
//   //   )}
//   // </PlacesAutocomplete>
//   const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     const newAddress = e.target.value;
//     setAddress(newAddress);
//     // Handle the new address value here
//   };
//   // console.log(address,"adress");
//   return (
//     <TextField
//       value={address}
//       onChange={changeHandler}
//       placeholder="Shipping Address"
//       className="user-input-card- city-search"
//     />
//   );
// };

// export default LocationSearchInput;
