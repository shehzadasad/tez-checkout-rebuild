import {
  Typography,
  Tooltip,
  Box,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { usePaymentSelectionHook } from "../../hooks/custom/usePaymentSelection";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import { useContext, useEffect, useRef, useState } from "react";
import { lazyLoad } from "../../utils/loadable";
import CardDetail from "./CardDetailComponent";
import { Button, Col, Row } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import EmailOtp from "../otp/EmailOtp";
interface IProps {
  setNumber: Function;
  setCvc: Function;
  setName: Function;
  setExpiry: Function;
  encrypted: any;
  setExpiryValidated: Function;
  email?: string;
  currency?: string;
  productsObj?: any;
}
const PayFast: React.FC<IProps> = (props: IProps) => {
  const {
    states: { error, encrypted, number, cnic, cvc, expiry, jazzCashNumber },

    setStates: {
      setCvc,
      setCnic,
      setJazzCashNumber,
      setNumber,
      setName,
      setExpiry,
      setExpiryValidated,
      setError,
      setPayFastPackageID,
    },
  } = usePaymentSelectionHook();

  const {
    state: {
      payFastPackageID,
      identityToken,
      payFastData,
      bankID,
      bankName,
      payFastDetails,
      emailValidated,
      totalAmount,
      discountedAmount,
      methods
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const [payFast, setPayFast] = useState(1);
  const quantityInputRef = useRef<any>(null);
  useEffect(() => {
    const ignoreScroll = (e: any) => {
      e.preventDefault();
    };
    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountFlag, setDiscountFlag] = useState<boolean>(true);

  const fetchBinDiscount = async (val: string) => {
    setDiscountFlag(false);
    await axios
      .post(
        `${process.env.REACT_APP_ORDER_MS_API_KEY}/calculate_bin_discount`,
        {
          amount: totalAmount,
          bin_number: val.slice(0, 6),
          is_tokenised: false,
          tokenised_card_num: "",
        },
        {
          headers: {
            identity_token: identityToken,
          },
        }
      )
      .then((response: any) => {
        setDiscountFlag(true);
        updateStateHandler({
          payload: {
            discountedAmount:
              Number(discountedAmount) +
              Number(response.data.data.discountAmount),
          },
        });
        setDiscount(Number(response.data.data.discountAmount));
      })
      .catch((error: any) => {
        setDiscountFlag(true);
        console.log(error);
      });
  };
  useEffect(() => {
    setPayFast(3);
    axios
      .post(
        `${process.env.REACT_APP_ORDER_MS_API_KEY}/payfast_get_banklist`,
        {
          merchant_package_id: payFastPackageID,
        },
        {
          headers: {
            "identity-token": identityToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((result: any) => {
        updateStateHandler({
          payload: {
            payFastData: result.data,
          },
        });
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, []);

  const validateCardNumberHandler = () => {
    if (number.length < 19) {
      setError("This card number looks invalid");
      return true;
    } else {
      setError("");
      return false;
    }
  };

  /**
   * @description validate the expiry
   */
  const basicExpiryValidation = () => {
    let dValue = expiry?.split("/");
    let pattern = /^\d{2}$/;

    let newDate = expiry?.split("/");
    let current_year = new Date().getFullYear();
    let todayDate = new Date();

    let current_day = new Date().getDate();

    let expiryDate = new Date(dValue[0] + "/" + current_day + "/" + dValue[1]);

    let months;
    months = (expiryDate.getFullYear() - todayDate.getFullYear()) * 12;
    months -= todayDate.getMonth();
    months += expiryDate.getMonth();
    months = months <= 0 ? 0 : months;

    var expiryYear = "20" + newDate[1];
    var expiryMonth = Number(newDate[0]);
    var currentMonth = new Date().getMonth() + 1;

    if (expiryMonth > 12) {
      setError("Expiry Date is not valid");
      setExpiryValidated(false);
    } else if (
      expiryMonth < currentMonth &&
      expiryYear <= current_year.toString()
    ) {
      setError("Expiry Date is not valid");
      setExpiryValidated(false);
    } else if (expiryYear < current_year.toString()) {
      setError("Expiry Date is not valid");
      setExpiryValidated(false);
    } else if (!pattern.test(dValue[0]) || !pattern.test(dValue[1])) {
      setError("Expiry Date format is not valid");
      setExpiryValidated(false);
    } else if (months < 5) {
      setError("Expiry Date should be greater than 5 months");
      setExpiryValidated(false);
    } else {
      setError("");
      setExpiryValidated(true);
    }
  };

  /**
   * @description validate the expiry date of card on change
   * @param e
   */
  const handleChangeCardExpiryHandler = (e: any) => {
    let re = /^[0-9/\\]*$/;

    if (re.test(e.target.value)) {
      const value = e.target.value;
      //    setExpiryMonth(value.replace(/\//g, "").substring(0, 2));
      //    setExpiryYear(value.replace(/\//g, "").substring(0, 2));

      const expDateFormatter =
        value.replace(/\//g, "").substring(0, 2) +
        (value.length > 2 ? "/" : "") +
        value.replace(/\//g, "").substring(2, 4);
      setExpiry(expDateFormatter);
      props.setExpiry(expDateFormatter);
      if (props.encrypted != null) {
        props.encrypted.expiry_date = expDateFormatter;
      }
    }
  };

  /**
   * @description validate the cvv and set error
   * @param e
   * @returns
   */
  const validateCvvHandler = (e: any) => {
    if (PayFastDetails[2]?.cvc?.length < 3) {
      setError("Please enter minimum 3 digits");
      return true;
    } else {
      setError("");
      return false;
    }
  };

  const [PayFastDetails, setPayFastDetails] = useState<any>([]);
  const getObject = (data: any, key: any, value: any, index: any) => {
    if (data.length > 0 && key === "") {
      let array: any = [...PayFastDetails];
      array[index] = {
        bank_name: data[0],
        bank_id: data[1],
      };
      setPayFastDetails(array);
      updateStateHandler({
        payload: {
          payFastDetails: array,
          payFastScreen: payFast,
        },
      });
    }

    if (key !== "") {
      let array: any = [...PayFastDetails];
      array[index] = { [key]: value };
      setPayFastDetails(array);
      updateStateHandler({
        payload: {
          payFastDetails: array,
          payFastScreen: payFast,
        },
      });
    }
  };

  return payFastData ? (
    <>
    {methods[1]?.package?.package_name == "Payfast" && !emailValidated?
     <EmailOtp />:
    <Box>
      <Box display="flex" justifyContent={"space-between"} padding="15px">
        {/* <Box
          width="70px"
          height="80px"
          bgcolor={payFast === 1 ? "#FFEEF6" : "#fff"}
          border={payFast === 1 ? "1px solid #E72E80" : "1px solid #D1D5DB"}
          borderRadius="10px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          onClick={() => {
            setPayFast(1);
            setPayFastDetails([]);
          }}
        >
          <img
            src="/assets/bankAccount.svg
                            "
            alt="payFast"
          />
          <Typography fontSize={"12px"} textAlign="center">
            Bank Account
          </Typography>
        </Box>
        <Box
          width="70px"
          height="80px"
          bgcolor={payFast === 2 ? "#FFEEF6" : "#fff"}
          border={payFast === 2 ? "1px solid #E72E80" : "1px solid #D1D5DB"}
          borderRadius="10px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          onClick={() => {
            setPayFast(2);
            setPayFastDetails([]);
          }}
        >
          <img
            src="/assets/unionPay.svg
                            "
            alt="payFast"
          />
          <Typography fontSize={"12px"} textAlign="center">
            Card Payment
          </Typography>
        </Box> */}
        <Box
          width="70px"
          height="80px"
          bgcolor={payFast === 3 ? "#FFEEF6" : "#fff"}
          border={payFast === 3 ? "1px solid #E72E80" : "1px solid #D1D5DB"}
          borderRadius="10px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          onClick={() => {
            setPayFastDetails([]);
            setPayFast(3);
          }}
        >
          <img
            // src="/assets/payPak.svg"
            src="/assets/bankAccount.svg"
            alt="payFast"
          />
          <Typography fontSize={"12px"} textAlign="center">
            Card Payment
          </Typography>
        </Box>
        {/* <Box
          width="70px"
          height="80px"
          bgcolor={payFast === 4 ? "#FFEEF6" : "#fff"}
          border={payFast === 4 ? "1px solid #E72E80" : "1px solid #D1D5DB"}
          borderRadius="10px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          onClick={() => {
            setPayFastDetails([]);
            setPayFast(4);
          }}
        >
          <img src="/assets/mobileWallet.svg" alt="mobile wallet" />
          <Typography fontSize={"12px"} textAlign="center">
            Mobile Wallet
          </Typography>
        </Box> */}
      </Box>
      {payFast === 1 ? (
        <Box>
          <FormControl variant="standard" sx={{ minWidth: "100%" }}>
            <InputLabel className="ms-2" id="demo-simple-select-standard-label">
              Please Select Bank
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              //   value={age}
              //   onChange={handleChange}
              label="Select Bank"
            >
              <MenuItem value="" className="ms-2" disabled={true}>
                Select Bank
              </MenuItem>
              {payFastData
                ?.filter((fl: any) => fl.is_wallet === false)
                .map((item: any) => {
                  return (
                    <MenuItem
                      key={item.bank_code}
                      onClick={() => {
                        getObject([item.name, item.bank_code], "", "", 0);
                        updateStateHandler({
                          payload: {
                            bankName: item.name,
                            bankID: item.bank_code,
                          },
                        });
                      }}
                      className="ms-2"
                      value={item.name}
                    >
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <div className="center-box">
            <div>
              <Row className="mt-2 mb-10">
                <Col xs={12} md={12} className="">
                  <TextField
                    autoFocus
                    size="small"
                    className="single-input"
                    id="filled-basic-card"
                    // label="Card Number"
                    placeholder="Account Number"
                    variant="filled"
                    style={{ width: "100%" }}
                    InputProps={{
                      className: "input-card",
                      inputMode: "numeric",
                    }}
                    type="text"
                    ref={quantityInputRef}
                    // onInput={(e: any) => {
                    //   let value = e.target.value;
                    //   value = value.replaceAll(" ", "");

                    //   // value = Math.max(0, parseInt(value)).toString().slice(0, 16);
                    //   value = parseInt(value).toString().slice(0, 20);
                    //   let joy = value.match(/.{1,4}/g);
                    //   value = joy ? joy.join(" ") : "";
                    // }}

                    // onBlur={(e) => {
                    //   if (number != "") {
                    //     validateCardNumberHandler();
                    //   }
                    // }}
                    onChange={(e: any) => {
                      getObject([], "Account_Number", e.target.value, 1);

                      if (window.location.pathname != "/failure") {
                        // const regexTest = /^[0-9 ]+$/;
                        let value = e.target.value;

                        // value = value.replaceAll(" ", "");
                        // let joy = value.match(/.{1,4}/g);
                        // joy = joy ? joy.join(" ") : "";

                        // if ((joy == "" || regexTest.test(joy)) && joy.length < 20) {
                        setNumber(value);

                        // }
                      } else {
                        // const regexTest = /^[0-9 ]+$/;
                        let value = e.target.value;
                        // if (value.length < 20) {
                        setNumber(value);

                        if (encrypted != null) {
                          encrypted.card_number = e.target.value;
                        }
                      }
                    }}
                  />
                </Col>
                <Col xs={12} md={12} className="mt-3">
                  <TextField
                    size="small"
                    className="single-input"
                    id="filled-basic-card"
                    // label="Card Number"
                    placeholder="CNIC Number"
                    variant="filled"
                    style={{ width: "100%" }}
                    InputProps={{
                      className: "input-card",
                      inputMode: "numeric",
                    }}
                    type="text"
                    onChange={(e) => {
                      getObject([], "cnic_number", e.target.value, 2);
                    }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Box>
      ) : payFast === 2 ? (
        <>
          <Row className="mt-2 mb-10">
            <Col xs={12} md={12} className="">
              <TextField
                autoFocus
                size="small"
                className="single-input"
                id="filled-basic-card"
                // label="Card Number"
                placeholder="Card Number"
                variant="filled"
                style={{ width: "100%" }}
                InputProps={{
                  className: "input-card",
                  inputMode: "numeric",
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{ paddingBottom: "10px" }}
                        src="/assets/card.svg"
                        alt="img"
                      ></img>
                    </InputAdornment>
                  ),
                }}
                type="text"
                ref={quantityInputRef}
                onInput={(e: any) => {
                  let value = e.target.value;
                  value = value.replaceAll(" ", "");
                  // value = Math.max(0, parseInt(value)).toString().slice(0, 16);
                  value = parseInt(value).toString().slice(0, 16);
                  let joy = value.match(/.{1,4}/g);
                  value = joy ? joy.join(" ") : "";
                }}
                onBlur={(e) => {
                  if (number != "") {
                    validateCardNumberHandler();
                  }
                }}
                value={PayFastDetails[0]?.card_number ?? ""}
                onChange={(e: any) => {
                  if (e.target.value >= 220543 && e.target.value <= 220642) {
                    setError("PayPak Cards Not Accepted");
                  } else if (e.target.value == "") {
                    setError("");
                  }
                  if (window.location.pathname != "/failure") {
                    const regexTest = /^[0-9 ]+$/;
                    let value = e.target.value;

                    value = value.replaceAll(" ", "");
                    let joy = value.match(/.{1,4}/g);
                    joy = joy ? joy.join(" ") : "";

                    if ((joy == "" || regexTest.test(joy)) && joy.length < 20) {
                      getObject([], "card_number", joy, 0);
                    }
                  } else {
                    const regexTest = /^[0-9 ]+$/;
                    let value = e.target.value;
                    console.log(value.length);

                    if (value.length < 17) {
                      getObject([], "card_number", value, 0);
                    }
                  }
                }}
              />
            </Col>
            <Col lg={6} md={6} xs={6} className="mt-20">
              <TextField
                size="small"
                className=""
                id="filled-basic-card"
                variant="filled"
                style={{ width: "100%" }}
                type="text"
                InputProps={{
                  className: "input-card  padding-top-10",
                }}
                placeholder="Expiry (mm/yy)"
                value={PayFastDetails[1]?.expiry ?? ""}
                onBlur={(e) => {
                  if (PayFastDetails[1]?.expiry) basicExpiryValidation();
                }}
                onChange={(e) => {
                  handleChangeCardExpiryHandler(e);
                }}
              />
            </Col>
            <Col lg={6} md={6} xs={6} className="mt-20">
              <TextField
                size="small"
                className=""
                id="filled-basic-card"
                placeholder="CVV"
                variant="filled"
                style={{ width: "100%" }}
                InputProps={{
                  className: "input-card padding-top-10 ",
                }}
                type="password"
                onInput={(e: any) => {
                  e.target.value = e.target.value.toString().slice(0, 3);
                  // e.target.value = Math.max(0, parseInt(e.target.value))
                  //   .toString()
                  //   .slice(0, 3);
                }}
                value={PayFastDetails[2]?.cvc ?? ""}
                onChange={(e: any) => {
                  getObject(
                    [],
                    "cvc",
                    isNaN(e.target.value) ? "" : e.target.value,
                    2
                  );
                  if (encrypted != null) {
                    encrypted.cvc = e.target.value;
                  }
                }}
                onBlur={(e) => {
                  validateCvvHandler(e);
                }}
              />
            </Col>
          </Row>

          <Col xs={12} md={12} className="">
            <TextField
              size="small"
              className="single-input"
              id="filled-basic-card"
              // label="Card Number"
              placeholder="Phone Number"
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "input-card",
                inputMode: "numeric",
              }}
              value={PayFastDetails[3]?.phone_number ?? ""}
              type="text"
              inputMode="numeric"
              onChange={(e) => {
                getObject([], "phone_number", e.target.value, 3);
              }}
            />
          </Col>
        </>
      ) : payFast === 3 ? (
        <Row className="mt-2 mb-10">
          <Col xs={12} md={12} className="">
            <TextField
              autoFocus
              size="small"
              className="single-input"
              id="filled-basic-card"
              autoComplete="on"
              // label="Card Number"
              placeholder="Card Number"
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "input-card",
                inputMode: "numeric",
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      style={{ paddingBottom: "10px" }}
                      src="/assets/card.svg"
                    ></img>
                  </InputAdornment>
                ),
              }}
              value={number}
              type="text"
              ref={quantityInputRef}
              onInput={(e: any) => {
                let value = e.target.value;
                value = value.replaceAll(" ", "");

                // value = Math.max(0, parseInt(value)).toString().slice(0, 16);
                value = parseInt(value).toString().slice(0, 16);
                let joy = value.match(/.{1,4}/g);
                value = joy ? joy.join(" ") : "";
              }}
              onBlur={(e) => {
                if (number != "") {
                  validateCardNumberHandler();
                }
              }}
              onChange={async (e: any) => {
                if (e.target.value.length < 19) {
                  setError("Card is invalid.Please insert valid card number.");
                }
                if (e.target.value >= 220543 && e.target.value <= 220642) {
                  setError("PayPak Cards Not Accepted");
                } else {
                  setError("");
                }
                if (window.location.pathname != "/failure") {
                  const regexTest = /^[0-9 ]+$/;
                  let value = e.target.value;

                  value = value.replaceAll(" ", "");
                  let joy = value.match(/.{1,4}/g);
                  joy = joy ? joy.join(" ") : "";

                  if (value.length >= 6) {
                    if (discountFlag === true && discount === 0)
                      fetchBinDiscount(value);
                  } else if (value.length === 0) {
                    updateStateHandler({
                      payload: {
                        discountedAmount:
                          Number(discountedAmount) - discount < 0
                            ? 0
                            : Number(discountedAmount) - discount,
                      },
                    });
                    setDiscount(0);
                  }
                  if ((joy == "" || regexTest.test(joy)) && joy.length < 20) {
                    setNumber(joy);
                    props.setNumber(joy);
                  }
                } else {
                  const regexTest = /^[0-9 ]+$/;
                  let value = e.target.value;
                  if (value.length < 17) {
                    setNumber(value);
                    props.setNumber(value);

                    if (props.encrypted != null) {
                      props.encrypted.card_number = e.target.value;
                    }
                  }
                }
              }}
            />
          </Col>

          {/* <Col md={12} className="mt-20">
          <TextField
              className="single-input"
              id="filled-basic-card"
            label="Card Number"
            variant="filled"
            style={{ width: "100%" }}
            InputProps={{
              className: "user-input-card  border-grey",
            }}
            value={number}
            type="Number"
            ref={quantityInputRef}
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 16);
            }}
            onBlur={(e) => {
              if (number != "") {
                validateCardNumberHandler();
              }
            }}
            onChange={(e: any) => {
              if (e.target.value >= 220543 && e.target.value <= 220642) {
                setError("PayPak Cards Not Accepted");
              } else if (e.target.value == "") {
                setError("");
              }

              setNumber(e.target.value);
              props.setNumber(e.target.value);
              if (props.encrypted != null) {
                props.encrypted.card_number = e.target.value;
              }
            }}
          />
        </Col> */}
          <Col lg={6} md={6} xs={6} className="mt-20">
            <TextField
              size="small"
              className=""
              id="filled-basic-card"
              variant="filled"
              autoComplete="on"
              style={{ width: "100%" }}
              type="text"
              InputProps={{
                className: "input-card  padding-top-10",
              }}
              value={expiry}
              placeholder="Expiry (mm/yy)"
              onBlur={(e) => {
                basicExpiryValidation();
              }}
              onChange={(e) => {
                handleChangeCardExpiryHandler(e);
              }}
            />
          </Col>
          <Col lg={6} md={6} xs={6} className="mt-20">
            {/* <TextField
            className=""
            id="filled-basic"
            label="CVV"
            variant="filled"
            style={{ width: "100%" }}
            InputProps={{
              className: "user-input-card  border-grey",
            }}
            value={cvc}
            type="password"
            onInput={(e: any) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 3);
            }}
            onChange={(e: any) => {
              setCvc(isNaN(e.target.value) ? "" : e.target.value);
              props.setCvc(isNaN(e.target.value) ? "" : e.target.value);
              if (props.encrypted != null) {
                props.encrypted.cvc = e.target.value;
              }
            }}
            onBlur={(e) => {
              validateCvvHandler(e);
            }}
          /> */}

            <TextField
              size="small"
              className=""
              id="filled-basic-card"
              placeholder="CVV"
              autoComplete="on"
              disabled={number === ""}
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "input-card padding-top-10 ",
              }}
              value={cvc}
              type="password"
              onInput={(e: any) => {
                if (number.slice(0, 1) === "3")
                  e.target.value = e.target.value.toString().slice(0, 4);
                else e.target.value = e.target.value.toString().slice(0, 3);

                // e.target.value = Math.max(0, parseInt(e.target.value))
                //   .toString()
                //   .slice(0, 3);
              }}
              onChange={(e: any) => {
                setCvc(isNaN(e.target.value) ? "" : e.target.value);
                props.setCvc(isNaN(e.target.value) ? "" : e.target.value);
                if (props.encrypted != null) {
                  props.encrypted.cvc = e.target.value;
                }
              }}
              onBlur={(e) => {
                validateCvvHandler(e);
              }}
            />
          </Col>
        </Row>
      ) : payFast === 4 ? (
        <Box>
          <FormControl variant="standard" sx={{ minWidth: "100%" }}>
            <InputLabel className="ms-2" id="demo-simple-select-standard-label">
              Please Select Bank
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              //   value={age}
              //   onChange={handleChange}
              label="Select Bank"
            >
              <MenuItem value="" className="ms-2" disabled={true}>
                Select Bank
              </MenuItem>
              {payFastData
                ?.filter((fl: any) => fl.is_wallet === true)
                .map((item: any) => {
                  return (
                    <MenuItem
                      key={item.bank_code}
                      onClick={() => {
                        getObject([item.name, item.bank_code], "", "", 0);
                        updateStateHandler({
                          payload: {
                            bankName: item.name,
                            bankID: item.bank_code,
                          },
                        });
                      }}
                      className="ms-2"
                      value={item.name}
                    >
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <div className="center-box">
            <div>
              <Row className="mt-2 mb-10">
                <Col xs={12} md={12} className="">
                  <TextField
                    autoFocus
                    size="small"
                    className="single-input"
                    id="filled-basic-card"
                    // label="Card Number"
                    placeholder="Account Number"
                    variant="filled"
                    style={{ width: "100%" }}
                    InputProps={{
                      className: "input-card",
                      inputMode: "numeric",
                    }}
                    type="text"
                    ref={quantityInputRef}
                    // onInput={(e: any) => {
                    //   let value = e.target.value;
                    //   value = value.replaceAll(" ", "");

                    //   // value = Math.max(0, parseInt(value)).toString().slice(0, 16);
                    //   value = parseInt(value).toString().slice(0, 20);
                    //   let joy = value.match(/.{1,4}/g);
                    //   value = joy ? joy.join(" ") : "";
                    // }}
                    onBlur={(e) => {
                      if (number != "") {
                        validateCardNumberHandler();
                      }
                    }}
                    onChange={(e: any) => {
                      getObject([], "Account_Number", e.target.value, 1);

                      if (window.location.pathname != "/failure") {
                        // const regexTest = /^[0-9 ]+$/;
                        let value = e.target.value;

                        // value = value.replaceAll(" ", "");
                        // let joy = value.match(/.{1,4}/g);
                        // joy = joy ? joy.join(" ") : "";

                        // if ((joy == "" || regexTest.test(joy)) && joy.length < 20) {
                        setNumber(value);

                        // }
                      } else {
                        // const regexTest = /^[0-9 ]+$/;
                        let value = e.target.value;
                        // if (value.length < 20) {
                        setNumber(value);

                        if (encrypted != null) {
                          encrypted.card_number = e.target.value;
                        }
                      }
                    }}
                  />
                </Col>
                <Col xs={12} md={12} className="mt-3">
                  <TextField
                    size="small"
                    className="single-input"
                    id="filled-basic-card"
                    // label="Card Number"
                    placeholder="CNIC Number"
                    variant="filled"
                    style={{ width: "100%" }}
                    InputProps={{
                      className: "input-card",
                      inputMode: "numeric",
                    }}
                    type="text"
                    onChange={(e) => {
                      getObject([], "cnic_number", e.target.value, 2);
                    }}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Box>
      ) : (
        " "
      )}
      {error && (
        <p className="text-start d-flex mt-3 mb-0">
          <img src="assets/error.svg" alt="error" className="img-fluid" />
          <p className="text-danger ms-1">{error}</p>
        </p>
      )}
      
      
    </Box>
    }
    </>
  ) : (
    <>
      <div className="text-center justify-content-center d-flex my-4">
        <ClipLoader color="#E93A7D" size={35} />
      </div>
    </>
  );
  
};
export default PayFast;
