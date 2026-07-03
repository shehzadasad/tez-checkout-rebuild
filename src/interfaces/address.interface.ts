import { EAddressType } from "../enums/address-type.enum";

export interface IAddress {
  id?: number;
  name: string;
  phone_number: string;
  address_1: string;
  address_2?: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  address_type: EAddressType;
  is_default: boolean;
  rs_anonymous_id: string;
}
