export const getCurrencySymbol = (currency: string) => {
  if (currency == "PKR") {
    return "Rs.";
  } else if (currency == "PHP") {
    return "₱";
  } else {
    return "$";
  }
};
