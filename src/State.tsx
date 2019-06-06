import React from "react";
import { DiscoveredService } from "./models";

let AppContext = (React as any).createContext();

export interface StateType {
  services: DiscoveredService[];
}

let initialState: StateType = {
  services: []
};

let reducer = (state: any, action: any) => {
  switch(action.type) {
    case "setServices": {
      return { ...state, services: action.services }
    }
  }
  return state;
};

const logger = (reducer: any) => {
  const reducerWithLogger = (state: any, action: any) => {
    console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", state);
    console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action);
    console.log("%cNext State:", "color: #47B04B; font-weight: 700;", reducer(state,action));
    return reducer(state,action);
  };
  return reducerWithLogger;
}

const loggerReducer = logger(reducer);

function AppContextProvider(props: any) {
  const fullInitialState = {
    ...initialState,
  }

  let [state, dispatch] = React.useReducer(loggerReducer, fullInitialState);
  let value = { state, dispatch };


  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };