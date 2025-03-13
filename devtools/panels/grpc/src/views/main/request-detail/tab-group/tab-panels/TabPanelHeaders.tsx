import HorizontalDivider from "@/components/HorizontalDivider";
import useRequestRow from "@/hooks/use-request-row";
import * as ErrorDetailsPb from "@/protos/error_details_pb";
import * as StatusPb from "@/protos/status_pb";
import { TabPanel } from "@headlessui/react";
import { capitalCase } from "change-case";
import React, { useEffect, useState } from "react";
import { useEvent } from "react-use";
import Collapse from "./tab-panel-headers/Collapse";

export type ErrorDetails =
  | ErrorDetailsPb.BadRequest
  | ErrorDetailsPb.DebugInfo
  | ErrorDetailsPb.ErrorInfo
  | ErrorDetailsPb.Help
  | ErrorDetailsPb.LocalizedMessage
  | ErrorDetailsPb.PreconditionFailure
  | ErrorDetailsPb.QuotaFailure
  | ErrorDetailsPb.RequestInfo
  | ErrorDetailsPb.ResourceInfo
  | ErrorDetailsPb.RetryInfo;

type Distribute<T> = T extends any
  ? {
      new (...args: any[]): T;
      deserializeBinary(bytes: Uint8Array): T;
    }
  : never;

const mapTypeUrlToErrorDetailClass: Record<string, Distribute<ErrorDetails>> = {
  "type.googleapis.com/google.rpc.RetryInfo": ErrorDetailsPb.RetryInfo,
  "type.googleapis.com/google.rpc.DebugInfo": ErrorDetailsPb.DebugInfo,
  "type.googleapis.com/google.rpc.QuotaFailure": ErrorDetailsPb.QuotaFailure,
  "type.googleapis.com/google.rpc.ErrorInfo": ErrorDetailsPb.ErrorInfo,
  "type.googleapis.com/google.rpc.PreconditionFailure": ErrorDetailsPb.PreconditionFailure,
  "type.googleapis.com/google.rpc.BadRequest": ErrorDetailsPb.BadRequest,
  "type.googleapis.com/google.rpc.RequestInfo": ErrorDetailsPb.RequestInfo,
  "type.googleapis.com/google.rpc.ResourceInfo": ErrorDetailsPb.ResourceInfo,
  "type.googleapis.com/google.rpc.Help": ErrorDetailsPb.Help,
  "type.googleapis.com/google.rpc.LocalizedMessage": ErrorDetailsPb.LocalizedMessage,
};

function stringToUint8Array(str: string): Uint8Array {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}

const TabPanelRequest = ({ isFocusIn }: { isFocusIn: boolean }) => {
  const requestRow = useRequestRow();

  const [
    focusedIndex,
    setFocusedIndex,
  ] = useState(0);

  const headers = {
    general: {
      "Service Name": requestRow?.serviceName ?? "",
      "Method Name": requestRow?.methodName ?? "",
    },
    responseMetadata: (() => {
      if (requestRow?.responseMetadata) {
        return requestRow.responseMetadata;
      } else if (requestRow?.errorMetadata === undefined) {
        return {};
      } else {
        try {
          // error details
          const statusEncoded = requestRow.errorMetadata["grpc-status-details-bin"]!;
          const statusDecoded = atob(statusEncoded);
          const status = StatusPb.Status.deserializeBinary(stringToUint8Array(statusDecoded));
          const details = status
            .getDetailsList()
            .filter((details) => mapTypeUrlToErrorDetailClass[details.getTypeUrl()])
            .map((details) => ({
              [details.getTypeUrl().split(".").pop()]: mapTypeUrlToErrorDetailClass[
                details.getTypeUrl()
              ]!.deserializeBinary(details.getValue_asU8()).toObject(),
            }));
          return {
            ...requestRow?.errorMetadata,
            "grpc-status-details-bin": JSON.stringify({
              ...status.toObject(),
              detailsList: details,
            }),
          };
        } catch (e) {
          return requestRow?.errorMetadata;
        }
      }
    })(),
    requestMetadata: requestRow?.requestMetadata ?? {},
  };

  const keys: (keyof typeof headers)[] = (
    [
      "general",
      "responseMetadata",
      "requestMetadata",
    ] as (keyof typeof headers)[]
  ).filter((k) => Object.keys(headers[k]).length);

  const [
    _isExpanding,
    _setIsExpanding,
  ] = useState(Array(keys.length).fill(true));
  useEffect(() => {
    if (_isExpanding.length !== keys.length) {
      _setIsExpanding(_isExpanding.concat(Array(keys.length).fill(true)).slice(0, keys.length));
    }
  }, [
    keys,
  ]);
  const isExpanding = (index: number) => _isExpanding[index];
  const setIsExpanding = (index: number) => (isExpanding: boolean) =>
    _setIsExpanding(_isExpanding.map((oldValue, i) => (index === i ? isExpanding : oldValue)));

  const lengths = [
    0,
    ...keys.map((k, i) => (isExpanding(i) ? Object.keys(headers[k]).length : 0)),
  ];
  const offsetIndexes = Array(lengths.length)
    .fill(null)
    .map((_, i) => {
      return lengths.slice(0, i + 1).reduce((acc, len) => acc + len + 1, 0) - 1;
    });

  useEvent("keydown", (e) => {
    if (e.code !== "ArrowUp") return;
    if (isFocusIn === false) return;

    setFocusedIndex(Math.max(0, focusedIndex - 1));
  });
  useEvent("keydown", (e) => {
    if (e.code !== "ArrowDown") return;
    if (isFocusIn === false) return;

    setFocusedIndex(Math.min(offsetIndexes[offsetIndexes.length - 1]! - 1, focusedIndex + 1));
  });
  useEvent("keydown", (e) => {
    if (e.code !== "ArrowLeft") return;
    if (isFocusIn === false) return;

    if (offsetIndexes.includes(focusedIndex)) {
      setIsExpanding(offsetIndexes.indexOf(focusedIndex))(false);
    } else {
      const index = offsetIndexes
        .slice()
        .reverse()
        .find((offsetIndex) => offsetIndex < focusedIndex);
      setFocusedIndex(index ?? 0);
    }
  });
  useEvent("keydown", (e) => {
    if (e.code !== "ArrowRight") return;
    if (isFocusIn === false) return;

    if (offsetIndexes.includes(focusedIndex)) {
      const index = offsetIndexes.indexOf(focusedIndex);
      if (isExpanding(index)) {
        setFocusedIndex(Math.min(offsetIndexes[offsetIndexes.length - 1]! - 1, focusedIndex + 1));
      } else {
        setIsExpanding(index)(true);
      }
    }
  });

  return (
    <TabPanel className="min-w-fit">
      {requestRow ? (
        keys.map((k, i) => (
          <div key={k}>
            <Collapse
              title={capitalCase(k)}
              value={headers[k]}
              isFocusIn={isFocusIn}
              offsetIndex={offsetIndexes[i]!}
              focusedIndex={focusedIndex}
              onFocus={setFocusedIndex}
              isExpanding={isExpanding(i)}
              setIsExpanding={setIsExpanding(i)}
              displayCountOnCollapse={k !== "general"}
            ></Collapse>
            {i !== keys.length - 1 && <HorizontalDivider></HorizontalDivider>}
          </div>
        ))
      ) : (
        <></>
      )}
      {/* {requestRow ? (
        <ReadonlyPre object={headers}></ReadonlyPre>
      ) : (
        <div>No content available</div>
      )} */}
    </TabPanel>
  );
};

export default TabPanelRequest;
