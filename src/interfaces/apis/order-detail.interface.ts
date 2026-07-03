import { IProduct } from "../product.interface";
import { IShippingMethod } from "../shipping-method.interface";
import { IShipping } from "../shipping.interface";

interface ICartItem {
  id: number;
  cart_id: number;
  category: number;
  name: string;
  reference: string;
  type: string;
  quantity: number;
  amount: number;
  unit_price: number;
  image_url: string;
  product_url: string;
  color: string;
  size: string;
  brand: string;
  sku: string;
  weight: string;
  height: string;
  width: string;
  length: string;
  description: string;
}
interface IOrderDetail {
  order_id: number;
  retailer_id: number;
  user_id: number;
  tracking_id: string;
  merchant_user_id: number;
  fee: number;
  one_click_fee: number;
  refund_amount: string;
  refund_reason: string;
  remaining_installment_amount: number;
  order_amount: number;
  tax_amount: number;
  currency: string;
  foreign_amount: number;
  shipping_amount: number;
  order_status: string;
  store_type: string;
  transaction_datetime: string;
  created_by: number;
  redirect_url: string;
  call_back_url: string;
  notification_url: string;
  created_at: string;
  updated_at: string;
  cart_items: ICartItem[];
  order_number: string;
  merchant_order_id: string;
  is_tez: number;
}

interface IAddress {
  shipping_address1: string;
  shipping_address2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
}

interface ICardDetail {
  card_id: string;
  card_type: string;
  card_holder_name: string;
  card_number: string;
  card_expiry_date: string;
  stripe_card_id: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

interface ICustomerDetail {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string;
  gender: string;
  status: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type: string;
  shipping_address: IAddress;
  billing_address: IAddress;
  card_details: ICardDetail;
  created_at: string;
  updated_at: string;
}

export interface IOrderDetailResponse {
  current_order_detail: IOrderDetail;
  customer_details: ICustomerDetail;
}
