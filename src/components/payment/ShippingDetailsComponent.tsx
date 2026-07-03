import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import CurrencyFormat from "react-currency-format";

interface IProps {
  shipping: any;
  setShippingPriceHandler: Function;
  encrypted: any;
}

const ShippingDetails: React.FC<IProps> = (props: IProps) => {
  const [shippingPrice, setShippingPrice] = useState("");
  const [shippingMethods, setShippingMethods] = useState<Array<any>>([]);
  const [mapit, setMapit] = useState<boolean>(false);

  // useEffect(() => {
  //   if (
  //     shippingPrice == "" ||
  //     shippingPrice == undefined ||
  //     shippingPrice == null
  //   ) {
  //     if (props.shipping != undefined && props.shipping != "") {
  //       setShippingPrice(props.shipping[0].cost);
  //       props.setShippingPriceHandler(props.shipping[0].cost);
  //     }
  //   }
  // }, [props]);

  // useEffect(() => {
  //   if (props.shipping != undefined && props.shipping != "") {
  //     setMapit(true);
  //     setShippingMethods(props.shipping);
  //     setShippingPrice(props.encrypted.shipping_amount);
  //   }
  // }, [props.shipping]);

  /**
   * @description shipping price change handler
   * @param event
   */
  const priceChangeHandler = (event: any) => {
    setShippingPrice(event.target.value == null ? "0" : event.target.value);
    props.setShippingPriceHandler(
      event.target.value == null ? "0" : event.target.value
    );
  };

  return (
    <div className="flex-box">
      <div className="checkout-container bg-checkout bg-grey relative pt-20 pb-20 ">
        <div className="padding-sides-20 drop-heading-container ">
          <p className="text-16 font-medium text-start">Select Delivery Type</p>
        </div>

        <div>
          <p className="order-text "></p>

          <div className="input-container bg-white mt-10 pointer">
            <div className={""}>
              <TextField
                id="outlined-select-currency"
                className="single-input w-100"
                InputProps={{
                  className: "user-input-card",
                }}
                select
                value={shippingPrice}
                onChange={priceChangeHandler}
              >
                {mapit &&
                  shippingMethods.map((option) => (
                    <MenuItem
                      key={option.cost == null ? "0" : option.cost.toString()}
                      value={option.cost == null ? "0" : option.cost.toString()}
                    >
                      <div>
                        <div>{option.title}</div>
                        <div>
                          <CurrencyFormat
                            value={Number(option.cost)}
                            displayType={"text"}
                            thousandSeparator={true}
                            suffix={".00"}
                          />
                        </div>
                      </div>
                    </MenuItem>
                  ))}
              </TextField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
