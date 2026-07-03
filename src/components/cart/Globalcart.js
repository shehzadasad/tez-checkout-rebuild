import React from "react";
import { useContext, useEffect, useState } from "react";
// import "./cart.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
// import "./Drawer.css";
import { useTheme } from "@mui/material/styles";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import Swal from "sweetalert2";
import currencyFormatter from "currency-formatter";
import { Link } from "react-router-dom";
import { lazyLoad } from "../../utils/loadable";

const DrawerListItem = lazyLoad(() => import("./DrawerListItem"));

const Globalcart = (props) => {
  const {
    state: { globalCartObject, currency, discountedAmount, rudderStackID },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const theme = useTheme();
  const [value, setValue] = useState("");
  const [couponState, setCouponState] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAmount, setShippingAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [CouponDrawerId, setCouponDrawerId] = useState("");

  const setValues = (totalPrice, totalShipping) => {
    setTotalAmount(totalPrice);
    setShippingAmount(totalShipping);
  };

  const [state, setState] = useState({
    bottom: false,
  });

  const toggleDrawer = (anchor, open, value, index) => (event) => {
    if (value === "coupon" || value === "shipping") {
      setCouponDrawerId(index);
    }
    if (
      event?.type === "keydown" &&
      (event?.key === "Tab" || event?.key === "Shift")
    ) {
      return;
    }
    setValue(value);
    setState({ ...state, [anchor]: open });
  };
  const handleCls = (anc, val) => {
    setState({ ...state, [anc]: val });
  };

  const quantityDecrease = (index, i, val) => {
    let array = [...globalCartObject];

    console.log("Array", array);

    array[index].items[i].quantity = val;

    updateStateHandler({
      payload: {
        globalCartObject: array,
      },
    });
  };

  const quantityIncrease = (index, i, val) => {
    let array = [...globalCartObject];

    array[index].items[i].quantity = val;

    updateStateHandler({
      payload: {
        globalCartObject: array,
      },
    });
  };

  const deleteProduct = (index, i) => {
    let array = [...globalCartObject];
    array[index].items.splice(i, 1);

    if (array[index].items?.length === 0) {
      array.splice(index, 1);
    }

    if (array.length === 0) {
      window.parent.postMessage(
        {
          qp_flag_teez: false,
        },
        "*"
      );
    }

    updateStateHandler({
      payload: {
        globalCartObject: array,
      },
    });

    Swal.fire("Deleted!", "Your file has been deleted.", "success");
  };

  const list = (anchor, obj, index, amount) => (
    <Box
      className="drawer"
      sx={{ width: "auto" }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <DrawerListItem
        index={index}
        obj={obj}
        value={value}
        handleClose={handleCls}
        amount={amount}
      />
    </Box>
  );

  const [merchantTotalCost, setMerchantTotalCost] = useState([]);
  const getInitialData = () => {
    let itemPrice = 0;
    let p_price = [];
    let shippingP = 0;

    if (globalCartObject) {
      globalCartObject?.map((obj, i) => {
        // PRICE
        let ttPrice = [];
        obj?.items.map((item, j) => {
          itemPrice =
            item.quantity *
            (item.price ? item.price : item.amount ? item.amount : 0);
          ttPrice.push(itemPrice);
        });
        p_price.push(ttPrice);

        // SHIPPING
        if (obj?.SelectedShipping) shippingP += obj?.SelectedShipping?.fee;
        // COUPON
        if (obj?.coupon === true) {
          setDiscount(discountedAmount);
        } else {
          setDiscount(0);
        }
      });
    }
    let result = 0;

    p_price?.forEach((items) => {
      items?.forEach((it) => {
        result += it;
      });
    });

    // for (let i = 0; i < p_price.length; i++) {
    //   result += p_price[i];
    // }

    setShippingAmount(shippingP);
    setMerchantTotalCost(p_price);
    console.log("Global Cart Object => ", p_price);
    setTotalOrder(result + shippingP - discountedAmount);
    setTotalAmount(result);
    updateStateHandler({
      payload: {
        globalCartTotalAmount: result,
        shippingPrice: shippingP,
      },
    });
  };

  useEffect(() => {
    getInitialData();
  }, [globalCartObject, discountedAmount]);

  console.log("");

  useEffect(() => {
    console.log("merchantTotalCost: ", merchantTotalCost);
  }, [merchantTotalCost]);

  const getProductsTotal = (items) => {
    let total = 0;
    items.map((item) => {
      total = total + item.amount;
    });

    return total;
  };

  const TotalProducts = () => {
    let total = 0;
    globalCartObject.map((obj) => {
      total = total + obj?.items.length;
    });

    return total;
  };

  const sumSubtotal = (array) => {
    console.log(array);
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    console.log(sum);
    return sum;
  };

  return (
    <>
      <div
        style={{
          fontFamily: "DM Sans",
          fontStyle: "noraml",
          fontWeight: "700",
          fontSize: "20px",
          marginLeft: "1.5rem",
        }}
      >
        Cart Items {globalCartObject?.length > 0 && `(${TotalProducts()})`}
      </div>
      {/* PRODUCTS */}
      {globalCartObject?.map((obj, index) => {
        return (
          <>
            <div
              className="input-container-no-m pointer"
              style={{ margin: "10px 17px", borderRadius: "25px" }}
            >
              <div
                className="drop-container pointer"
                style={{ backgroundColor: "#FAFAFA" }}
              >
                <div>
                  <div>
                    {obj?.items?.map((item, i) => {
                      return (
                        <>
                          {i === 0 && (
                            <div
                              className="brandLogo"
                              style={{
                                marginBottom: "16pt",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="seller"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  letterSpacing: "0.02em",
                                  textTransform: "uppercase",
                                  color: "#888888",
                                  display: "flex",
                                  lineHeight: "14px",
                                }}
                              >
                                <div>
                                  <img src="/assets/seller.svg" alt="seler" />
                                </div>
                                <div
                                  className="sss"
                                  style={{
                                    marginTop: "3px",
                                    marginLeft: "4px",
                                  }}
                                >
                                  {item?.merchant_name}
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row-reverse",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  style={{ width: "40pt" }}
                                  src={
                                    item?.merchant_logo
                                      ? item?.merchant_logo
                                      : "/assets/imgcover.png"
                                  }
                                  alt="logo"
                                />
                              </div>
                            </div>
                          )}

                          <Box display="flex">
                            <div>
                              <img
                                style={{
                                  height: "70pt",
                                  width: "70pt",
                                  objectFit: "contain",
                                  borderRadius: "5px",
                                }}
                                className="itemImage"
                                src={
                                  item?.logo !== null
                                    ? item?.logo
                                    : "/assets/imgcover.png"
                                }
                                alt=""
                              />
                            </div>
                            <div
                              className="itemDetail"
                              style={{ width: "100%", marginLeft: "8px" }}
                            >
                              <div
                                // className="itemName"
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
                                {item?.title}
                              </div>
                              <div
                                className="itemPrice"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  letterSpacing: "0.02em",
                                  color: "#888888",
                                }}
                              >
                                {currencyFormatter.format(
                                  item?.price
                                    ? item?.price
                                    : item?.amount
                                    ? item?.amount
                                    : 0,
                                  {
                                    code: currency.toString(),
                                    format: "%s %v",
                                  }
                                )}
                              </div>
                              {!props.mallPayMentScreenCheck ? (
                                <Box
                                  className="quantityRow"
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box
                                    className="counter"
                                    width={isMdDown ? "40%" : "15%"}
                                    bgcolor="#ffffff"
                                    border="1px solid rgba(0, 0, 0, 0.1)"
                                    borderRadius="5px"
                                    display="flex"
                                    justifyContent="space-between"
                                    padding="0 11px"
                                    alignItems="center"
                                    height="30px"
                                  >
                                    <div
                                      onClick={() => {
                                        if (item?.quantity !== 1) {
                                          quantityDecrease(
                                            index,
                                            i,
                                            item.quantity - 1
                                          );
                                        }
                                      }}
                                      className="counterMinus"
                                      style={{
                                        borderRadius: "50%",
                                        background: "#111111",
                                        color: "#ffffff",
                                        paddingBottom: "3px",

                                        display: "flex",
                                        alignItems: "center",
                                        width: "16.67px",
                                        height: "16.67px",
                                        justifyContent: "center",
                                      }}
                                    >
                                      -
                                    </div>
                                    <div className="quantity">
                                      {item.quantity}
                                    </div>
                                    <div
                                      onClick={() => {
                                        if (
                                          item?.quantity !== item?.max_quantity
                                        ) {
                                          quantityIncrease(
                                            index,
                                            i,
                                            item.quantity + 1
                                          );
                                        }
                                      }}
                                      className="counterPlus"
                                      style={{
                                        borderRadius: "50%",
                                        background: "#111111",
                                        color: "#ffffff",
                                        paddingBottom: "3px",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "16.67px",
                                        height: "16.67px",
                                        justifyContent: "center",
                                      }}
                                    >
                                      +
                                    </div>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      background: "#ffffff",
                                      borderRadius: "5px",
                                      width: "35px",
                                      height: "30px",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      border: "1px solid WhiteSmoke",
                                    }}
                                    onClick={() => {
                                      // deleteProduct(index, i)
                                      Swal.fire({
                                        title: "Are you sure?",
                                        text: "You won't be able to revert this!",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#E82E81",
                                        cancelButtonColor: "grey",
                                        confirmButtonText: "Yes, delete it!",
                                      }).then((result) => {
                                        if (result?.isConfirmed) {
                                          deleteProduct(index, i);
                                        }
                                      });
                                    }}
                                    // className="delete"
                                  >
                                    <img
                                      src="/assets/delete.svg"
                                      alt="delete"
                                    />
                                  </Box>
                                </Box>
                              ) : (
                                <p
                                  className="itemPrice"
                                  style={{
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    fontSize: "14px",
                                    letterSpacing: "0.02em",
                                    color: "#888888",
                                  }}
                                >
                                  {item?.quantity}x | {item?.attribute?.[0]}
                                </p>
                              )}
                            </div>
                          </Box>

                          <hr />
                        </>
                      );
                    })}

                    {props.show === "" ? (
                      ""
                    ) : (
                      <>
                        {/*IF NOT PAYMENT METHODS*/}
                        {!props.mallPayMentScreenCheck && (
                          <>
                            {/* Delivery */}
                            <div
                              className="delivery"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div
                                className="delivery1"
                                style={{
                                  display: "flex",
                                }}
                              >
                                <div
                                  className="deliveryheading"
                                  style={{
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    fontSize: "16px",
                                    letterSpacing: "0.02em",

                                    color: "#888888",
                                  }}
                                >
                                  Delivery
                                </div>
                                <div
                                  className="shipping"
                                  style={{
                                    display: "block",
                                    marginLeft: "18px",
                                  }}
                                >
                                  {obj?.shipping[0] && (
                                    <div
                                      className="shippingName"
                                      style={{
                                        fontStyle: "normal",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                        letterSpacing: "0.01em",
                                        textTransform: "capitalize",
                                        color: "#111111",
                                      }}
                                    >
                                      {currencyFormatter.format(
                                        obj?.SelectedShipping?.fee,
                                        {
                                          code: currency.toString(),
                                          format: "%s %v",
                                        }
                                      )}{" "}
                                      - {obj?.SelectedShipping?.title}
                                    </div>
                                  )}

                                  {/* <div className="shippingTime" style={{fontStyle: "normal",
  fontWeight: "400",
  fontSize: "14px",
  lineHeight: "17px",
  letterSpacing: "0.02em",
  color: "#888888"}}>
                                    Est. Delivery: 10-14 July
                                  </div> */}
                                </div>
                              </div>

                              <Button
                                className="arrow"
                                onClick={toggleDrawer(
                                  "bottom",
                                  true,
                                  "shipping",
                                  index
                                )}
                              >
                                <img src="/assets/arrow.svg"></img>
                              </Button>
                            </div>

                            {/* Coupon */}
                            <hr />
                            {obj?.coupon === false && (
                              <div
                                className="coupon"
                                style={{ display: "flex" }}
                              >
                                {/* <Link></Link> */}
                                <Button
                                  onClick={toggleDrawer(
                                    "bottom",
                                    true,
                                    "coupon",
                                    index
                                  )}
                                  style={{ color: "#E72E80" }}
                                >
                                  <img
                                    style={{ marginRight: "8px" }}
                                    src="/assets/coupon.svg"
                                  />{" "}
                                  Apply Shop Coupon Code
                                </Button>
                                <div
                                  onClick={(e) => {
                                    setCouponState(!couponState);
                                  }}
                                  className="couponText"
                                  style={{
                                    fontStyle: "normal",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    letterSpacing: "0.01em",
                                    textTransform: "capitalize",
                                    color: "#e72e80",

                                    marginLeft: "8px",
                                  }}
                                ></div>
                                <div>
                                  {["bottom"].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                      <Drawer
                                        anchor={anchor}
                                        open={state[anchor]}
                                        onClose={toggleDrawer(anchor, false)}
                                      >
                                        {list(
                                          anchor,
                                          globalCartObject,
                                          CouponDrawerId,
                                          totalAmount
                                        )}
                                      </Drawer>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Promo Code Applied */}
                            {obj?.coupon === true && (
                              <div
                                className="promoCode"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  className="promoText"
                                  style={{
                                    fontStyle: "normal",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    color: "#80ba37",
                                  }}
                                >
                                  <img
                                    style={{ marginRight: "8px" }}
                                    src="/assets/promo.svg"
                                  />
                                  Promo Code Applied
                                </div>
                                <div>
                                  <img src="/assets/cross2.svg" />
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/*IF PAYMENT METHODS*/}
                        {props.mallPayMentScreenCheck && (
                          <>
                            <div
                              className="subtotal"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "5px",
                                marginTop: "16px",
                                // backgroundColor: "aqua",
                              }}
                            >
                              <div
                                className="subTotalText"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "16px",
                                  letterSpacing: "0.01em",
                                  textTransform: "capitalize",
                                  color: "#888888",
                                }}
                              >
                                Shipping
                              </div>
                              <div
                                className="price"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "16px",
                                  textTransform: "capitalize",
                                  color: "#111111",
                                  // backgroundColor: "aqua",
                                }}
                              >
                                {currencyFormatter.format(
                                  obj?.SelectedShipping?.fee,
                                  {
                                    code: currency.toString(),
                                    format: "%s %v",
                                  }
                                )}
                              </div>
                            </div>
                            <div
                              className="subtotal"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "5px",
                                marginTop: "16px",
                                // backgroundColor: "aqua",
                              }}
                            >
                              <div
                                className="subTotalText"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "16px",
                                  letterSpacing: "0.01em",
                                  textTransform: "capitalize",
                                  color: "#888888",
                                }}
                              >
                                Sub Total
                              </div>
                              <div
                                className="price"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "16px",
                                  textTransform: "capitalize",
                                  color: "#111111",
                                  // backgroundColor: "aqua",
                                }}
                              >
                                {currencyFormatter.format(
                                  sumSubtotal(merchantTotalCost[index]),
                                  {
                                    code: currency.toString(),
                                    format: "%s %v",
                                  }
                                )}
                              </div>
                            </div>
                            <div
                              className="refPolicy"
                              style={{
                                display: "flex",
                                fontStyle: "normal",
                                fontWeight: "400",
                                fontSize: "13px",
                                marginTop: "20px",
                              }}
                            >
                              <div
                                className="haveQuestions"
                                style={{
                                  fontStyle: "normal",
                                  fontWeight: "400",
                                  fontSize: "13px",
                                  color: "#888888",
                                }}
                              >
                                Have Questions? Read Merchant’s
                              </div>
                              <Link
                                to="/about"
                                style={{
                                  textDecoration: "none",
                                  color: "#e72e80",
                                  marginLeft: "2px",
                                }}
                              >
                                Refunds Policy
                              </Link>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}

      <div
        // className="mainTotal"
        style={{ margin: "10px 17px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
          //  className="subtotal"
        >
          <div
            // className="subTotalText"
            style={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "16px",
              letterSpacing: "0.01em",
              textTransform: "capitalize",
              color: "#888888",
            }}
          >
            Subtotal
          </div>
          <div
            // className="price"
            style={{
              fontWeight: "400",
              fontSize: "16px",
              textTransform: "capitalize",
              color: "#111111",
            }}
          >
            {currencyFormatter.format(totalAmount, {
              code: currency.toString(),
              format: "%s %v",
            })}
          </div>
        </div>
        <div
          className="subtotal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <div
            // className="subTotalText"
            style={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "16px",
              letterSpacing: "0.01em",
              textTransform: "capitalize",
              color: "#888888",
            }}
          >
            Total Shipping
          </div>
          <div
            // className="price"
            style={{
              fontWeight: "400",
              fontSize: "16px",
              textTransform: "capitalize",
              color: "#111111",
            }}
          >
            {currencyFormatter.format(shippingAmount, {
              code: currency.toString(),
              format: "%s %v",
            })}
          </div>
        </div>
        <div
          className="subtotal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <div
            // className="subTotalText"
            style={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "16px",
              letterSpacing: "0.01em",
              textTransform: "capitalize",
              color: "#888888",
            }}
          >
            Seller Discount
          </div>
          <div
            // className="price"
            style={{
              fontWeight: "400",
              fontSize: "16px",
              textTransform: "capitalize",
              color: "#111111",
            }}
          >
            {currencyFormatter.format(discountedAmount, {
              code: currency.toString(),
              format: "%s %v",
            })}
          </div>
        </div>
        <div
          className="subtotal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <div
            // className="subTotalText"
            style={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "16px",
              letterSpacing: "0.01em",
              textTransform: "capitalize",
              color: "#888888",
            }}
          >
            Order Total
          </div>
          <div
            // className="price"
            style={{
              fontWeight: "400",
              fontSize: "16px",
              textTransform: "capitalize",
              color: "#111111",
            }}
          >
            {currencyFormatter.format(
              Number(totalAmount) +
                Number(shippingAmount) -
                Number(discountedAmount),
              {
                code: currency.toString(),
                format: "%s %v",
              }
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Globalcart;
