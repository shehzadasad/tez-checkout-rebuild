import React, { useEffect, useState, useContext } from "react";

import {
  Box,
  Typography,
  Button,
  FormControl,
  MenuItem,
  Select,
  Grid,
  InputLabel,
} from "@mui/material";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "react-notifications-component/dist/theme.css";
import { ReactNotifications, Store } from "react-notifications-component";

const Upsell3 = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const identityToken = queryParams.get("identity-token");
  const [produnctInfo, setProductInfo] = useState<any>(null);
  const [productAttributes, setProductAttribute] = useState([]);
  const [variantsParent, setVariantsParent] = useState<any>({});
  const [selectedOBj, setSelectedOBj] = useState<any>({});
  const [variantId, setVariantId] = useState("");
  const [dataMessage, setDataMessage] = useState("");
  const [cartUpdated, setCartUpdated] = useState(false);
  const [productVariant, setProductVariant] = useState([]);
  const [upsellData, setUpsellData] = useState<any>(null);
  const [menuOption, setMenuOption] = useState<any>([]);
  const [attributes, setAttributes] = useState<any>();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    state: {
      activeMethod,
      token,
      MerchantId,
      walletToggleButtonCheck,
      productsObj,
      currency,
    },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const getTopSellingProduct = (maxVal: number) => {
    const URL = `${process.env.REACT_APP_ORDER_MS_API_KEY}/top_selling_product?highest_product_amount=${maxVal}`;

    try {
      axios
        .get(URL, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            Authorization: `Bearer ${identityToken}`,
            "Content-Type": "application/json",
            "identity-token": identityToken ? identityToken : "",
          },
        })
        .then((response: any) => {
          setDataMessage(response.data.message);
          setProductInfo(response?.data?.data?.product_info);
          setUpsellData(response?.data?.data);
          const names = response.data.data.product_attributes.map(
            (a: any) => a.name
          );
          setAttributes(names);
          setVariantsParent(
            response?.data?.data?.variants_parent_child_relation
          );
          setProductVariant(response.data?.data?.product_variants);
        })
        .catch((error: any) => {
          console.log("===========================", error);
        });
    } catch (error) {
      console.log("========= WALLET ERROR: ", error);
    }
  };

  useEffect(() => {
    initialData();
  }, [productsObj]);

  const initialData = () => {
    var maxValue = 0;

    productsObj?.map((item) => {
      if (item.price > maxValue) {
        maxValue = item.price;
      }
    });

    if (maxValue !== 0) {
      getTopSellingProduct(maxValue);
    }
  };

  const updatedState = {
    productsObj: [],
    totalAmount: 0,
  };

  const handleAddUpsell = (productInfo: any, product_attributes: any) => {
    let payloadValues = menuOption[menuOption?.length - 1];

    const vairantPrice = productVariant
      ?.filter((it: any) => it.id === payloadValues?.variant_id)
      .map((item: any) => {
        return item?.price;
      });

    if (produnctInfo.has_variants === "YES" && !payloadValues.variant_id) {
      setErrorMessage("Select variants");
    } else {
      const obj: any = [
        ...productsObj,
        {
          attributes:
            product_attributes?.length > 0 ? product_attributes : null,
          id: productInfo?.merchant_product_id
            ? productInfo?.merchant_product_id
            : productInfo?.id,
          price: Number(vairantPrice)
            ? Number(vairantPrice)
            : Number(productInfo?.price)
            ? Number(productInfo?.price)
            : Number(productInfo?.price),
          quantity: "1",
          src: productInfo?.image,
          title: productInfo?.title,
          size: payloadValues?.size,
          color: payloadValues?.color,

          variant_id: payloadValues?.variant_id,
        },
      ];

      let total = 0;

      obj?.map((product: any) => {
        let totalPerProduct = 0;

        totalPerProduct = Number(product.price);

        total = total + Number(totalPerProduct);
      });

      updateStateHandler({
        payload: {
          productsObj: obj,
          totalAmount: total,
        },
      });
      setCartUpdated(true);
      Store.addNotification({
        title: "Success",
        message: "Cart Updated Successfully!",
        type: "success",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
    }
  };

  useEffect(() => {
    const variantID = 0;
    const merchantVariantID = productVariant
      ?.filter((it: any) => it.id === variantID)
      .map((item: any) => {
        return item?.merchant_variant_id;
      });

    productVariant
      ?.filter((it: any) => it.id === variantID)
      .map((item: any) => {
        return setProductAttribute(item?.product_variant_attributes);
      });

    setVariantId(
      merchantVariantID?.length > 0
        ? String(merchantVariantID)
        : String(variantID)
    );
  }, [selectedOBj, productVariant]);

  const [val, setVal] = useState({});
  const GetSelectedValues = (obj: any) => {
    let array = Object.assign({}, val, obj);
    console.log("HERE => ", array);
    setVal(array);
  };

  function filterOption(selectedObj: any) {
    let selectedObjKeys;
    let selectedObjValues: any;
    let final_value: any;
    let final_obj: any;
    selectedObjKeys = Object.keys(selectedObj);
    if (
      variantsParent &&
      Object.keys(variantsParent).length > 0 &&
      attributes?.length > 0
    ) {
      if (selectedObjKeys.length > 0) {
        selectedObjValues = Object.values(selectedObj);
      }
      if (
        selectedObjKeys.length === 0 &&
        variantsParent[attributes[0]] instanceof Array
      ) {
        return (final_obj = { [attributes[0]]: variantsParent[attributes[0]] });
      } else if (
        selectedObjKeys.length === 0 &&
        variantsParent[attributes[0]] instanceof Object
      ) {
        final_value = variantsParent[attributes[0]];
        return (final_obj = { [attributes[0]]: Object.keys(final_value) });
      } else if (
        attributes.length >= selectedObjKeys.length &&
        selectedObjKeys.length > 0
      ) {
        let final_item: any;
        if (attributes.length > selectedObjKeys.length) {
          final_value = variantsParent[attributes[selectedObjKeys.length]];
          final_item = attributes[selectedObjKeys.length];
        } else if (attributes.length === selectedObjKeys.length) {
          final_value = variantsParent[attributes[selectedObjKeys.length - 1]];
          final_item = "variant_id";
        }
        for (let j = 0; j < selectedObjValues.length; j++) {
          if (final_value instanceof Object) {
            final_value = final_value[selectedObjValues[j]];
            if (
              j === selectedObjValues.length - 1 &&
              !(final_value instanceof Array) &&
              final_value instanceof Object
            ) {
              final_value = Object.keys(final_value);
            }
          }
        }

        return (final_obj = { [final_item]: final_value });
      }
    }
  }

  const [selectIndex, setSelectIndex] = useState(0);
  const fn = (data: any) => {
    let newObj = { ...selectedOBj };
    Object.assign(newObj, data);
    let array = [...menuOption];
    array[selectIndex] = newObj;
    setMenuOption(array);
  };
  useEffect(() => {
    let data = filterOption(selectedOBj);
    console.log(data, "data");
    fn(data);
  }, [selectedOBj, variantsParent, attributes]);

  const handleSelectValue = (item: any, sub: any, index: number) => {
    if (menuOption.length > index + 2) {
      let reduceMenuArray = [...menuOption];
      let reduceSelectedObj = { ...selectedOBj };
      let result = Object.keys(reduceSelectedObj)
        .slice(0, index + 1)
        .reduce((result: any, key: any) => {
          result[key] = reduceSelectedObj[key];
          return result;
        }, {});
      setMenuOption(reduceMenuArray.slice(0, index + 1));
      setSelectedOBj(result);
    } else {
      let newObj = { ...selectedOBj };
      if (newObj[item]) {
        newObj[item] = sub;
      } else {
        Object.assign(newObj, { [item]: sub });
      }
      setSelectedOBj(newObj);
    }
  };

  return (
    <>
      {produnctInfo ? (
        <Box
          marginX={"15pt"}
          marginBottom={"30pt"}
          bgcolor="#FFFFFF"
          boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.05)"
          borderRadius="5px"
          display={"flex"}
          padding="10px"
          flexDirection={"column"}
          justifyContent="space-between"
        >
          <Box display="flex" justifyContent="space-between">
            <Box display="flex">
              <Box bgcolor={"#D3D3D3"} marginRight="20px">
                <img
                  src={produnctInfo?.image}
                  alt=""
                  style={{ width: "50px", height: "50px" }}
                />
              </Box>

              <Box>
                <Typography>{produnctInfo?.title}</Typography>
                <Typography>
                  {currency === "USD" ? "$" : "Rs."} {produnctInfo?.price}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Button
                sx={{
                  background: !cartUpdated ? "#E93A7D" : "#4BB543",
                  borderRadius: "53px",
                  color: "white",
                  "&:hover": {
                    background: !cartUpdated ? "#D8336B" : "#4BB543",
                  },
                }}
                className="add-button-upSell"
                onClick={() => handleAddUpsell(produnctInfo, productAttributes)}
                disabled={cartUpdated ? true : false}
              >
                {!cartUpdated ? (
                  "+Add"
                ) : (
                  <span style={{ color: "white" }}>Added</span>
                )}
              </Button>
              {!cartUpdated && errorMessage ? (
                <Typography sx={{ color: "red", marginY: "8px " }}>
                  {errorMessage}
                </Typography>
              ) : (
                ""
              )}
            </Box>
          </Box>

          {produnctInfo.has_variants === "YES" && (
            <Grid container spacing={1} justifyContent="center">
              {attributes?.map((item: any, aIndex: number) => {
                return (
                  <Grid item xs={6}>
                    <FormControl
                      style={{
                        minWidth: "40vw",
                        marginTop: "30px",
                        marginBottom: "30px",
                      }}
                      size="small"
                    >
                      <InputLabel
                        id="demo-simple-select-helper-label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "16px",
                          textTransform: "capitalize",
                        }}
                      >
                        {item}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label={item}
                        disabled={menuOption.length <= aIndex}
                        value={selectedOBj[item]}
                      >
                        <MenuItem value="" className="ms-2" disabled={true}>
                          Select {item}
                        </MenuItem>
                        {menuOption[aIndex] !== undefined &&
                          menuOption.length > 0 &&
                          menuOption[aIndex][item]?.map(
                            (sub: any, index: number) => {
                              return (
                                <MenuItem
                                  onClick={() => (
                                    setSelectIndex(aIndex + 1),
                                    handleSelectValue(item, sub, aIndex)
                                  )}
                                  className="ms-2"
                                  value={sub}
                                >
                                  {sub}
                                </MenuItem>
                              );
                            }
                          )}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

export default Upsell3;
