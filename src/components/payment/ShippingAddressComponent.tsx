import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Row, Col, Modal } from "react-bootstrap";

import "../../styles/checkout.css";
import MenuItem from "@mui/material/MenuItem";
import CurrencyFormat from "react-currency-format";
import { userService } from "../../services/user.service";

interface IProps {
  identityToken: string;
  token: string;
  shippingMethods: Array<{
    cost: string;
    title: string;
  }>;
  shippingAdd: string;
  shippingAddr1: string;
  currency: string;
  from: string;
  setShippingName?: any;
  selectedAddress?: any;
  setShippingPrice?: any;
  shippingValidation?: any;
  encrypted?: any;
}

const ShippingAddress: React.FC<IProps> = (props: IProps) => {
  const [loadShipping, setLoadShipping] = useState<boolean>(false);
  const [loadAddress, setAddress] = useState<boolean>(false);
  const [billingFlag, setBillingFlag] = useState<boolean>(true);
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  const [currency, setCurrency] = useState<string>("");
  const [shippingMethods, setShippingMethods] = useState<any>([]);
  const [shippingArr, setShippingArr] = useState<any>([]);
  const [billingArr, setBillingArr] = useState<any>([]);
  const [mapit, setMapit] = useState<boolean>(false);
  const [shippingName, setShippingName] = useState<string>("");
  const [addressName, setAddressName] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [selectedAdd, setSelectedAdd] = useState<any>([]);

  useEffect(() => {
    if (selected == "") {
      if (props.from != "review") {
        props.selectedAddress([]);
      }
    }
    if (selected == "shipping") {
      if (props.from != "review") {
        props.selectedAddress(selectedAdd);
      }
    }
    if (selected == "billing") {
      if (props.from != "review") {
        props.selectedAddress(selectedAdd);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (props.from != "review") {
      ShippingAddress();
    }
  }, [props.token, props.identityToken]);

  useEffect(() => {
    if (
      props.shippingMethods != undefined &&
      props.shippingMethods.length > 0
    ) {
      setMapit(true);
      setShippingMethods(props.shippingMethods);

      cheapestShippingMethod(props.shippingMethods);
      //  setShippingPrice(props.encrpted.shipping_amount)
    }
  }, [props.shippingMethods]);

  useEffect(() => {
    setLoadShipping(false);
  }, [shippingPrice]);

  useEffect(() => {
    if (props.from == "review") {
      setAddressName(props.shippingAddr1);
    }
  }, [props.shippingAddr1]);

  useEffect(() => {
    setShippingArr(props.shippingAdd);
    setBillingArr(props.shippingAdd);
  }, [props.shippingAdd]);

  const cheapestShippingMethod = (shippingMethodsParam: any) => {
    //Pick the cheapest shipping method
    let minCost = 99999;
    let minTitle = "";

    for (let i = 0; i < shippingMethodsParam.length; i++) {
      let shippingMeth = shippingMethodsParam[i];

      if (shippingMeth.cost < minCost) {
        minCost = shippingMeth.cost;
        minTitle = shippingMeth.title;
      }
    }
    setLoadShipping(false);

    setShippingPrice(minCost);
    setShippingName(minTitle);

    if (props.from != "review") {
      props.setShippingPrice(minCost);
      props.shippingValidation(true);
      props.setShippingName(minTitle);
    }
    //AbdulMutaal
  };

  const handleChange = (cost: number, title: string) => {
    setLoadShipping(false);
   
    setShippingPrice(cost);
    setShippingName(title);

    if (props.from != "review") {
      props.setShippingPrice(cost);
      props.setShippingName(title);
      props.shippingValidation(true);
    }
  };

  const updateOnFail = (address: any) => {
    var shipping_info = {
      addr1: address.address,
      addr2: "",
      state: address.state,
      city: address.city,
      zip: "NA",
      country: address.country,
    };
    var billing_info = {
      addr1: address.address,
      addr2: "",
      state: address.state,
      city: address.city,
      zip: "NA",
      country: address.country,
    };
    //console.log(shipping_info);
    if (props.encrypted != null) {
      props.encrypted.shipping_info = shipping_info;
      // props.encrpted.billing_info=billing_info
    }
  };

  /**
   * @description get shipping addresses
   */
  const ShippingAddress = async () => {
    try {
      const response = await userService.getAddress({
        headers: {
          Authorization: `Bearer ${props.token}`,
          "identity-token": props.identityToken,
        },
      });
      let temp = [];
      let arr = response.data.addresses;
      if (!Array.isArray(arr.shipping)) {
        temp.push(arr.shipping);
        setShippingArr(temp);
        arr.shipping.map((ship: any) => {
          setAddressName(ship?.address);
          setSelectedAdd(ship);
          setAddress(false);
          props.selectedAddress(ship);
          setSelected("shipping");
        });
      } else {
        setShippingArr(arr?.shipping);
        arr.shipping.map((ship: any) => {
          setAddressName(ship?.address);
          setSelectedAdd(ship);
          setAddress(false);
          props.selectedAddress(ship);
          setSelected("shipping");
        });
      }
    } catch (err) {
      //console.log(err);
    }
  };

  return (
    <div className="shipping-address-container">
     {(shippingPrice == 0 ||shippingPrice == null) && mapit && (
        <div
          style={{ borderBottom: "1px solid gainsboro" }}
          className="padding-10 pointer"
        >
          <Row onClick={(e) => setLoadShipping(!loadShipping)}>
            <Col xs={10} lg={11}>
              <div className="shipping">
                <img className="shipping-icon" src="/assets/box.svg"></img>
                <p className="self-align-center shippingText">Shipping</p>
              </div>
            </Col>
            <Col xs={2} lg={1}>
              <img src="/assets/arrow.svg" width="24px" height="24px"></img>
            </Col>
          </Row>

          {props.from != "review" ? (
            <p className="sm-text sm-shipping">
              {shippingName == ""
                ? "Please Select"
                : shippingName +
                " " +
                " " +
                props.currency +
                " " +
                shippingPrice}
            </p>
          ) : (
            <p className="sm-text sm-shipping">
              Shipping Fee {props.currency} {props.shippingMethods[0]?.cost}
            </p>
          )}

          {loadShipping && (
            <div>
              <Row>
                <Col xs={12} md={12}>
                  <div className={""}>
                    {/* <MenuItem ></MenuItem> */}
                    {mapit &&
                      shippingMethods.map((option: any) => (
                        <MenuItem>
                          <div
                            style={{ width: "100%" }}
                            onClick={(e) =>
                              handleChange(option.cost, option.title)
                            }
                          >
                            <div>{option.title}</div>
                            <div>
                              <CurrencyFormat
                                value={Number(option.cost)}
                                displayType={"text"}
                                thousandSeparator={true}
                                suffix={props.currency != "PKR" ? "" : ".00"}
                                prefix={currency != "PKR" ? "$" : "Rs."}
                              />
                              <hr />
                            </div>
                          </div>
                        </MenuItem>
                      ))}
                  </div>
                </Col>
              </Row>
            </div>
          )}
          {/* <hr style={{ margin: 0 }}></hr> */}
        </div>
      )}

      <div className="padding-10 pointer">
        <Row onClick={(e) => setAddress(!loadAddress)}>
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
            <img src="/assets/arrow.svg"></img>
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
                      setAddressName("");
                      setSelected("");
                      setAddress(false);
                    }}
                  >
                    {/* <p className="self-align-center shippingText">Billing</p> */}

                    <div>Please Select</div>
                  </div>
                </MenuItem>

                <div className=" " style={{ width: "100%", marginTop: "10px" }}>
                  <p
                    style={{ paddingLeft: "20px" }}
                    className="self-align-center shippingText"
                  >
                    Shipping
                  </p>
                  {shippingArr &&
                    shippingArr?.map((ship: any) => (
                      <p
                        onClick={(e) => {
                          //console.log("nnnnj");
                          setAddressName(ship?.address);
                          updateOnFail(ship?.address);
                          setSelected("shipping");
                          setAddress(false);
                          setSelectedAdd(ship);
                          updateOnFail(ship);
                        }}
                        className="mt-05 hover-grey"
                      >
                        {ship?.address}
                      </p>
                    ))}
                </div>
                {/* </MenuItem> */}
              </>
            ) : (
              <>
                {/* <MenuItem> */}
                <div
                  style={{ width: "100%" }}
                  onClick={(e) => {
                    setAddress(false);
                  }}
                >
                  <p className="self-align-center shippingText">Billing</p>

                  <p>{billingArr.addr1}</p>
                </div>
                {/* </MenuItem> */}
              </>
            )}
          </>
        )}
      </div>

      {/* </Row> */}
    </div>
  );
};

export default ShippingAddress;
