import { Config } from "@/entities/config";
import { Reducer } from "react";
import type { DeepReadonly } from "ts-essentials";

export type ConfigAction =
  | { type: "toggledShouldPreserveLog" }
  | { type: "toggledShouldRecord" }
  | { type: "toggledShouldShowFilter" };

export const initialConfig: Config = {
  shouldPreserveLog: false,
  shouldRecord: true,
  shouldShowFilter: true,
};

export const configReducer: Reducer<DeepReadonly<Config>, ConfigAction> = (state, action) => {
  switch (action.type) {
    case "toggledShouldPreserveLog":
      return {
        ...state,
        shouldPreserveLog: !state.shouldPreserveLog,
      };

    case "toggledShouldRecord":
      return {
        ...state,
        shouldRecord: !state.shouldRecord,
      };

    case "toggledShouldShowFilter":
      return {
        ...state,
        shouldShowFilter: !state.shouldShowFilter,
      };

    default: {
      const _: never = action;
      throw Error(`Unknown action ${_}`);
    }
  }
};
