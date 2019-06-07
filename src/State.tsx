import React, { useEffect } from "react";
import { DiscoveredService } from "./models";
import { ActionTypes } from "./actions";
import { NetworkStatus } from "@capacitor/core";
import { getObject, setObject } from "./util/localstorage";

let AppContext = (React as any).createContext();

export interface StateType {
  services: DiscoveredService[];
  manualServices?: DiscoveredService[];
  networkStatus?: NetworkStatus;
}

let initialState: StateType = {
  services: [],
  manualServices: []
};

const persistedState = getObject('persistedState');

let reducer = (state: any, action: any) => {
  switch(action.type) {
    case ActionTypes.SetServices: {
      return { ...state, services: action.services }
    }
    case ActionTypes.SetManualServices: {
      return { ...state, manualServices: action.services }
    }
    case ActionTypes.RemoveManualService: {
      return { ...state, manualServices: state.manualServices.filter((s: DiscoveredService) => s !== action.service) }
    }
    case ActionTypes.SetNetworkStatus: {
      return { ...state, networkStatus: action.status }
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

function persistState(state: StateType) {
  console.log('Persisting state', state.manualServices);
  setObject('persistedState', {
    manualServices: state.manualServices
  });
}

function AppContextProvider(props: any) {
  const fullInitialState = {
    ...initialState,
    ...persistedState
  }

  let [state, dispatch] = React.useReducer(loggerReducer, fullInitialState);

  useEffect(() => {
    // Persist any state we want to
    persistState(state);
  }, [state]);

  let value = { state, dispatch };


  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };