import { useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Context as CheckoutContext } from "../hooks/context/checkoutContext";
import { routes } from "../router/routes";

export default function ValidateToken() {
  const { pathname, search } = useLocation();
  const history = useHistory();
  const {
    state: { identityToken },
  } = useContext(CheckoutContext);

  useEffect(() => {
    const searchQuery = search; // could be '?foo=bar'
    const params = new URLSearchParams(searchQuery);
    const token = params.get("identity-token");
    const trackingId = params.get("tracking_id");
    // console.log(token,trackingId,pathname,"from validation")
    if (pathname == "/") {
      
      if (!token && !identityToken && !trackingId) {
        alert("warning");
      }
    } else if (pathname == "/success" || pathname == "/failure") {
      // console.log("inside ++", trackingId, pathname)

      if (!trackingId) {
        // history.replace(routes.phonePage);
      }
    } 


    else {
      if (!identityToken) {
        // history.replace(routes.phonePage);
      }
    }
  }, [pathname]);

  return null;
}
