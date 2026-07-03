import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { EOtpType } from "../../enums/otp-type.enum";
import { routes } from "../../router/routes";
import { facebookEvents } from "../../services/facebookEvents.service";
import { Context as CheckoutContext } from "../context/checkoutContext";

export const useFacebookHook = () => {
  const {
    state: { intlNumber, identityToken },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const [onLoad, setOnLoad] = useState<boolean>(false);
  const [phoneValidity, setPhoneValidity] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showHelpUs, setShowHelpUs] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const history = useHistory();

  /**
   * @description get the url and git cloudfront api to get the country code
   * * default country code will be 'pk'
   * @returns Promise<string>
   */
  const getMerchantScripts = async (iden: any) => {
    // try {
    //     const response = await facebookEvents.getFacebookScript('', {
    //         headers: {
    //             "identity-token": iden,
    //             Accept: "application/json"
    //         },
    //     });
    //     // if (response) {
    //         console.log(response);
    //         if(response && response.data) {
    //           let data = response.data;
    //           if(data) {
    //             if(data.length){
    //               var sc = document.createElement("script");
    //               sc.setAttribute("src", data[0]);
    //               sc.setAttribute("type", "text/javascript");
    //               document.head.appendChild(sc);
    //             }
    //           }
    //         }
    //     // }
    // } catch (err) {
    //     console.log(err);
    // }
  };

  return {
    handlers: {
      getMerchantScripts,
    },
  };
};
