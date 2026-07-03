import "../../styles/checkout.css";
import { Dna } from "react-loader-spinner";
import { useCouponCodeHook } from "../../hooks/custom/useCouponCode";
import { useContext } from "react";
import { Context as CheckoutContext } from "../../hooks/context/checkoutContext";

const Coupons: React.FC = () => {
  const {
    states: { loading, error, couponCode },
    setStates: { setCouponCode },
    handlers: { applyCouponCodeHandler },
  } = useCouponCodeHook();

  const {
    state: { emailValidated, isCouponApplied, countryCode: cCouponCOde },
    actions: {},
  } = useContext(CheckoutContext);

  return (
    <div>
      {/* //COUPON CODE FIELD */}
      <div className="couponContainer">
        <input
          disabled={!emailValidated}
          type="text"
          placeholder="Enter Coupon"
          value={couponCode ?? cCouponCOde}
          onChange={(e) => setCouponCode(e.target.value)}
          className="couponInput"
        />

        <button
          type="button"
          // disabled={isCouponApplied || loading}
          onClick={applyCouponCodeHandler}
          className="applyCouponBtn"
        >
          Apply
        </button>
      </div>
      {loading && (
        <div className={"item"}>
          <Dna
            visible={loading}
            wrapperStyle={{
              textAlign: "center",
              position: "absolute",
              top: " 50%",
              left: "35%",
            }}
            height={120}
            width={120}
            wrapperClass="dna-wrapper"
          />
        </div>
      )}
      {isCouponApplied && (
        <div className="couponApplied">
          <p>Coupon Applied</p>
        </div>
      )}
      {error != "" && (
        <div className="couponError">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Coupons;
