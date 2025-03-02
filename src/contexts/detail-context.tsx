import React, { createContext, useContext, useReducer } from "react";
import { DetailAction, detailReducer, initialDetail } from "@/reducers/detail-reducer";
import { usePersistReducerState } from "@/hooks/use-persist";

export const DetailContext = createContext(initialDetail);

export const DetailDispatchContext = createContext<React.Dispatch<DetailAction>>(() => {});

export const DetailProvider = ({ children }: { children?: JSX.Element }) => {
  const [detail, dispatch] = useReducer(detailReducer, initialDetail);

  usePersistReducerState(detail, ["messages", "isISO8601"], (isISO8601: boolean) => {
    if (isISO8601 === detail.messages.isISO8601) return;
    dispatch({ type: "toggleIsISO8601" });
  });
  usePersistReducerState(detail, ["messages", "isPreview"], (isPreview: boolean) => {
    if (isPreview === detail.messages.isPreview) return;
    dispatch({ type: "toggleIsPreview" });
  });
  usePersistReducerState(detail, ["messages", "isStickyScroll"], (isStickyScroll: boolean) => {
    if (isStickyScroll === detail.messages.isStickyScroll) return;
    dispatch({ type: "toggleIsStickyScroll" });
  });
  usePersistReducerState(detail, ["tab"], (tab: "messages" | "headers") => {
    if (tab === detail.tab) return;
    dispatch({ type: "switchedTab", tab });
  });

  return (
    <DetailContext.Provider value={detail}>
      <DetailDispatchContext.Provider value={dispatch}>{children}</DetailDispatchContext.Provider>
    </DetailContext.Provider>
  );
};

export const useDetail = () => {
  return useContext(DetailContext);
};

export const useDetailDispatch = () => {
  return useContext(DetailDispatchContext);
};
