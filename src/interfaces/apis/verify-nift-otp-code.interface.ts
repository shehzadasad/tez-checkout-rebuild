import { IBilling } from "../billing.interface";
import { IShipping } from "../shipping.interface";
import { IUser } from "../user.interaface";

export interface IVerifyNitOtpCode {
  bank_id: string;
  otp: string;
  gateway: string;
  order_id: string;
}
