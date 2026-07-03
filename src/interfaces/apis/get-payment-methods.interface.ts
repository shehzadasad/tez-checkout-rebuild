import { ICard } from "../card.interface";
import { IPaymentMethod } from "../payment-method.interface";

export interface IGetPaymentMethodResponse {
  Others: IPaymentMethod[];
  Qisstpay: IPaymentMethod[];
  cards: ICard[];
  view_id: number | null;
}
