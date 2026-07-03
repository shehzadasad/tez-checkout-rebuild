import React, { useReducer, createContext } from "react";
import {
  checkoutInitialState,
  IInitialContextCheckoutState,
} from "./checkoutInitialState";

export default (
  reducer: any,
  actions: any,
  defaultValue: IInitialContextCheckoutState
) => {
  const Context = createContext<{
    state: IInitialContextCheckoutState;
    actions: any;
  }>({
    state: checkoutInitialState,
    actions: { ...actions },
  });

  const Provider = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions: any = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider
        value={{
          state: state as IInitialContextCheckoutState,
          actions: { ...boundActions },
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
