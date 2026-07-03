import React, { useContext, useEffect, useState } from "react";
import IntlTelInput from "react-intl-tel-input";
import { lazyLoad } from "../utils/loadable";
import "react-intl-tel-input/dist/main.css";
import { usePhoneHook } from "../hooks/custom/usePhone";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../router/routes";
import { Row, Col, Form } from "react-bootstrap";
import Cart from "../components/cart/cart";
import "../styles/phoneScreen.css";
import "../styles/checkout.css";
import { generalService } from "../services/general.service";
import { recoveryService } from "../services/recovery.service";
import HelpUsModal from "../components/modals/HelpUsModal";

const RedirectPage: React.FC = () => {
  const {
    states: { onLoad, showHelpUs, error, phoneValidity, acceptTerms, shortURL },
    setStates: { setPhoneValidity, setAcceptTerms },
    handlers: {
      getCountryCodeHandler,
      closeHelpUsModalHandler,
      showHelpUsModalHandler,
      sendOtpHandler,
      updatePhoneNumberHandler,
      guestCheckoutHandler,
      handleKeyPressHandler,
      bityCall,
      getLinkUrl,
    },
  } = usePhoneHook();

  const {
    state: { shorten_url },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const location = useLocation();

  const [idOfUrl, setidOfUrl] = useState<any>("");

  useEffect(() => {
    const search = location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const token = params.get("id");
    setidOfUrl(token);
  }, []);

  useEffect(() => {
    if (idOfUrl != "") {
      getLinkUrl(idOfUrl);
    }
  }, [idOfUrl]);
  return <>Redirecting...</>;
};

export default RedirectPage;
