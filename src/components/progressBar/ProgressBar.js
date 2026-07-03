import { React, useContext, useEffect, useState } from "react";
import { Container, Form, Row, Col, Modal } from "react-bootstrap";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";

export function ProgressBar(props) {
  const {
    state: { isTez, is4gives },
  } = useContext(CheckoutContext);
  return (
    <>
      {!is4gives && isTez != 0 ? (
        <div className="logo-container">
          <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
        </div>
      ) : (
        !is4gives && (
          <div className="logo-container">
            <img className="tezlogo" src="/assets/qisst-pay-logo.svg"></img>
          </div>
        )
      )}

      {is4gives && (
        <div>
          <div className="logo-container">
            <img
              className="tezlogo fourGivelogo"
              src="/assets/Splitmo-traditional.svg"
            ></img>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              className="tezlogo fourGivelogo"
              src="/assets/PoweredGroup.svg"
            ></img>
          </div>
        </div>
      )}

      {isTez != 0 && (
        <div className="logo-container mt-20">
          <img
            className="tezlogo"
            src={
              props.from == "signup"
                ? "assets/1step-2.svg"
                : props.from != "paymentMethod" && props.from != "signup"
                ? "/assets/1step-1.svg"
                : "/assets/1step-3.svg"
            }
          ></img>
          {/* {"x "}
                <img className="tezlogo" src="/assets/oneClick2x.png"></img> */}
        </div>
      )}
    </>
  );
}
export default ProgressBar;
