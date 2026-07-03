// import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EditAddress from "./components/payment/shipping/changeAddress";
import UpsellCard from "./components/payment/upsellCard";

import { routes } from "./router/routes";
import { lazyLoad } from "./utils/loadable";
import { Context as CheckoutContext } from "./hooks/context/checkoutContext";
import Survey from "./components/modals/Survey";
import { useState, useContext, useEffect } from "react";
import FinishSurveyModal from "./components/modals/FinishSurveyModal";
import RedirectPage from "./pages/RedirectBack";
import AlfalahPayment from "./components/payment/AlfalahPayment";
import AlfaPayment from "./components/payment/AlfaPayment";
import ErrorBoundary from "./error/ErrorBoundary";
import AlfalahSubmitPage from "./pages/AlfalahSubmitPage";
import OpenCheckout from "./pages/OpenCheckout";
import PaymentFailurePage from "./pages/PaymentFailurePage";

const ValidateToken = lazyLoad(() => import("./utils/validateToken"));

const PhonePage = lazyLoad(() => import("./pages/PhonePage"));
const PhoneOtpPage = lazyLoad(() => import("./pages/PhoneOtpPage"));
const UserDetailPage = lazyLoad(() => import("./pages/UserDetailPage"));
const PaymentSelectionPage = lazyLoad(
  () => import("./pages/PaymentSelectionPage")
);
const EmailOtpPage = lazyLoad(() => import("./pages/EmailOtpPage"));
const PaymentDetailPage = lazyLoad(() => import("./pages/PaymentDetailPage"));
const PaymentSuccessPage = lazyLoad(() => import("./pages/PaymentSuccessPage"));
const OrderReviewPage = lazyLoad(() => import("./pages/OrderReviewPage"));
const PaymentCancelPage = lazyLoad(() => import("./pages/PaymentCancelPage"));

// console.log = () => {};
// console.error = () => {};
// console.debug = () => {};
declare global {
  interface Window {
    rudderanalytics?: any; // You might want to use a more specific type if available
  }
}
const RudderStackInitializer: React.FC = () => {
  useEffect(() => {
    (function () {
      var e = (window.rudderanalytics = window.rudderanalytics || []);
      e.methods = [
        // "load",
        // "page",
        // "track",
        // "identify",
        // "alias",
        // "group",
        // "ready",
        // "reset",
        // "getAnonymousId",
        // "setAnonymousId",
        // "getUserId",
        // "getUserTraits",
        // "getGroupId",
        // "getGroupTraits",
      ];
      e.factory = function (t: any) {
        return function () {
          var r = Array.prototype.slice.call(arguments);
          r.unshift(t);
          e.push(r);
          return e;
        };
      };

      for (var t = 0; t < e.methods.length; t++) {
        var r = e.methods[t];
        e[r] = e.factory(r);
      }

      e.loadJS = function (_e: any) {
        var r = document.createElement("script");
        r.type = "text/javascript";
        r.async = true;
        r.src = "https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";
        var a = document.getElementsByTagName("script")[0];
        a.parentNode?.insertBefore(r, a);
      };

      e.loadJS();
      e.load(
        "YOUR_RUDDERSTACK_WRITE_KEY",
        "https://qisstpayanpv.dataplane.rudderstack.com"
      );
    })();
  }, []);

  return null;
};

