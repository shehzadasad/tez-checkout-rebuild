import React, { Component } from "react";
import "./ErrorBoundary.css";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  // removeIFrame () {
  //   console.log("clicking1");

  //   // document.getElementById("qp8911_bootstrapModal").style.display = "none";
  //  console.log("clicking");
  //   // frame.parentNode.removeChild(frame);
  // }

  render() {
    if (this.state.hasError) {
      return (
        <div className="wentwrong-container">
          <div className="click-checkout">
            <img src="/assets/qisst-pay-logo.svg" alt="image" />
          </div>
          <div className="tryAgain">Please Try Again</div>
          <div className="wentWrong">Something went wrong</div>
          <div className="wrong-image">
            <img src="/assets/wentWrong.svg" alt="image" />
          </div>
          <div className="text">
            We couldn’t launch the checkout. Please close checkout, reload the
            page and try again.
          </div>
          <button
            className="button"
            onClick={(e) => {
              {
                global.rudderanalytics?.track("iframe_closed");
                window.parent.postMessage(
                  {
                    qp_flag_teez: false,
                  },
                  "*"
                );
              }
            }}
            type="button"
          >
            Close Checkout
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
