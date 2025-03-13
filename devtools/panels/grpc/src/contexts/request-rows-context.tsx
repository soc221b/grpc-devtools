import {
  initialRequestRows,
  RequestRowsAction,
  requestRowsReducer,
} from "@/reducers/request-rows-reducer";
import React, { createContext, useContext, useReducer } from "react";

export const RequestRowsContext = createContext(initialRequestRows);

export const RequestRowsDispatchContext = createContext<React.Dispatch<RequestRowsAction>>(
  () => {},
);

export const RequestRowsProvider = ({ children }: { children?: JSX.Element }) => {
  const [
    requestRows,
    dispatch,
  ] = useReducer(requestRowsReducer, initialRequestRows);

  return (
    <RequestRowsContext.Provider value={requestRows}>
      <RequestRowsDispatchContext.Provider value={dispatch}>
        {children}
      </RequestRowsDispatchContext.Provider>
    </RequestRowsContext.Provider>
  );
};

export const useRequestRows = () => {
  return useContext(RequestRowsContext).requestRows;
};

export const useRequestRowsDispatch = () => {
  return useContext(RequestRowsDispatchContext);
};
