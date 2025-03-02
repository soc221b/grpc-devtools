import { Filter } from "@/entities/filter";
import { Reducer } from "react";
import type { DeepReadonly } from "ts-essentials";

export type FilterAction =
  | { type: "changed"; value: string }
  | { type: "cleared" }
  | { type: "inverted" }
  | { type: "toggledCaseSensitive" };

export const initialFilter: Filter = {
  caseSensitive: false,
  invert: false,
  text: "",
};

export const filterReducer: Reducer<DeepReadonly<Filter>, FilterAction> = (state, action) => {
  switch (action.type) {
    case "changed":
      return {
        ...state,
        text: action.value,
      };

    case "cleared":
      return {
        ...state,
        text: "",
      };

    case "inverted":
      return {
        ...state,
        invert: !state.invert,
      };

    case "toggledCaseSensitive":
      return {
        ...state,
        caseSensitive: !state.caseSensitive,
      };

    default: {
      const _: never = action;
      throw Error(`Unknown action ${_}`);
    }
  }
};
