export enum GAMessages {
  PHONE_PAGE = "QP-CheckoutStarted",
  OTP_PAGE = "QP-OtpPage",
  OTP_SENT_SUCCESSFULLY = "QP-OtpSent",
  PAYMENT_PAGE = "QP-PaymentPage",
  NEW_ADDRESS = "QP-NewAddressAdded", // on success response
  EDIT_ADDRESS = "QP-AddressEdited", // on success response
  ADDRESS_REMOVED = "QP-AddressRemoved", // on success response
  GATEWAY_SELECTED = "QP-PaymentMethodSelected",
  CUPON_ACTIVATED = "QP-CouponActivated", // on success response
  ORDER_SUCCESS_PAGE = "QP-OrderPlacedSuccessfully",
  ORDER_DETAILS_PAGE = "QP-OrderDetailsPage",

  //On verify OTP - if response is returning user = "QP-ReturningUser"
  RETURNING_USER = "QP-ReturningUser",

  //On successfully submitting registration form for new user = "QP-NewUser"
  NEW_USER = "QP-NewUser",

  //On successfully submitting registration form for guest checkout button = "QP-GuestUser"
  GUEST_USER = "QP-GuestUser",
}
