import { EAddressType } from "../../enums/address-type.enum";

export interface IAddAddressOld {
  userId: number;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingZipCode: string;
  billingAddress1: string;
  billingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingZipCode: string;
  shippingAddress1: string;
  shippingAddress2?: string;
}
