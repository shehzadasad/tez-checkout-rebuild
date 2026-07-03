import { EOtpType } from "../../enums/otp-type.enum";

export interface ISendOtp {
  checkout_anonymous_id:number;
  productTotalAmount:number;
  isEventsEnabled:boolean;
  haveUpdatedEmail:boolean;
  userID:string;
  value: string;
  type: EOtpType;
  resend: number;
  segmentId: string;
  checkoutUrl: string;
  rs_anonymous_id: string;
}

export interface ISendOtpResponse {
  value: string;
  type: EOtpType;
  resend: number;
  otpSent: boolean;
}
