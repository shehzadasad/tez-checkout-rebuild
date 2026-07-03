export const setUserData = (
  name: any,
  lastName: any,
  address: any,
  city: any,
  country: any,
  sameBilling: any,
  b_address: any,
  b_city: any,
  b_country: any,
  state: any,
  shippingCity: any,
  shippingCountry: any
) => {
  const updatedState = {
    billingAddress: "",
    billingCity: "",
    billingCountry: "",
    address: "",
    city: "",
    country: "",
    name: "",
    lastName: "",
    state: "",
    shippingCountry: "",
    shippingCity: "",
  };
  if (sameBilling) {
    updatedState.billingAddress = address ?? "";
    updatedState.billingCity = city ?? "";
    updatedState.billingCountry = country ?? "";
    updatedState.address = address ?? "";
    updatedState.city = city ?? "";
    updatedState.country = country ?? "";
    updatedState.name = name ?? "";
    updatedState.lastName = lastName ?? "";
    updatedState.state = state ?? "";
    updatedState.shippingCity = shippingCity ?? "";
    updatedState.shippingCountry = shippingCountry ?? "";
  } else {
    updatedState.billingAddress = b_address ?? "";
    updatedState.billingCity = b_city ?? "";
    updatedState.billingCountry = b_country ?? "";
    updatedState.address = address ?? "";
    updatedState.city = city ?? "";
    updatedState.country = country ?? "";
    updatedState.name = name ?? "";
    updatedState.lastName = lastName ?? "";
    updatedState.state = state ?? "";
    updatedState.shippingCity = shippingCity ?? "";
    updatedState.shippingCountry = shippingCountry ?? "";
  }
  return updatedState;
};
