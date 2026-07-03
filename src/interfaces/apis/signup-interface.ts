import { IBilling } from "../billing.interface";
import { IShipping } from "../shipping.interface";
import { IUser } from "../user.interaface";

export interface ISignup {
  checkout_anonymous_id:number,
  isEventsEnabled:boolean;
  segmentId: string;
  user: Omit<IUser, "id" | "status" | "gender">;
  shipping: IShipping;
  billing: IBilling;
  rs_anonymous_id: string;
}

export interface ISignupResponse {
  token: string;
  userId: number;
}