function App() {
  const {
    state: {
      isTez,
      place_order_on_merchant_site,
      is_headless,
      mall_ID,
      rudderStackID,
      wordUrl,
      customerId,
      ipAddress,
      identityToken,
      MerchantUserId,
      time_stamp,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalID);
  }, []);
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const actualTime = hours + ":" + minutes;
  useEffect(() => {
    updateStateHandler({
      payload: {
        time_stamp: actualTime,
      },
    });
  }, [actualTime]);
  const query = new URLSearchParams(wordUrl);
  const queryHeadless = query.get("is_headless");
  const callBack_url = query.get("call_back_url");
  const merchant_order_iD = query.get("merchant_order_id");
  const currentUrl = window.location.href;
  useEffect(() => {
    const fetchData = async () => {
      const url = "https://apis.qisstpay.com/ms-external-service/merchant_info";
      if (identityToken) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "identity-token": identityToken,
            },
            // You can include any request payload here if needed
            // body: JSON.stringify({ key: 'value' }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          updateStateHandler({
            payload: {
              MerchantUserId: data.data.user_id,
            },
          });
          // Process the response data here
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [identityToken]); // Run the effect only once when the component mounts
  useEffect(() => {
    if (ipAddress == "") {
      fetch("https://api64.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          updateStateHandler({
            payload: {
              ipAddress: data.ip,
            },
          });
        })
        .catch((error) => console.error("Error fetching IP address:", error));
    }
  }, []);
  useEffect(() => {
    updateStateHandler({
      payload: {
        is_headless: queryHeadless,
        callBackUrl: callBack_url,
        merchant_order_id: merchant_order_iD,
      },
    });
  }, [wordUrl]);
  useEffect(() => {
    const preconnectLink = document.createElement("link");
    preconnectLink.rel = "preconnect";

    if (MerchantUserId != 0) {
      preconnectLink.href = `https://apis.qisstpay.com/merchant/third-party/get?merchant_user_id=${MerchantUserId}`;
      document.head.appendChild(preconnectLink);
      fetch(
        `https://apis.qisstpay.com/merchant/third-party/get?merchant_user_id=${MerchantUserId}`,
        {
          method: "GET",
          redirect: "follow",
        }
      )
        .then((response) => response.json())
        .then((result) => {
          updateStateHandler({
            payload: {
              GoogleAnalyticsCred:
                result.merchant_third_party_app_credentials["Google Analytics"],
              min: result.merchants_limits.min_limit,
              max: result.merchants_limits.max_limit,
            },
          });
        })
        .catch((error) => console.log("error", error));
    }
  }, [MerchantUserId]);

  return (
    <div className="app">
      <ErrorBoundary>
        {/* changes */}
        {is_headless === "1" || is_headless === "0" ? (
          ""
        ) : (
          <>
            {(place_order_on_merchant_site &&
              place_order_on_merchant_site <= 1) ||
            is_headless === "0" ? (
              ""
            ) : (
              <>
                {isTez != 0 && (
                  <div
                    onClick={(e) => {
                      {
                        (global as any).rudderanalytics.track(
                          "Checkout Closed",
                          {},
                          {
                            anonymousId: rudderStackID,
                          }
                        );
                        window.parent.postMessage(
                          {
                            qp_flag_teez: false,
                          },
                          "*"
                        );
                      }
                    }}
                    className="crossBtn"

                    // onClick={(e) => {
                    //   const pathanme = window.location.pathname;
                    //   if (pathanme.includes("success") || pathanme.includes("review")) {
                    //     window.parent.postMessage(
                    //       {
                    //         qp_flag_teez: false,
                    //       },
                    //       "*"
                    //     );
                    //   } else {
                    //     if (!surveyOpen) {
                    //       updateStateHandler({
                    //         payload: {
                    //           surveyOpen: true,
                    //         },
                    //       });
                    //     }
                    //   }
                    // }}
                  >
                    <img
                      rel="preload"
                      src="/assets/cross.svg"
                      width="14px"
                      height="14px"
                    ></img>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {mall_ID && (
          <>
            {(place_order_on_merchant_site &&
              place_order_on_merchant_site <= 1) ||
            is_headless === "0" ? (
              ""
            ) : (
              <>
                {isTez != 0 && (
                  <div
                    onClick={(e) => {
                      {
                        (global as any).rudderanalytics.track(
                          "iframe_closed",
                          {},
                          {
                            time_stamp: time_stamp,
                            user_id: customerId,
                            merchantId: MerchantUserId,
                            anonymousId: rudderStackID,
                          }
                        );
                        window.parent.postMessage(
                          {
                            qp_flag_teez: false,
                          },
                          "*"
                        );
                      }
                    }}
                    className="crossBtn"

                    // onClick={(e) => {
                    //   const pathanme = window.location.pathname;
                    //   if (pathanme.includes("success") || pathanme.includes("review")) {
                    //     window.parent.postMessage(
                    //       {
                    //         qp_flag_teez: false,
                    //       },
                    //       "*"
                    //     );
                    //   } else {
                    //     if (!surveyOpen) {
                    //       updateStateHandler({
                    //         payload: {
                    //           surveyOpen: true,
                    //         },
                    //       });
                    //     }
                    //   }
                    // }}
                  >
                    <img src="/assets/cross.svg"></img>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <Survey />
        <FinishSurveyModal />
        <Router>
          <ValidateToken />
          {currentUrl.includes("localhost") ? <RudderStackInitializer /> : null}
          <Switch>
            {ipAddress != "" ? (
              <Route exact path={routes.phonePage} component={PhonePage} />
            ) : null}
            <Route exact path={routes.phoneOtpPage} component={PhoneOtpPage} />
            <Route
              exact
              path={routes.userDetailPage}
              component={UserDetailPage}
            />
            <Route
              exact
              path={routes.paymentSelectionPage}
              component={PaymentSelectionPage}
            />
            <Route exact path={routes.emailOtpPage} component={EmailOtpPage} />
            <Route
              exact
              path={routes.paymentDetailPage}
              component={PaymentDetailPage}
            />
            <Route
              exact
              path={routes.paymentFailurePage}
              component={PaymentFailurePage}
            />
            <Route
              exact
              path={routes.paymentSuccessPage}
              component={PaymentSuccessPage}
            />
            <Route
              exact
              path={routes.orderReview}
              component={OrderReviewPage}
            />
            <Route
              exact
              path={routes.orderCancel}
              component={PaymentCancelPage}
            />
            <Route exact path={routes.editAddress} component={EditAddress} />
            <Route exact path={routes.upsell} component={UpsellCard} />
            <Route exact path={routes.redirect} component={RedirectPage} />
            <Route
              exact
              path={"/alfalah-submit-page"}
              component={AlfalahSubmitPage}
            />
            <Route
              exact
              path={"/bankAlfalahRedirect/:sessionID/:orderID/:amount"}
              component={AlfalahPayment}
            />
            <Route
              exact
              path={"/bankAlfaRedirect/:merchantID/:amount"}
              component={AlfaPayment}
            />
            <Route
              exact
              path={"/open-checkout-iframe"}
              component={OpenCheckout}
            />
          </Switch>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;
