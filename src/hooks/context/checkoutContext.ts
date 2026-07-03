import React from "react";
import {
  CheckoutActions,
  ECheckoutActionType,
  IUpdateStateHandler,
} from "./actions";
import {
  checkoutInitialState,
  IInitialContextCheckoutState,
} from "./checkoutInitialState";
import createDataContext from "./createDataContext";

const checkoutReducer = (
  state: IInitialContextCheckoutState,
  action: CheckoutActions
) => {
  switch (action.type) {
    case ECheckoutActionType.UPDATE_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const updateStateHandler =
  (dispatch: React.Dispatch<IUpdateStateHandler>) =>
  ({ payload }: { payload: IInitialContextCheckoutState }) => {
    // console.log("trigger", payload);
    dispatch({
      type: ECheckoutActionType.UPDATE_STATE,
      payload: {
        ...payload,
      },
    });
  };

export const { Provider, Context } = createDataContext(
  checkoutReducer,
  {
    updateStateHandler,
  },
  { ...checkoutInitialState }
);
