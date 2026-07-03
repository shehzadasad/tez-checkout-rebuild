import { useContext, useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { AnyCnameRecord } from "dns";
import InputAdornment from "@mui/material/InputAdornment";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import axios from "axios";

interface IProps {
  setNumber: Function;
  setCvc: Function;
  setName: Function;
  setExpiry: Function;
  encrypted: any;
  setExpiryValidated: Function;
  email?: string;
  currency?: string;
  productsObj?: any;
}

const CardDetail: React.FC<IProps> = (props: IProps) => {
  const [error, setError] = useState<string>("");
  const [validatedExpiry, setExpiryValidated] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  let [expiry, setExpiry] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [queryString, setQueryString] = useState<string>("");

  const [newToken, setNewToken] = useState<string>("");
  const [wpSrc, setWpSrc] = useState<string>("");
  const [lineItems, setLineItems] = useState<any>([]);

  const quantityInputRef = useRef<any>(null);

  const {
    state: {
      totalAmount,
      identityToken,
      discountedAmount,
      customerId,
      MerchantUserId,
      rudderStackID,
      user_type,
      intlNumber,
      time_stamp,
      line_items_event,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  useEffect(() => {
    if (props?.email && props?.email != "") {
      setEmail(props.email);
    }
    if (props?.currency && props?.currency != "") {
      setCurrency(props.currency);
    }

    if (props.productsObj && props.productsObj != null) {
      getLineItemsHandler();
    }

    const search = window.location.search; // could be '?foo=bar'
    setQueryString(search);
    const params = new URLSearchParams(search);
    setWpSrc(params.get("src")!);
    if (params.get("newtoken") != "") {
      setNewToken(params.get("newtoken")!);
    }
  }, [props]);

  useEffect(() => {
    const ignoreScroll = (e: any) => {
      e.preventDefault();
    };
    quantityInputRef.current &&
      quantityInputRef.current.addEventListener("wheel", ignoreScroll);
  }, [quantityInputRef]);

  /**
   * @description validate the expiry date of card on change
   * @param e
   */
  const handleChangeCardExpiryHandler = (e: any) => {
    let re = /^[0-9/\\]*$/;

    if (re.test(e.target.value)) {
      const value = e.target.value;
      //    setExpiryMonth(value.replace(/\//g, "").substring(0, 2));
      //    setExpiryYear(value.replace(/\//g, "").substring(0, 2));

      const expDateFormatter =
        value.replace(/\//g, "").substring(0, 2) +
        (value.length > 2 ? "/" : "") +
        value.replace(/\//g, "").substring(2, 4);
      setExpiry(expDateFormatter);
      props.setExpiry(expDateFormatter);
      if (props.encrypted != null) {
        props.encrypted.expiry_date = expDateFormatter;
      }
    }
  };

  /**
   * @description validate the input and update the state on the basis on type
   * @param e
   * @param type
   */
  const alphaInputsHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    type: string
  ) => {
    const re = /^[a-zA-Z ]*$/;
    if (e.target.value == "" || re.test(e.target.value)) {
      if (type == "name") {
        setName(e.target.value);
        props.setName(e.target.value);

        props.encrypted.card_person = e.target.value;
      }
      //    if (type == "lastname") {
      //      setLastName(e.target.value);
      //    }
      //    if (type == "city") {
      //      setCity(e.target.value);
      //    }
    }
  };

  /**
   * @description format the array of objects and set in lineItems state
   */
  const getLineItemsHandler = async () => {
    let items: any = [];
    await props.productsObj.map((item: any) => {
      items.push({
        id: item.product_id ? item.product_id : item.id,
        src: item.src,
        sku: item.id,
        name: item.title,
        type: "NA",
        quantity: item.quantity,
        category: null,
        subcategory: "NA",
        description: "NA",
        color: item?.color ?? "NA",
        size: item?.size ?? "NA",
        brand: "NA",
        unit_price: item.price,
        amount: Number(item.price) * Number(item.quantity),
        shipping_attributes: {
          weight: "NA",
          dimensions: {
            height: "NA",
            width: "NA",
            length: "NA",
          },
        },
      });
    });

    setLineItems(items);
  };

  /**
   * @description validate the card number and set errors
   * @returns Boolean
   */
  const validateCardNumberHandler = () => {
    if (number.length < 12) {
      setError("This card number looks invalid");
      return true;
    } else {
      setError("");
      return false;
    }
  };

  /**
   * @description validate the cvv and set error
   * @param e
   * @returns
   */

  const validateCvvHandler = (e: any) => {
    if (cvc.length < 3 || cvc === "") {
      setError("CVC is invalid");
      console.log(cvc, "cvc");
      return true;
    } else {
      console.log(cvc, "cvc1");
      setError("");
      return false;
    }
  };
  useEffect(() => {
    if (cvc.length >= 3 && cvc !== "") {
      setError("");
      (global as any).rudderanalytics?.track(
        "payment_info_entered",
        // {},
        {
          time_stamp: time_stamp,
          entered_number: intlNumber,
          user_type: user_type,
          products: line_items_event,
          total: totalAmount,
          value: totalAmount,
          revenue: totalAmount,
          user_id: customerId,
          merchant_id: MerchantUserId,
          anonymousId: rudderStackID,
        }
      );
    }
  }, [cvc]);

  /**
   * @description validate the expiry
   */
  const basicExpiryValidation = () => {
    let dValue = expiry.split("/");

    let pattern = /^\d{2}$/;

    let newDate = expiry.split("/");
    let current_year = new Date().getFullYear();
    let todayDate = new Date();

    let current_day = new Date().getDate();

    let expiryDate = new Date(dValue[0] + "/" + current_day + "/" + dValue[1]);

    let months;
    months = (expiryDate.getFullYear() - todayDate.getFullYear()) * 12;
    months -= todayDate.getMonth();
    months += expiryDate.getMonth();
    months = months <= 0 ? 0 : months;

    var expiryYear = "20" + newDate[1];
    var expiryMonth = Number(newDate[0]);
    var currentMonth = new Date().getMonth() + 1;

    if (expiryMonth > 12) {
      setError("Expiry Date is invalid");
      setExpiryValidated(false);
      props.setExpiryValidated(false);
    } else if (
      expiryMonth < currentMonth &&
      expiryYear <= current_year.toString()
    ) {
      setError("Expiry Date is invalid");
      setExpiryValidated(false);
      props.setExpiryValidated(false);
    } else if (expiryYear < current_year.toString()) {
      setError("Expiry Date is invalid");
      props.setExpiryValidated(false);
      setExpiryValidated(false);
    } else if (!pattern.test(dValue[0]) || !pattern.test(dValue[1])) {
      setError("Expiry Date format is invalid");
      props.setExpiryValidated(false);
      setExpiryValidated(false);
    } else if (months < 5) {
      setError("Expiry Date should be greater than 5 months");
      props.setExpiryValidated(false);
      setExpiryValidated(false);
    } else {
      setError("");
      props.setExpiryValidated(true);
      setExpiryValidated(true);
    }
  };

  const [discount, setDiscount] = useState<number>(0);
  const [discountFlag, setDiscountFlag] = useState<boolean>(true);

  const fetchBinDiscount = async (val: string) => {
    setDiscountFlag(false);
    await axios
      .post(
        `${process.env.REACT_APP_ORDER_MS_API_KEY}/calculate_bin_discount`,
        {
          amount: totalAmount,
          bin_number: val.slice(0, 6),
          is_tokenised: false,
          tokenised_card_num: "",
        },
        {
          headers: {
            identity_token: identityToken,
          },
        }
      )
      .then((response: any) => {
        setDiscountFlag(true);
        updateStateHandler({
          payload: {
            discountedAmount:
              Number(discountedAmount) +
              Number(response.data.data.discountAmount),
          },
        });
        setDiscount(Number(response.data.data.discountAmount));
      })
      .catch((error: any) => {
        setDiscountFlag(true);
        console.log(error);
      });
  };

  return (
    <div className="center-box">
      <div>
        <Row className="mt-2 mb-10">
          <Col xs={12} md={12} className="">
            <TextField
              autoFocus
              size="small"
              className="single-input"
              id="filled-basic-card"
              autoComplete="on"
              // label="Card Number"
              placeholder="Card Number"
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "input-card",
                inputMode: "numeric",
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      style={{ paddingBottom: "10px" }}
                      src="/assets/card.svg"
                    ></img>
                  </InputAdornment>
                ),
              }}
              value={number}
              type="text"
              ref={quantityInputRef}
              onInput={(e: any) => {
                let value = e.target.value;
                value = value.replaceAll(" ", "");

                // value = Math.max(0, parseInt(value)).toString().slice(0, 16);
                value = parseInt(value).toString().slice(0, 16);
                let joy = value.match(/.{1,4}/g);
                value = joy ? joy.join(" ") : "";
              }}
              onBlur={(e) => {
                if (number != "") {
                  validateCardNumberHandler();
                }
              }}
              onChange={async (e: any) => {
                if (e.target.value.length < 19) {
                  setError("Card is invalid.Please insert valid card number.");
                }
                if (e.target.value >= 220543 && e.target.value <= 220642) {
                  setError("PayPak Cards Not Accepted");
                } else {
                  setError("");
                }
                if (window.location.pathname != "/failure") {
                  const regexTest = /^[0-9 ]+$/;
                  let value = e.target.value;

                  value = value.replaceAll(" ", "");
                  let joy = value.match(/.{1,4}/g);
                  joy = joy ? joy.join(" ") : "";

                  if (value.length >= 6) {
                    if (discountFlag === true && discount === 0)
                      fetchBinDiscount(value);
                  } else if (value.length === 0) {
                    updateStateHandler({
                      payload: {
                        discountedAmount:
                          Number(discountedAmount) - discount < 0
                            ? 0
                            : Number(discountedAmount) - discount,
                      },
                    });
                    setDiscount(0);
                  }
                  if ((joy == "" || regexTest.test(joy)) && joy.length < 20) {
                    setNumber(joy);
                    props.setNumber(joy);
                  }
                } else {
                  const regexTest = /^[0-9 ]+$/;
                  let value = e.target.value;
                  if (value.length < 17) {
                    setNumber(value);
                    props.setNumber(value);

                    if (props.encrypted != null) {
                      props.encrypted.card_number = e.target.value;
                    }
                  }
                }
              }}
            />
          </Col>

          {/* <Col md={12} className="mt-20">
            <TextField
                className="single-input"
                id="filled-basic-card"
              label="Card Number"
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "user-input-card  border-grey",
              }}
              value={number}
              type="Number"
              ref={quantityInputRef}
              onInput={(e: any) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 16);
              }}
              onBlur={(e) => {
                if (number != "") {
                  validateCardNumberHandler();
                }
              }}
              onChange={(e: any) => {
                if (e.target.value >= 220543 && e.target.value <= 220642) {
                  setError("PayPak Cards Not Accepted");
                } else if (e.target.value == "") {
                  setError("");
                }

                setNumber(e.target.value);
                props.setNumber(e.target.value);
                if (props.encrypted != null) {
                  props.encrypted.card_number = e.target.value;
                }
              }}
            />
          </Col> */}
          <Col lg={6} md={6} xs={6} className="mt-20">
            <TextField
              size="small"
              className=""
              id="filled-basic-card"
              variant="filled"
              autoComplete="on"
              style={{ width: "100%" }}
              type="text"
              InputProps={{
                className: "input-card  padding-top-10",
              }}
              value={expiry}
              placeholder="Expiry (mm/yy)"
              onBlur={(e) => {
                basicExpiryValidation();
              }}
              onChange={(e) => {
                handleChangeCardExpiryHandler(e);
              }}
            />
          </Col>
          <Col lg={6} md={6} xs={6} className="mt-20">
            {/* <TextField
              className=""
              id="filled-basic"
              label="CVV"
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "user-input-card  border-grey",
              }}
              value={cvc}
              type="password"
              onInput={(e: any) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              onChange={(e: any) => {
                setCvc(isNaN(e.target.value) ? "" : e.target.value);
                props.setCvc(isNaN(e.target.value) ? "" : e.target.value);
                if (props.encrypted != null) {
                  props.encrypted.cvc = e.target.value;
                }
              }}
              onBlur={(e) => {
                validateCvvHandler(e);
              }}
            /> */}

            <TextField
              size="small"
              className=""
              id="filled-basic-card"
              placeholder="CVV"
              autoComplete="on"
              disabled={number === ""}
              variant="filled"
              style={{ width: "100%" }}
              InputProps={{
                className: "input-card padding-top-10 ",
              }}
              value={cvc}
              type="password"
              onInput={(e: any) => {
                if (number.slice(0, 1) === "3")
                  e.target.value = e.target.value.toString().slice(0, 4);
                else e.target.value = e.target.value.toString().slice(0, 3);

                // e.target.value = Math.max(0, parseInt(e.target.value))
                //   .toString()
                //   .slice(0, 3);
              }}
              onChange={(e: any) => {
                setCvc(isNaN(e.target.value) ? "" : e.target.value);
                props.setCvc(isNaN(e.target.value) ? "" : e.target.value);
                if (props.encrypted != null) {
                  props.encrypted.cvc = e.target.value;
                }
              }}
              onBlur={(e) => {
                validateCvvHandler(e);
              }}
            />
          </Col>
        </Row>

        {error != "" && (
          <div className="w-100 mt-30 flex ">
            {/* <img src={Constant.Error} /> */}
            <p className="pl-10 error-msg">{error}</p>
          </div>
        )}
        {discount > 0 && error === "" && (
          <div className="w-100 mt-30 flex ">
            {/* <img src={Constant.Error} /> */}
            <p style={{ color: "green" }} className="pl-10">
              Bin Discount Applied Successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
