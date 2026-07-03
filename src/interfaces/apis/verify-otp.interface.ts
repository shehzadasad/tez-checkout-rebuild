import { EOtpType } from "../../enums/otp-type.enum";
import { IBilling } from "../billing.interface";
import { IShipping } from "../shipping.interface";
import { IUser } from "../user.interaface";
export interface IVerifyOtp {
  isEventsEnabled:boolean;
  value: string;
  type: EOtpType;
  otp: string;
  segmentId: string;
  checkoutUrl: string;
  signInRequestId: any;
  rs_anonymous_id: string;
}
export interface IVerifyOtpMail {
  userId:any;
  isEventsEnabled:boolean;
  value: string;
  type: EOtpType;
  otp: string;
  segmentId: string;
  checkoutUrl: string;
  signInRequestId: any;
  rs_anonymous_id: string;
}
export interface IVerifyOtpResponseNumber {
  isEventsEnabled: boolean;
  value: string;
  type: EOtpType;
  isEmailVerified: boolean | null;
  isExistingUser: boolean;
  token: string | null;
  user: IUser;
  shipping: IShipping;
  billing: IBilling;
  isStackBuilderEnabled: boolean;
  merchantWalletIsEnabled: any;
  merchantWalletFeePercentage: any;
}
export interface IVerifyOtpResponse {
  value: string;
  type: EOtpType;
  isEmailVerified: boolean | null;
  isExistingUser: boolean;
  token: string | null;
  user: IUser;
  shipping: IShipping;
  billing: IBilling;
  isStackBuilderEnabled: boolean;
  merchantWalletIsEnabled: any;
  merchantWalletFeePercentage: any;
}
