import React, { createContext, useContext, useReducer } from "react";
import { ConfigAction, configReducer, initialConfig } from "@/reducers/config-reducer";

export const ConfigContext = createContext(initialConfig);

export const ConfigDispatchContext = createContext<React.Dispatch<ConfigAction>>(() => {});

export const ConfigProvider = ({ children }: { children?: JSX.Element }) => {
  const [config, dispatch] = useReducer(configReducer, initialConfig);

  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>{children}</ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};

export const useConfigDispatch = () => {
  return useContext(ConfigDispatchContext);
};
