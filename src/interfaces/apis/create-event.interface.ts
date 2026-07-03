interface IEventProduct {
  sku: string | null;
  category: string | null;
  name: string;
  brand: string;
  variant: string;
  price: number;
  quantity: number;
  coupon: string | null;
}

export interface ICreateEvent {
  checkout_anonymous_id?:any,
  rs_anonymous_id?: string,
  ip_address:string,
  checkout_url: string;
  checkout_type: string;
  affiliation: string;
  subtotal: number;
  total: number;
  revenue: number;
  shipping: number;
  tax: number;
  discount: number;
  coupon: string;
  currency: string;
  country: string;
  locale: string;
  product: IEventProduct[];
  segment_id: string;
  user_id?: string;
  phone_number?: string;
  missed_apms?: string[];
}
