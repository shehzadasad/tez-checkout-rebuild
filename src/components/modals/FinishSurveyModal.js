import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import styles from "../../styles/survey.css";
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

export default function FinishSurvey(props) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    bgcolor: "background.paper",
    borderRadius: "4px",
  };

  const [open, setOpen] = React.useState(false);
  const {
    state: { finishSurveyOpen, rudderStackID },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const handleClose = () => {
    updateStateHandler({
      payload: {
        surveyOpen: false,
        finishSurveyOpen: false,
      },
    });
    window.parent.postMessage(
      {
        qp_flag_teez: false,
      },
      "*"
    );
  };

  return (
    <Modal
      open={finishSurveyOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={{ backgroundColor: "#FFFFF", borderRadius: "4px" }}>
          <div onClick={handleClose} className="crossBtnfinish">
            <img src="/assets/cross.svg"></img>
          </div>

          <div
            className="textdecordiv"
            style={{ paddingTop: "41px", paddingBottom: "0px" }}
          >
            <p className="textdecore">Finished</p>
          </div>
        </div>

        <div className="finishsurveymaindiv">
          Thank you for your time. Your response has been successfully
          submitted.
        </div>

        <div style={{ width: "50%", margin: "auto", marginTop: "0px" }}>
          <button
            onClick={handleClose}
            className="closebutton submitButton"
            variant="contained"
          >
            Close
          </button>
        </div>
      </Box>
    </Modal>
  );
}
