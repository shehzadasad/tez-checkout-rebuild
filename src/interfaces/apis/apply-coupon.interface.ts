export interface IApplyCoupon {
  code: string;
  // total_price: string;
  email:string
}

export interface IApplyCouponResponse {
  discountedAmount: string;
  couponCode: string;
  type: string; //enums
  discountValue: number;
  total_price: string;
  error:string
}
