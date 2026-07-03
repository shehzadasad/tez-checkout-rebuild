import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Row, Col } from "react-bootstrap";
import { lazyLoad } from "../../utils/loadable";

const CardDetail = lazyLoad(() => import("./CardDetailComponent"));

interface IProps {
  setLoadCOD: Function;
  loadCOD: boolean;
  paypal: boolean;
  loadCard: boolean;
  loadEasyPaisa: boolean;
  loadDirectBank: boolean;
  loadKlarna: boolean;
  loadAffirm: boolean;
  setLoadAffirm: Function;
  setLoadKlarna: Function;
  setLoadCard: Function;
  setLoadPayPal: Function;
  setLoadQisstPay: Function;
  setLoadEasyPaisa: Function;
  setLoadDirectBank: Function;
  merchantPackageId: Function;
  activeMethod: Function;
  parentActiveMethod: Function;
  encrypted: any;
  methods: any;
  key: any;
  id: any;
  price: number;
  setCvc: Function;
  setNumber: Function;
  setName: Function;
  setExpiry: Function;
  setExpiryValidated: Function;
  setPhoneNumber: Function;
  phoneNumber: string;
  setAccountNumber: Function;
  accountNumber: string;
  setCnic: Function;
  cnic: string;
  setDisable: Function;
  setEpValidation: Function;
  setError: Function;
}

const MethodCard: React.FC<IProps> = (props: IProps) => {
  const [isExpanded, setExpanded] = useState(false);

  const methods = props.methods;
  const price = props.price;

  useEffect(() => {
    validatePhoneNumberHandler(props.phoneNumber);
  }, [props.phoneNumber]);

  useEffect(() => {
    if (props.loadCOD == true && props.methods.package.package_name == "COD") {
      if (
        props.price <= props.methods.max &&
        props.price >= props.methods.min
      ) {
        //console.log(methods.merchant_package_id);
        props.setLoadCOD(true);
        props.setLoadPayPal(false);
        props.setLoadCard(false);
        props.setLoadQisstPay(false);
        props.setLoadEasyPaisa(false);
        props.setLoadDirectBank(false);
        props.setLoadKlarna(false);
        props.setLoadAffirm(false);
        props.encrypted.merchant_package_id = methods.merchant_package_id;
        props.merchantPackageId(methods.merchant_package_id, "");
        props.activeMethod("COD");
        props.setError("");
        props.setDisable(false);

        //  if (props.parentActiveMethod != "") {
        props.parentActiveMethod("COD");
        //  }
      } else {
        props.activeMethod("");
      }
    }
  }, [props.loadCOD]);

  /**
   * @description validate the phone number and set the error & EpValidation & disable parent state
   * @param number
   */
  const validatePhoneNumberHandler = (number: string) => {
    let re = /^(\+92|0|92)[0-9]{10}$/;
    if (re.test(number)) {
      props.setEpValidation(true);
      props.setError("");
      props.setDisable(false);
    } else {
      if (number != "") {
        props.setError("Number is not valid");
        props.setDisable(true);
      }
    }
  };

  /**
   * @description set the diff payment methods load state & activeMethods & error & disable & merchantPackageId
   * @param package_name
   */
  const toggleExpanded = (package_name: any) => {
    if (props.id == "COD") {
      //console.log(methods.merchant_package_id);
      props.setLoadCOD(true);
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadQisstPay(false);
      props.setLoadEasyPaisa(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      props.setLoadAffirm(false);
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("COD");
      props.setError("");
      props.setDisable(false);

      //  if (props.parentActiveMethod != "") {
      props.parentActiveMethod("COD");
      //  }
    } else if (props.id == "PAYPAL") {
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadCard(false);
      props.setLoadEasyPaisa(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      props.setLoadAffirm(false);
      props.setLoadPayPal(true);
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.encrypted.package_name = package_name;
      props.activeMethod("PAYPAL");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("PAYPAL");
      // }
    } else if (props.id == "CARD") {
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadPayPal(false);
      props.setLoadEasyPaisa(false);
      props.setLoadDirectBank(false);
      props.setDisable(false);
      props.setLoadKlarna(false);
      props.setLoadAffirm(false);
      props.setLoadCard(true);
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("CARD");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("CARD");
      // }
    } else if (props.id == "EASYPAISA") {
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadKlarna(false);
      props.setLoadAffirm(false);
      props.setLoadEasyPaisa(true);
      props.setLoadDirectBank(false);
      props.setDisable(true);
      props.setError("");
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("EASYPAISA");
      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("EASYPAISA");
      // }
    } else if (props.id == "DIRECT_BANK_TRANSFER") {
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadEasyPaisa(false);
      props.setLoadKlarna(false);
      props.setLoadAffirm(false);
      props.setLoadDirectBank(true);
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("DIRECT_BANK_TRANSFER");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("DIRECT_BANK_TRANSFER");
      // }
    } else if (props.id == "KLARNA") {
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadEasyPaisa(false);
      props.setLoadDirectBank(false);
      props.setLoadAffirm(false);
      props.setLoadKlarna(true);
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("KLARNA");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("KLARNA");
      // }
    } else if (props.id == "AFFIRM") {
      props.setLoadCOD(false);
      props.setLoadQisstPay(false);
      props.setLoadPayPal(false);
      props.setLoadCard(false);
      props.setLoadEasyPaisa(false);
      props.setLoadDirectBank(false);
      props.setLoadKlarna(false);
      props.setLoadAffirm(true);
      setExpanded(!isExpanded);
      //   props.encrpted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.merchant_package_id = methods.merchant_package_id;
      props.encrypted.package_name = package_name;
      props.merchantPackageId(methods.merchant_package_id, "");
      props.activeMethod("AFFIRM");
      props.setError("");
      props.setDisable(false);

      // if (props.parentActiveMethod != "") {
      props.parentActiveMethod("AFFIRM");
      // }
    }
  };

  return (
    <div className="input-container bg-white mt-10 pointer">
      <div
        className={
          methods.package.package_name != "GOOGLEPAY" ? "drop-container" : ""
        }
      >
        {price <= methods.max && price >= methods.min ? (
          <div
            onClick={(e) => toggleExpanded(methods.package.package_name)}
            className=" flex align-center"
          >
            {methods.package.package_name.toString().toLocaleUpperCase() !=
              "GOOGLEPAY" && (
              <img
                className="mr-20"
                alt="radio"
                src={
                  (!props.loadCOD &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "COD") ||
                  (!props.paypal &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PAYPAL") ||
                  (!props.loadCard &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CARD") ||
                  (!props.loadEasyPaisa &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "EASYPAISA") ||
                  (!props.loadDirectBank &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "DIRECT_BANK_TRANSFER") ||
                  (!props.loadKlarna &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "KLARNA") ||
                  (!props.loadAffirm &&
                    methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "AFFIRM")
                    ? "/assets/unchecked.png"
                    : "/assets/filled.png"
                }
              />
            )}

            <div className="drop-heading-container w-100">
              {methods.package.package_name.toString().toLocaleUpperCase() !=
                "GOOGLEPAY" && (
                <p className="text-18 font-medium text-start">
                  {methods.package.package_name
                    .toString()
                    .toLocaleUpperCase() == "COD" ? (
                    <img src="/assets/codTag.svg"></img>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "PAYPAL" ? (
                    <img src="/assets/paypalTag.svg"></img>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "DIRECT_BANK_TRANSFER" ? (
                    <>
                      <img
                        style={{ marginTop: "-6px", marginRight: "5px" }}
                        src="/assets/bankTransfer.svg"
                      ></img>
                      DIRECT BANK TRANSFER
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "CARD" ? (
                    <>
                      <img src="/assets/cardnew1.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "EASYPAISA" ? (
                    <>
                      <img src="/assets/epTag.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "KLARNA" ? (
                    <>
                      <img src="/assets/klarnaTag.svg"></img>
                    </>
                  ) : methods.package.package_name
                      .toString()
                      .toLocaleUpperCase() == "AFFIRM" ? (
                    <>
                      <img src="/assets/affirm.png"></img>
                    </>
                  ) : (
                    methods.package.package_name
                  )}
                </p>
              )}
              {methods.package.package_name.toString().toLocaleUpperCase() ==
                "GOOGLEPAY" && (
                <div
                  style={{ width: "100%" }}
                  id="payment-request-button"
                ></div>
              )}
            </div>
          </div>
        ) : (
          //showing error card  with logos
          <div>
            <p className="text-18 font-medium text-start">
              {methods.package.package_name.toString().toLocaleUpperCase() ==
              "COD" ? (
                <img src="/assets/codTag.svg"></img>
              ) : methods.package.package_name.toString().toLocaleUpperCase() ==
                "CARD" ? (
                <>
                  <img src="/assets/cardnew1.svg"></img>
                </>
              ) : methods.package.package_name.toString().toLocaleUpperCase() ==
                "EASYPAISA" ? (
                <>
                  <img src="/assets/epTag.svg"></img>
                </>
              ) : methods.package.package_name.toString().toLocaleUpperCase() ==
                "KLARNA" ? (
                <>
                  <img src="/assets/klarnaTag.svg"></img>
                </>
              ) : methods.package.package_name ? (
                <img src="/assets/paypalTag.svg"></img>
              ) : (
                ""
              )}
            </p>
          </div>
        )}

        {props.loadCard && props.id == "CARD" && (
          <div>
            <CardDetail
              setNumber={props.setNumber}
              setCvc={props.setCvc}
              setName={props.setName}
              setExpiry={props.setExpiry}
              encrypted={props.encrypted}
              setExpiryValidated={props.setExpiryValidated}
            />
          </div>
        )}
        {props.loadEasyPaisa && props.id == "EASYPAISA" && (
          <div>
            <Row className="mt-30 mb-10">
              <Col md={12}>
                <TextField
                  className="single-input "
                  id="filled-basic"
                  label="Phone Number"
                  variant="filled"
                  style={{ width: "100%" }}
                  autoFocus
                  type="text"
                  InputProps={{
                    className: "user-input-card border-grey",
                  }}
                  value={props.phoneNumber}
                  onBlur={(e) => {
                    validatePhoneNumberHandler(props.phoneNumber);
                  }}
                  onChange={(e) => {
                    if (window.location.pathname == "/failure") {
                      props.encrypted.easy_paisa_phone = e.target.value;
                    }
                    props.setPhoneNumber(e.target.value);
                  }}
                />
              </Col>
            </Row>
          </div>
        )}

        {props.loadDirectBank && props.id == "DIRECT_BANK_TRANSFER" && (
          <div>
            {methods.accounts.map((account: any) => (
              <Row className="mt-30 mb-10">
                <Col md={4} lg={4} xs={4}>
                  {account.bank.name}
                </Col>
                <Col md={8} lg={8} xs={8}>
                  {account.account_number}
                </Col>
              </Row>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MethodCard;
