import { useState, useContext } from "react";
import { Context as CheckoutContext } from "../context/checkoutContext";
import moment from "moment";
import { usePaymentSelectionHook } from "./usePaymentSelection";

const usePaymentDetailHook = () => {
  const {
    state: { walletBalance, discountedAmount, walletToggleButtonCheck },
    actions: { updateStateHandler },
  } = useContext(CheckoutContext);

  const [selectedPayment, setSelectedPayment] = useState<boolean>(false);

  const [tabPay4, setTabPay4] = useState<boolean>(true);
  const [tabPay3, setTabPay3] = useState<boolean>(true);
  const [tabPay2, setTabPay2] = useState<boolean>(true);
  const [tabPay6, setTabPay6] = useState<boolean>(false);
  const [p_fee, setP_fee] = useState<string | number>();

  const getInstallmentDate = (Number: number, InstallmentDate: string) => {
    //2015-01-29
    var currentDate;
    if (InstallmentDate === "") currentDate = moment();
    else {
      currentDate = moment(InstallmentDate);
    }

    var futureMonth = moment(currentDate).add(Number, "M");
    var futureMonthEnd = moment(futureMonth).endOf("month");

    if (
      currentDate.date() !== futureMonth.date() &&
      futureMonth.isSame(futureMonthEnd.format("MMM DD,YYYY"))
    ) {
      futureMonth = futureMonth.add(1, "d");
    }

    return futureMonth.format("MMM DD,YYYY").toString();
  };

  const [firstInstallmentDate, setFirstInstallmentDate] = useState<string>(
    getInstallmentDate(0, "")
  );
  const [secondInstallmentDate, setSecondInstallmentDate] = useState<string>(
    getInstallmentDate(1, firstInstallmentDate)
  );
  const [thirdInstallmentDate, setThirdInstallmentDate] = useState<string>(
    getInstallmentDate(1, secondInstallmentDate)
  );
  const [fourthInstallmentDate, setFourthInstallmentDate] = useState<string>(
    getInstallmentDate(1, thirdInstallmentDate)
  );
  const [fifthInstallmentDate, setFifthInstallmentDate] = useState<string>(
    getInstallmentDate(1, fourthInstallmentDate)
  );
  const [sixthInstallmentDate, setSixthInstallmentDate] = useState<string>(
    getInstallmentDate(1, fifthInstallmentDate)
  );
  const [seventhInstallmentDate, setSeventhInstallmentDate] = useState<string>(
    getInstallmentDate(1, sixthInstallmentDate)
  );
  const [eighthInstallmentDate, setEighthInstallmentDate] = useState<string>(
    getInstallmentDate(1, seventhInstallmentDate)
  );
  const [ninthInstallmentDate, setNinthInstallmentDate] = useState<string>(
    getInstallmentDate(1, eighthInstallmentDate)
  );

  const [tenthInstallmentDate, setTenthInstallmentDate] = useState<string>(
    getInstallmentDate(1, ninthInstallmentDate)
  );

  const [eleventhInstallmentDate, setEleventhInstallmentDate] =
    useState<string>(getInstallmentDate(1, tenthInstallmentDate));
  const [twelfthInstallmentDate, setTwelfthInstallmentDate] = useState<string>(
    getInstallmentDate(1, eleventhInstallmentDate)
  );

  const [halfAmountToPay, setHalfAmountToPay] = useState<string>("");
  const [secondHalfAmountToPay, setSecondHalfAmountToPay] =
    useState<string>("");
  const [sixthAmount, setSixthAmount] = useState<string>("");
  const [lastSixthAmount, setLastSixthAmount] = useState<string>("");
  const [threeAmount, setThreeAmount] = useState<string>("");
  const [twoAmount, setTwoAmount] = useState<string>("");
  const [lastThreeAmount, setLastThreeAmount] = useState<string>("");
  const [lastTwoAmount, setLastTwoAmount] = useState<string>("");

  const [twelfthAmount, setTwelfthAmount] = useState<string>("");
  const [lastTwelfthAmount, setLastTwelfthAmount] = useState<string>("");

  /**
   * @description dive 4 or 6 amount of chunk and update the states
   * @param amount
   */
  const updateAmountHandler = (amount: string) => {
    // console.log("innnnnn")
    let fullAmount =
      parseInt(amount) -
      (walletToggleButtonCheck === "TRUE" ? Number(walletBalance) : 0) -
      discountedAmount;

    // making pay in three payment division

    let threeSplitAmount = fullAmount / 3;
    if (threeSplitAmount == Math.floor(threeSplitAmount)) {
      setThreeAmount(String(threeSplitAmount));
      setLastThreeAmount(String(threeSplitAmount));
    } else {
      let roundOffThree = Math.round(threeSplitAmount);

      let thirdAmountLast = fullAmount - roundOffThree * 5;

      setThreeAmount(String(roundOffThree));
      setLastThreeAmount(String(thirdAmountLast));
    }

    // making pay in two payment division

    let twoSplitAmount = fullAmount / 2;
    if (twoSplitAmount == Math.floor(twoSplitAmount)) {
      setTwoAmount(String(twoSplitAmount));
      setLastTwoAmount(String(twoSplitAmount));
    } else {
      let roundOffTwo = Math.round(twoSplitAmount);

      let secondAmountLast = fullAmount - roundOffTwo * 1;

      setTwoAmount(String(roundOffTwo));
      setLastTwoAmount(String(secondAmountLast));
    }

    // making pay in four payment division

    let halfAmount = fullAmount / 4;

    if (halfAmount == Math.floor(halfAmount)) {
      setHalfAmountToPay(String(halfAmount));
      setSecondHalfAmountToPay(String(halfAmount));
    } else {
      let roundOff = Math.round(halfAmount);

      let secondAmount = fullAmount - roundOff * 3;

      setHalfAmountToPay(String(roundOff));
      setSecondHalfAmountToPay(String(secondAmount));
    }

    //making pay in 6 payment division

    let splitAmount = fullAmount / 6;
    if (splitAmount == Math.floor(splitAmount)) {
      setSixthAmount(String(splitAmount));
      setLastSixthAmount(String(splitAmount));
    } else {
      let roundOffSix = Math.round(splitAmount);

      let sixthAmountLast = fullAmount - roundOffSix * 5;

      setSixthAmount(String(roundOffSix));
      setLastSixthAmount(String(sixthAmountLast));
    }

    //making pay in 12 payment division

    let twelveSplitAmount = fullAmount / 12;
    if (twelveSplitAmount == Math.floor(twelveSplitAmount)) {
      setTwelfthAmount(String(twelveSplitAmount));
      setLastTwelfthAmount(String(twelveSplitAmount));
    } else {
      let roundOffTwelfth = Math.round(twelveSplitAmount);

      let TwelfthAmountLast = fullAmount - roundOffTwelfth * 11;

      setTwelfthAmount(String(roundOffTwelfth));
      setLastTwelfthAmount(String(TwelfthAmountLast));
    }
  };

  return {
    states: {
      selectedPayment,
      tabPay4,
      tabPay6,
      p_fee,
      firstInstallmentDate,
      secondInstallmentDate,
      thirdInstallmentDate,
      fourthInstallmentDate,
      fifthInstallmentDate,
      sixthInstallmentDate,
      halfAmountToPay,
      secondHalfAmountToPay,
      sixthAmount,
      lastSixthAmount,
      threeAmount,
      twoAmount,
      lastThreeAmount,
      lastTwoAmount,
      twelfthAmount,
      lastTwelfthAmount,
      seventhInstallmentDate,
      eighthInstallmentDate,
      ninthInstallmentDate,
      tenthInstallmentDate,
      eleventhInstallmentDate,
      twelfthInstallmentDate,
    },
    setStates: {
      setP_fee,
      setHalfAmountToPay,
      setSecondHalfAmountToPay,
      setSixthAmount,
      setLastSixthAmount,
      setThreeAmount,
      setTwoAmount,
      setLastThreeAmount,
      setLastTwoAmount,
    },
    handlers: {
      updateAmountHandler,
    },
  };
};

export default usePaymentDetailHook;
