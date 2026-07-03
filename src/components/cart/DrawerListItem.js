import React from "react";
import { Box, List, ListItem } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import SharedFormInput from "../../shared/SharedFormInput";
import SharedButton from "../../shared/SharedButton";
import { orderService } from "../../services/order.service";
import currencyFormatter from "currency-formatter";
import { useContext } from "react";
import HashLoader from "react-spinners/HashLoader";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
// import "./Drawer.css";

const DrawerListItem = ({ value, handleClose, obj, index, amount }) => {
  const {
    state: { currency, globalCartObject, discountedAmount },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const [loader, setLoader] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [identityToken, setIdentityToken] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [discountedAmountResponse, setDiscountedAmount] = useState();
  const handleclose = () => {
    handleClose("bottom", false);
  };

  useEffect(() => {
    console.log("obj => ", obj[index].items[0].identity_token);
    setIdentityToken(obj[index].items[0].identity_token);
  }, []);

  const applyCouponCode = async () => {
    setError("");
    try {
      if (couponCode === "") return;
      setLoader(true);
      const response = await orderService.applyCoupon(
        {
          coupon_code: couponCode,
          total_price: String(amount),
        },
        {
          headers: {
            Authorization: "",
            "identity-token": identityToken,
          },
        }
      );
      if (response.success) {
        console.log("COUPON CODE RESPONSE: ", response);
        console.log(globalCartObject);
        setError("");
        setLoader(false);
        setDiscountedAmount(response.data.discount_value);
        let array = [...obj];
        array[index].coupon = true;
        updateStateHandler({
          payload: {
            discountedAmount:
              Number(discountedAmount) + Number(response.data.discount_value),
            globalCartObject: array,
          },
        });
        handleclose();
      } else {
        setCouponApplied(false);
        setLoader(false);
        setError(response.message);
      }
    } catch (error) {
      setCouponApplied(false);
      setError(error?.response?.data?.message ?? "Something went wrong.");
      setLoader(false);
    }
  };

  const SelectShippingMethod = (title, fee) => {
    let array = [...obj];
    array[index].SelectedShipping = { title: title, fee: fee };

    updateStateHandler({
      payload: {
        globalCartObject: array,
      },
    });

    handleclose();
  };

  return (
    <>
      {value === "shipping" ? (
        <>
          <List>
            <div
              className="drawerHeading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "18px 20px",
                fontStyle: "normal",
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "19px",
                letterSpacing: "0.01em",
                textTransform: "capitalize",
                color: "#111111",
              }}
            >
              <div>
                <ListItem disablePadding>Select Shipping Method</ListItem>
              </div>
              <div onClick={handleclose}>
                <img src="/assets/closeIcon.svg"></img>
              </div>
            </div>
          </List>
          <Divider />
          <Box className="drawerBody" style={{ margin: "0 20px" }}>
            {obj[index].shipping.map((items) => {
              return (
                <>
                  <Divider />
                  <List>
                    <div
                      className="drawerItem"
                      style={{
                        display: "flex",
                        cursor: "pointer",
                        margin: "15px 0",
                      }}
                      onClick={() =>
                        SelectShippingMethod(items.title, items.fee)
                      }
                    >
                      {(obj[index].SelectedShipping.fee === items.fee) ===
                      true ? (
                        <div
                          className="checkImage"
                          style={{
                            margin: "0 13px",
                            /* background: red; */
                            width: "16.78px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img src="/assets/check.svg"></img>
                        </div>
                      ) : (
                        <div
                          className="checkImage"
                          style={{
                            margin: "0 13px",
                            width: "16.78px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        ></div>
                      )}

                      <div
                        className="itemName"
                        style={{
                          fontStyle: "normal",
                          fontWeight: "500",
                          fontSize: "16px",
                          lineHeight: "19px",
                          letterSpacing: "0.01em",
                          textTransform: "capitalize",
                          color: "#111111",
                        }}
                      >
                        <ListItem disablePadding>
                          {items.title}:{" "}
                          {currencyFormatter.format(items.fee, {
                            code: currency.toString(),
                            format: "%s %v",
                          })}
                        </ListItem>
                      </div>
                    </div>
                  </List>
                </>
              );
            })}
          </Box>
        </>
      ) : (
        <>
          <List>
            <div
              className="drawerHeading"
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "18px 20px",
                fontStyle: "normal",
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "19px",
                letterSpacing: "0.01em",
                textTransform: "capitalize",
                color: "#111111",
              }}
            >
              <div>
                <ListItem disablePadding>Enter Coupon Code</ListItem>
              </div>
              <div onClick={handleclose}>
                <img src="/assets/closeIcon.svg"></img>
              </div>
            </div>
          </List>
          <Divider />
          <List>
            <Grid style={{ margin: "0 20px" }}>
              <SharedFormInput
                id="outlined-basic"
                label="Coupon Code"
                style={{
                  width: "100%",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                variant="outlined"
                value={couponCode}
                onInputChange={(e) => {
                  console.log(e);
                  setCouponCode(e);
                }}
                type="text"
              />

              <p
                style={{ color: "red", marginBottom: "10pt", marginTop: "7pt" }}
              >
                {error}
              </p>

              <SharedButton
                text={
                  loader === true ? (
                    <HashLoader color="white" size={30} />
                  ) : (
                    "Apply Coupon Code"
                  )
                }
                style={{
                  background: "#e93a7d",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "800",
                  textAlign: "center",
                  width: "100%",
                  border: "none",
                  height: 50,
                  cursor: "pointer",
                }}
                disable={couponCode === "" || loader === true ? true : false}
                onClick={() => applyCouponCode()}
              />
            </Grid>
          </List>
        </>
      )}
    </>
  );
};

export default DrawerListItem;
