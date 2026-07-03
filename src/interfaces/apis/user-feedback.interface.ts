import { IState } from "../state.interface";

export interface IUserFeedback {
  user_id: string;
  reason: string;
  phone_number: string;
  token: string;
  amount: string;
}

export interface IUrlShort{
  url:string;
}

export interface IUrlShortGet{
  id:string;
}