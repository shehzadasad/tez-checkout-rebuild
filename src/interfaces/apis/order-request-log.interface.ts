import { IProduct } from "../product.interface";

export interface IOrderRequestLog {
  headers: {
    Authorization: string[];
    "Identity-Token": string[];
    Origin: string[];
  };
  id: number;
  order_id: number;
  request: IRequest;
  tracking_id: string;
}

export interface IRequest {
  query_string: string;
  amount: number;
  discounted_amount: number;
  coupon_code: string;
  cancelled_url: string;
  created_by: number;
  customer_id: number;
  email: string;
  fee: number;
  installments_no: number;
  country_code: string;
  line_items: IProduct[];
  is_tez: number;
  merchant_order_id: number;
  merchant_request: string;
  merchant_data: {
    email: string;
    merchant: {
      MerchantDetails: {
        MerchantPackage: any; //TODO: check type
        buisness_name: string;
        buisness_size: string;
        cnic: string;
        description: string;
        id: number;
        logo_path: string;
        platform: string;
        referrel: string;
        registered_name: string;
        thumbnail: string;
        user_id: number;
        website_url: string;
      };
      MerchantPackage: {
        Package: {
          MerchantPackages: any; //TODO: check type

          description: string;
          frequency: string;
          fullname: string;
          gateway_package_credential_id: number;
          id: number;
          image_path: string;
          is_oneclick_checkout: number;
          name: string;
          payment_gateway_id: number;
        };
        PaymentGateway: {
          id: number;
          logo: string;
          name: string;
          payment_gateway_category_id: number;
          status: boolean;
          sub_title: string;
          title: string;
        };
        PaymentGatewayConfiguration: {
          credentials: string;
          id: number;
          merchant_package_id: number;
          percentage: number;
        };
        category_id: number;
        default_plan: string;
        id: number;
        is_3d_secure: string; //TODO: check type
        max_amount: string; //TODO:check type
        merchantPaymentGateways: any; //TODO: check type
        min_amount: string; //TODO: check type
        one_click_product_flat_fee: number;
        one_click_product_percent: number;
        package_id: number;
        payment_gateway_id: number;
        product_flat_fee: string; //TODO: check type
        product_percent: string; //TODO: check type

        user_id: number;
      };
      address: string;
      city: string;
      city_id: number;
      country: string;
      country_id: number;
      date_of_birth: string;
      email: string;
      email_verified_at: string;
      gender: string;
      id: number;
      latitude: string;
      longitude: string;
      name: string;
      notification_status: string;
      password: string; //TODO: dont need this
      phone_number: string;
      phone_number_verified_at: string;
      profile_photo_path: string;
      state: string;
      state_id: number;
      status: string;
      timezone: string;
      type: string;
      user_id: number;
      zip: string;
    };
  };
  merchant_id: number;
  merchant_package_id: number;
  merchant_package_name: string;
  merchant_user: {
    id: number;
  };
  merchant_user_id: number;
  notification_url: string;
  one_click_fee: number;
  payment_type: string; //TODO: enum
  payout_amount: number;
  redirect_url: string;
  store_type: string; //TODO: enum
  store_url: string;
  total_amount: number;
  tax_amount: number;
  currency: string;
  shipping_amount: number;
  shipping_title: string;
  shipping_info: {
    address1: string;
    address2: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  user: {
    address: string;
    date_of_birth: string;
    email: string;
    gender: string;
    id: number;
    name: string;
    phone_number: string;
    zip: string;
  };
  is4gives: boolean;
  isExistingUser: boolean;
  full_amount: string;
  installment_amount: any;
  processing_fee: any;
  processing_fee_percentage: any;
}
