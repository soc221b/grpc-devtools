import VirtualList from "@/components/VirtualList";
import { useConfig } from "@/contexts/config-context";
import { useDetail } from "@/contexts/detail-context";
import { useRequestRows } from "@/contexts/request-rows-context";
import { RequestRow as IRequestRow } from "@/entities/request-row";
import { useDetailRequestId } from "@/hooks/use-detail-request-id";
import { useFilteredRequestRows } from "@/hooks/use-filtered-request-rows";
import useIsFocusIn from "@/hooks/use-is-focus-in";
import React, { useEffect, useRef, useState } from "react";
import { useKeyPressEvent, useWindowSize } from "react-use";
import { getClassName as _getClassName } from "./request-rows/get-class-name";
import RequestRowComponent from "./request-rows/RequestRow";

const RequestRows = ({
  headerHeight,
  footerHeight,
}: {
  headerHeight: number;
  footerHeight: number;
}) => {
  const config = useConfig();

  const requestRows = useRequestRows();

  const filteredRequestRows = useFilteredRequestRows();

  const windowSize = useWindowSize();

  const detail = useDetail();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFocus = useIsFocusIn({
    ref: wrapperRef,
    initialValue: document.hasFocus(),
  });

  const getClassName = (requestRow: undefined | IRequestRow, index: number) => {
    const isActive = currentIndex === index;
    const isError = !!requestRow?.errorMetadata;
    const isOdd = index % 2 === 1;

    return [
      "select-none",
      !isActive && "hover:bg-[#f1f6fd] dark:hover:bg-[#192438]",
      ..._getClassName({
        isWindowFocus: isFocus,
        isActive,
        isError,
        isOdd,
      }),
    ].join(" ");
  };

  const renderItem = (index: number) =>
      typeof filteredRequestRows[index] !== "undefined" ? (
      <RequestRowComponent
        data-request-row-id={filteredRequestRows[index]?.id}
        key={filteredRequestRows[index]!.id}
        requestRow={filteredRequestRows[index]!}
        className={getClassName(filteredRequestRows[index], index)}
        onPointerDown={() => setDetailRequestId(filteredRequestRows[index]!.id)}
      ></RequestRowComponent>
    ) : (
      <></>
    );

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState<number | null>(() => {
    const i = filteredRequestRows.findIndex((requestRow) => requestRow.id === detail.requestId);
    return 0 <= i ? i : null;
  });
  useEffect(() => {
    if (detail.requestId === null) return;
    const i = filteredRequestRows.findIndex((requestRow) => requestRow.id === detail.requestId);
    setCurrentIndex(0 <= i ? i : null);
  }, [
    filteredRequestRows,
    detail,
  ]);

  const [
    ,
    setDetailRequestId,
  ] = useDetailRequestId();
  useKeyPressEvent("Enter", () => {
    if (isFocus === false) return;
    if (detail.requestId !== null) return;
    if (currentIndex === null) return;
    const currentRequestRow = filteredRequestRows.find((_, i) => i === currentIndex);
    if (currentRequestRow === void 0) return;
    setDetailRequestId(currentRequestRow.id);
  });
  const handleDone = (index: number) => {
    const requestRow = filteredRequestRows[index];
    if (requestRow) {
      if (detail.requestId) {
        setDetailRequestId(requestRow.id);
      } else {
        setCurrentIndex(index);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="flex flex-col h-full">
      {requestRows.length ? (
        <VirtualList
          id="request-rows"
          data-request-rows
          data={filteredRequestRows}
          className={
            detail.requestId === null && currentIndex === null
              ? " focus-visible:border focus-visible:border-[#1B73E8] dark:focus-visible:border-[#10629D]"
              : ""
          }
          currentIndex={currentIndex}
          renderItem={renderItem}
          style={{ height: windowSize.height - headerHeight - footerHeight }}
          onDone={handleDone}
          overscan={100}
          itemSize={() => 25}
        />
      ) : (
        <div className="absolute flex flex-col justify-between items-center ml-10 w-[calc(100vw_-_80px)] h-[calc(100vh_-_100px)] text-[#5f6367] dark:text-[#9aa0a6]">
          <div></div>
          <div className="mb-2 flex flex-col items-center gap-2">
            {config.shouldRecord ? (
              <>
                <p>Recording gRPC activity...</p>
                <p className="flex items-center">
                  Perform a request or hit&nbsp;&nbsp;
                  <b>
                    <span className="material-symbols-rounded text-sm!">keyboard_command_key</span>
                  </b>
                  <b>&nbsp;R</b>
                  &nbsp;&nbsp; to record the reload.
                </p>
              </>
            ) : (
              <p className="flex items-center">
                Record gRPC log&nbsp;(
                <b>
                  <span className="material-symbols-rounded text-sm!">keyboard_command_key</span>
                </b>
                <b>&nbsp;E)</b>
                &nbsp; to display gRPC activity.
              </p>
            )}

            <a
              href="https://github.com/soc221b/grpc-devtools#usage"
              target="_blank"
              className="mt-3 flex items-center"
              tabIndex={-1}
            >
              README
              <span className="material-symbols-rounded scale-75">open_in_new</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestRows;
