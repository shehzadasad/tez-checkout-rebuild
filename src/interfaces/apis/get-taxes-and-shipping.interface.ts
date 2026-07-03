import { IShippingDetail } from "../shipping-detail.interface";
import { ITax } from "../tax.interface";

export interface IGetTaxesAndShippingResponse {
  taxes: ITax[];
  shipping: IShippingDetail[];
}
