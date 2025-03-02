import { RequestRow } from "@/entities/request-row";
import { Reducer } from "react";
import type { DeepReadonly } from "ts-essentials";

export type RequestRowsAction =
  | { type: "clearedAll" }
  | { type: "clearedAllMessages"; requestRowId: RequestRow["id"] }
  | { type: "updated"; requestRow: RequestRow }
  | { type: "upload"; requestRows: RequestRow[] };

export const initialRequestRows: {
  requestRowsIdToIndex: Map<RequestRow["id"], number>;
  requestRows: RequestRow[];
} = { requestRowsIdToIndex: new Map(), requestRows: [] };

export const requestRowsReducer: Reducer<
  DeepReadonly<typeof initialRequestRows>,
  RequestRowsAction
> = (state, action) => {
  switch (action.type) {
    case "clearedAll":
      return {
        requestRowsIdToIndex: new Map(),
        requestRows: [],
      };

    case "clearedAllMessages":
      return {
        ...state,
        requestRows: state.requestRows.map((originalRequestRow) => {
          if (originalRequestRow.id === action.requestRowId) {
            return {
              ...originalRequestRow,
              messages: [],
            };
          } else {
            return originalRequestRow;
          }
        }),
      };

    case "updated": {
      if (state.requestRowsIdToIndex.has(action.requestRow.id)) {
        const requestRows = [...state.requestRows];
        const requestRowsIdToIndex = new Map(state.requestRowsIdToIndex);
        const requestRow = { ...action.requestRow };
        (Object.keys(requestRow) as (keyof typeof requestRow)[])
          .filter((key) => requestRow[key] === void 0)
          .forEach((key) => delete requestRow[key]);
        requestRows[requestRowsIdToIndex.get(requestRow.id)!] = {
          ...requestRows[requestRowsIdToIndex.get(requestRow.id)!],
          ...requestRow,
          messages: [
            ...(requestRows[requestRowsIdToIndex.get(requestRow.id)!]?.messages ?? []),
            ...requestRow.messages,
          ],
        };
        return {
          requestRows,
          requestRowsIdToIndex,
        };
      } else if (!!action.requestRow.methodName) {
        const requestRows = [...state.requestRows];
        requestRows.push(action.requestRow);
        const requestRowsIdToIndex = new Map(state.requestRowsIdToIndex);
        requestRowsIdToIndex.set(action.requestRow.id, requestRows.length - 1);
        return {
          requestRows,
          requestRowsIdToIndex,
        };
      } else {
        return state;
      }
    }

    case "upload": {
      const requestRows = action.requestRows;
      const requestRowsIdToIndex = new Map();
      action.requestRows.forEach((requestRow, index) => {
        requestRowsIdToIndex.set(requestRow.id, index);
      });
      return {
        requestRows,
        requestRowsIdToIndex,
      };
    }

    default: {
      const _: never = action;
      throw Error(`Unknown action ${_}`);
    }
  }
};
