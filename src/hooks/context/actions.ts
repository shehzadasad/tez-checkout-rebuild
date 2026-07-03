import { IInitialContextCheckoutState } from "./checkoutInitialState";

export enum ECheckoutActionType {
    UPDATE_STATE
}

export interface IUpdateStateHandler {
    type: ECheckoutActionType,
    payload: IInitialContextCheckoutState
}

export type CheckoutActions = IUpdateStateHandler;