import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../../styles/survey.css";
import "../../styles/phoneScreen.css";
import "../../styles/checkout.css";
import Surveydiv from "../SurveyDiv/surveydiv";
import "react-intl-tel-input/dist/main.css";
import { styled } from "@mui/material/styles";
import Radio, { RadioProps } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IntlTelInput from "react-intl-tel-input";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import FinishSurveyModal from "../modals/FinishSurveyModal";
import { createTheme, ThemeProvider, createStyles } from "@mui/material/styles";
import Input from "@mui/material/Input";
import { TextField, Zoom } from "@mui/material";
import { recoveryService } from "../../services/recovery.service";
import { usePhoneHook } from "../../hooks/custom/usePhone";
const theme = createTheme({
  palette: {
    primary: {
      main: "#D4D4D4",
    },
  },
});

const ariaLabel = { "aria-label": "description" };

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto #E72E80",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#E72E80",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#E72E80",
  },
});

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      sx={{
        "&:hover": {
          bgcolor: "transparent",
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

const reasons = {
  r1: "I'm not ready to buy yet",
  r2: "Checkout is not loading properly",
  r3: "I want to add more items to cart",
  r4: "I'm unable to fill my information",
  r5: "Other",
};

export default function Survey(props) {
  const [radioButtonControl, setRadioButtonControl] = useState("");
  const [internationalNum, setInterNum] = useState("");
  const [others, setOthers] = useState("");
  const [othervalidation, setOthervalidation] = useState("false");
  const [isValidNumber, setisValidNumber] = useState(false);
  const [errormessage, setErrormessage] = useState(false);
  const onDelChange = (e) => {
    setRadioButtonControl(e.target.value);
    setErrormessage(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    bgcolor: "background.paper",
    borderRadius: "4px",
    marginTop: "50px",
  };

  const handleClose = () => {
    updateStateHandler({
      payload: {
        surveyOpen: false,
      },
    });
  };

  const {
    states: { onLoad, showHelpUs, error, phoneValidity, acceptTerms },
    setStates: { setPhoneValidity, setAcceptTerms },
    handlers: { updatePhoneNumberHandler },
  } = usePhoneHook();

  const {
    state: {
      surveyOpen,
      phoneNumber,
      finishSurveyOpen,
      customerId,
      countryCode,
      identityToken,
      totalAmount
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const submitFeedbackHandler = async () => {
    try {
      if (radioButtonControl == "") {
        setErrormessage(true);
      } else if (radioButtonControl == "r5" && others.length < 1) {
        setOthervalidation(true);
      } else {
        setErrormessage(false);
        const response = await recoveryService.sendUserFeedback({
          user_id: customerId,
          reason:
            radioButtonControl == "r5" ? others : reasons[radioButtonControl],
          phone_number: phoneNumber !== "" ? phoneNumber : internationalNum,
          token: identityToken,
          amount: totalAmount
        });
        
        

        if (!finishSurveyOpen) {
          updateStateHandler({
            payload: {
              surveyOpen: false,
              finishSurveyOpen: true,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>

      <Modal
      className=" overflow-scroll h-100vh "
        open={surveyOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              backgroundColor: "#FDEAF2",
              height: "20%",
              borderRadius: "4px",
            }}
          >
            <div onClick={handleClose} className="crossBtn1">
              <img src="/assets/cross.svg"></img>
            </div>

            <div className="textdecordiv">
              <p className="textdecore1">Hi there, Sorry to see you go.</p>
              <p className="textdecore">
                What stopped you from completing the order?
              </p>
            </div>
          </div>

          <div className="radiomaindiv">
            <FormControl style={{ width: "100%" }}>
              <RadioGroup
                aria-labelledby="demo-customized-radios"
                name="customized-radios"
              >
                <div
                  className={`${
                    radioButtonControl == "r1"
                      ? "checkedradiomaindiv1"
                      : "radiomaindiv1"
                  }`}
                >
                  <FormControlLabel
                    className="radiotextt"
                    onChange={onDelChange}
                    value="r1"
                    control={<BpRadio />}
                    label="I'm not ready to buy yet"
                  />
                </div>
                <div
                  className={`${
                    radioButtonControl == "r2"
                      ? "checkedradiomaindiv1"
                      : "radiomaindiv1"
                  }`}
                >
                  <FormControlLabel
                    className="radiotextt"
                    onChange={onDelChange}
                    value="r2"
                    control={<BpRadio />}
                    label="Checkout is not loading properly"
                  />
                </div>
                <div
                  className={`${
                    radioButtonControl == "r3"
                      ? "checkedradiomaindiv1"
                      : "radiomaindiv1"
                  }`}
                >
                  <FormControlLabel
                    className="radiotextt"
                    onChange={onDelChange}
                    value="r3"
                    control={<BpRadio />}
                    label="I want to add more items to cart"
                  />
                </div>
                <div
                  className={`${
                    radioButtonControl == "r4"
                      ? "checkedradiomaindiv1"
                      : "radiomaindiv1"
                  }`}
                >
                  <FormControlLabel
                    className="radiotextt"
                    onChange={onDelChange}
                    value="r4"
                    control={<BpRadio />}
                    label="I'm unable to fill my information"
                  />
                </div>

                <div
                  className={`${
                    radioButtonControl == "r5"
                      ? "checkedradiomaindiv2"
                      : "radiomaindiv1"
                  }`}
                >
                  <FormControlLabel
                    className="radiotextt"
                    onChange={onDelChange}
                    value="r5"
                    control={<BpRadio />}
                    label="Other"
                  />
                  {radioButtonControl == "r5" ? (
                    <div>
                      <input
                        size="small"
                        className={`${
                          othervalidation == true
                            ? "errinputtextdecor "
                            : "inputtextdecor"
                        }`}
                        placeholder="Reason"
                        value={others}
                        onChange={(e) => setOthers(e.target.value)}
                        variant="filled"
                        style={{ width: "100%" }}
                        type="text"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                {othervalidation == true ? (
                  <div style={{ color: "#d81313", paddingLeft: "6px" }}>
                    Please enter reason
                  </div>
                ) : (
                  <div></div>
                )}
              </RadioGroup>
            </FormControl>

            <IntlTelInput
              containerClassName="intl-tel-input w-100"
              inputClassName="single-input-card2 outline-color-base2 w-100 h-50 text-16"
              fieldId="input"
              // autoFocus={true}
              defaultValue={phoneNumber}
              placeholder={"Phone Number (optional)"}
              
              format={true}
              disabled={isValidNumber ? true : false}
              defaultCountry={countryCode}
              preferredCountries={["pk", "us"]}
              value={phoneNumber}
              onPhoneNumberChange={(
                isValid,
                value,
                countryData,
                intlNumber
              ) => {
                updatePhoneNumberHandler(isValid, value, intlNumber);
                if (isValid) {
                  setPhoneValidity(isValid);
                  setisValidNumber(isValid);
                }
                // setCountryCode(countryData.iso2);
                // props.setCountryCode(countryData.iso2);
              }}
              onPhoneNumberBlur={(isValid) => {
                setPhoneValidity(isValid);
                setisValidNumber(isValid);
              }}
            />

            {/* <input className="phonenumberinput" value={phoneNumber} /> */}
          </div>
          {errormessage == true ? (
            <div style={{ color: "#d81313", paddingLeft: "27px" }}>
              Please select any option
            </div>
          ) : (
            <div></div>
          )}

          <div
            style={{
              width: "50%",
              margin: "auto",
              marginTop: "20px",
              marginBottom: "50px",
            }}
          >
            <button
              className="basic-btn submitButton"
              onClick={submitFeedbackHandler}
              variant="contained"
              // disabled={phonenumbervalidation ||othervalidation }
            >
              Submit
            </button>
          </div>
      
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
