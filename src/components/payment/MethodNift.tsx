import { useEffect, useRef, useState, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { AnyCnameRecord } from "dns";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import IntlTelInput from "react-intl-tel-input";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import "../../styles/phoneScreen.css";
import { set } from "lodash";
import PhoneOtpPage from "../../pages/PhoneOtpPage";
import EmailOtp from "../otp/EmailOtp";
import PhoneOtp from "../otp/PhoneOTPNift";
import { setUserData } from "../../helper/setUserData";

interface IProps {
  niftPaymentCheckoutHandler: Function;
  otpPage: any;
}

const CardDetailNift: React.FC<IProps> = (props: IProps) => {
  const [error, setError] = useState<string>("");
  const [otpPage, setOtpPage] = useState<boolean>(false);
  const quantityInputRef = useRef<any>(null);
  const [disable, setDisable] = useState<boolean>(false);

  const {
    state: {
      countryCode,
      intlNumber,
      phoneNumber,
      cnic,
      selectedBank,
      banks,
      accountNumber,
      orderId,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  useEffect(() => {}, [props]);

  useEffect(() => {
    const ignoreScroll = (e: any) => {
      e.preventDefault();
    };
    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);

  const requestNiftPaymentHandler = async () => {
    setDisable(true);
    await props.niftPaymentCheckoutHandler();
    setDisable(false);
    // setTimeout(() => {
    //   setDisable(false);

    //   if (orderId != "") setOtpPage(true);
    // }, 1000);
  };

  return (
    <div className="center-box">
      {!props.otpPage && (
        <div>
          <Row className="mb-10">
            <Col xs={12} md={12} lg={12} className="mt-20">
              <TextField
                id="filled-basic"
                placeholder="Banks"
                value={selectedBank}
                onChange={(e) =>
                  updateStateHandler({
                    payload: {
                      selectedBank: e.target.value,
                    },
                  })
                }
                InputProps={{
                  className: "user-input-card-nift",
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{ paddingBottom: "10px" }}
                        src="/assets/cnic.svg"
                      ></img>
                    </InputAdornment>
                  ),
                }}
                size="small"
                className=""
                variant="filled"
                style={{ width: "100%" }}
              >
                {/* <MenuItem key={"bank.bankCode"} value={"bank.bankCode"}>
                  {"bank.name"}
                </MenuItem> */}
                {banks.map((bank) => (
                  <MenuItem key={bank.bankCode} value={bank.bankCode}>
                    {bank.name}
                  </MenuItem>
                ))}
              </TextField>
            </Col>
            <Col xs={12} md={12} style={{ marginTop: "30px" }}>
              <TextField
                value={accountNumber}
                size="small"
                className="single-input"
                id="filled-basic-card"
                placeholder="Account Number"
                variant="filled"
                style={{ width: "100%" }}
                onInput={(e: any) => {
                  e.target.value = e.target.value.toString().slice(0, 18);
                }}
                InputProps={{
                  className: "input-card",
                  inputMode: "numeric",
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{ paddingBottom: "10px" }}
                        src="/assets/cnic.svg"
                      ></img>
                    </InputAdornment>
                  ),
                }}
                type="text"
                onChange={(e) =>
                  updateStateHandler({
                    payload: {
                      accountNumber: e.target.value,
                    },
                  })
                }
              />
            </Col>
            <Col xs={12} md={12} style={{ marginTop: "30px" }}>
              <TextField
                value={cnic}
                size="small"
                className="single-input"
                id="filled-basic-card"
                // label="Card Number"
                placeholder="Enter CNIC"
                variant="filled"
                style={{ width: "100%" }}
                onInput={(e: any) => {
                  e.target.value = e.target.value.toString().slice(0, 15);
                }}
                InputProps={{
                  className: "input-card",
                  inputMode: "numeric",
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        style={{ paddingBottom: "10px" }}
                        src="/assets/cnic.svg"
                      ></img>
                    </InputAdornment>
                  ),
                }}
                type="text"
                onChange={(e) =>
                  updateStateHandler({
                    payload: {
                      cnic: e.target.value,
                    },
                  })
                }
              />
            </Col>

            <Col md={12} xs={12} lg={12}>
              {countryCode != "" && (
                <IntlTelInput
                  containerClassName="intl-tel-input w-100 mt-30"
                  inputClassName="single-input-card2 outline-color-base2 border-bottom-only w-100 h-50 text-16"
                  fieldId="input"
                  defaultValue={phoneNumber}
                  autoPlaceholder
                  format={true}
                  defaultCountry={countryCode}
                  preferredCountries={["pk", "us"]}
                  // onlyCountries={["pk", "bd", "lk", "us"]}
                  value={phoneNumber}
                  onSelectFlag={(e) => {
                    // updateStateHandler({
                    //   payload: {
                    //     phoneNumber: "",
                    //     intlNumber: "",
                    //   },
                    // });
                  }}
                  onPhoneNumberChange={(
                    isValid,
                    value,
                    countryData,
                    intlNumber
                  ) => {
                    // updatePhoneNumberHandler(isValid, value, intlNumber);
                    if (isValid) {
                      // setPhoneValidity(isValid);
                    }
                    // setCountryCode(countryData.iso2);
                    // props.setCountryCode(countryData.iso2);
                  }}
                  onPhoneNumberBlur={(isValid) => {
                    // setPhoneValidity(isValid);
                  }}
                />
              )}
            </Col>

            <Col md={12} xs={12} lg={12} style={{ marginTop: "30px" }}>
              {!disable && (
                <button
                  onClick={requestNiftPaymentHandler}
                  type="button"
                  className="basic-btn margin-top-0 "
                >
                  <div>
                    <p>Continue</p>
                  </div>
                </button>
              )}
              {disable && (
                <button type="button" className="basic-btn margin-top-0 ">
                  <div>
                    <p> Please Wait...</p>
                  </div>
                </button>
              )}
            </Col>
          </Row>

          {error != "" && (
            <div className="w-100 mt-30 flex ">
              {/* <img src={Constant.Error} /> */}
              <p className="pl-10 error-msg">{error}</p>
            </div>
          )}
        </div>
      )}
      {props.otpPage && <PhoneOtp />}
    </div>
  );
};

export default CardDetailNift;
