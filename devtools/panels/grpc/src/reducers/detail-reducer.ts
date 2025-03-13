import { Detail } from "@/entities/detail";
import { Reducer } from "react";
import type { DeepReadonly } from "ts-essentials";

export type DetailAction =
  | { type: "openedDetail"; requestId: Detail["requestId"] }
  | { type: "closedDetail" }
  | { type: "switchedTab"; tab: Detail["tab"] }
  | { type: "openedMessage"; focusedIndex: Detail["messages"]["focusedIndex"] }
  | { type: "closedMessage" }
  | { type: "toggleIsPreview" }
  | { type: "toggleIsISO8601" }
  | { type: "toggleIsStickyScroll" };

export const initialDetail: Detail = {
  requestId: null,
  tab: "headers",
  messages: {
    focusedIndex: null,
    isPreview: true,
    isISO8601: true,
    isStickyScroll: true,
  },
};

export const detailReducer: Reducer<DeepReadonly<Detail>, DetailAction> = (state, action) => {
  switch (action.type) {
    case "openedDetail":
      return {
        ...state,
        requestId: action.requestId,
      };

    case "closedDetail":
      return {
        ...state,
        requestId: null,
      };

    case "switchedTab":
      return {
        ...state,
        tab: action.tab,
      };

    case "openedMessage":
      return {
        ...state,
        messages: {
          ...state.messages,
          focusedIndex: action.focusedIndex,
        },
      };

    case "closedMessage":
      return {
        ...state,
        messages: {
          ...state.messages,
          focusedIndex: null,
        },
      };

    case "toggleIsPreview":
      return {
        ...state,
        messages: {
          ...state.messages,
          isPreview: !state.messages.isPreview,
        },
      };

    case "toggleIsISO8601":
      return {
        ...state,
        messages: {
          ...state.messages,
          isISO8601: !state.messages.isISO8601,
        },
      };

    case "toggleIsStickyScroll":
      return {
        ...state,
        messages: {
          ...state.messages,
          isStickyScroll: !state.messages.isStickyScroll,
        },
      };

    default: {
      const _: never = action;
      throw Error(`Unknown action ${_}`);
    }
  }
};
