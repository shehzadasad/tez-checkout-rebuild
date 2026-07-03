import { IProduct } from "../product.interface";
import { IShippingMethod } from "../shipping-method.interface";
import { IShipping } from "../shipping.interface";

interface IAddressInfo {
  address1: string;
  address2: string;
  state: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
}

export interface IPlaceOrder {
  is_new_checkout:boolean;
  mall_taxes: any;
  isEventsEnabled:boolean;
  system_source :string;
  platform_fee:any;
  discount_code:string;
  mall_id: any;
  email: any;
  is_headless: any;
  payment_method_id: any;
  view_id: string;
  tracking_id: string;
  shipping_methods: any;
  merchant_package_id: number;
  cart_Id: any;
  attribute: any;
  attribute_ids: any;
  processing_fee: any;
  processing_fee_percentage: any;
  store_url: string;
  quantity: number;
  is_card_tokenized: boolean;
  tokenized_card_id: string;
  merchant_call_back_url: string;
  place_order_on_merchant_site: string;
  shipping_amount: number;
  shipping_title: any;
  tax_amount: number;
  total_amount: number;
  cvv: string | any;
  card_number: string | any;
  refrence_id: string;
  card_holder_name: string;
  phone_number: string;
  expiry_month: string | any;
  expiry_year: string | any;
  tokenized_card: boolean;
  account_number: string;
  source: string; //TODO: determine its value
  currency: string;
  shipping_info: IAddressInfo;
  billing_info: IAddressInfo;
  line_items: IProduct[];
  package_name: string; //TODO: values should be in enum
  shippingScreenNew: boolean;
  is_guest: boolean;
  query_string: string;
  payment_token?: string;
  coupon_code: string;
  discounted_amount: number;
  is_tez: number;
  checkout_url: string;
  store_type: string;
  cnic: string;
  bank_id: string;
  meta: string;
  redirect_url: string;
  call_back_url: string;
  merchant_order_id: string;
  merchant_request: string;
  segmentId: string;
  bank_name: string;
  is4gives: boolean;
  isExistingUser: boolean;
  is_wallet_enabled: boolean;
  wallet_amount: any;
  wallet_percentage: string | number;
  invoice_id: any;
  headless_url: any;
  link_id: any;
  rs_anonymous_id: any;
}

interface IAlfaResponse {
  AuthToken: string;
  ChannelId: string;
  Currency: string;
  IsBIN: string;
  MerchantHash: string;
  MerchantId: string;
  MerchantPassword: string;
  MerchantUsername: string;
  RequestHash: string;
  ReturnURL: string;
  StoreId: string;
  TransactionAmount: string;
  TransactionReferenceNumber: string;
  TransactionTypeId: string;
}

export interface IPlaceOrderResponse {
  bin_discount: any;
  html_snippet: string | null | any;
  order_created: boolean;
  order_id: string;
  session_id: string;
  redirect_url: string | null;
  success: boolean;
  tracking_id: string;
  alfa_form_data: IAlfaResponse;
  order_number: string;
  platform: string;
  mulberry_url: any;
  transaction_id: any;
}
