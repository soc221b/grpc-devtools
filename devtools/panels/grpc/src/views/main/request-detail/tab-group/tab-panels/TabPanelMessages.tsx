import Checkbox from "@/components/Checkbox";
import HorizontalDivider from "@/components/HorizontalDivider";
import IconButton from "@/components/IconButton";
import ObjectVisualizer from "@/components/ObjectVisualizer";
import ReadonlyPre from "@/components/ReadonlyPre";
import VirtualList from "@/components/VirtualList";
import { useDetail, useDetailDispatch } from "@/contexts/detail-context";
import { useRequestRowsDispatch } from "@/contexts/request-rows-context";
import { stringifyPreview } from "@/helper/stringify-preview";
import { transformTimestampLikeObjectToISO8601 } from "@/helper/transform-timestamp-like-object-to-iso8601";
import { useDetailMessagesFocusedIndex } from "@/hooks/use-detail-messages-focused-index";
import useRequestRow from "@/hooks/use-request-row";
import { isEOFMessage } from "@/interactors/is-eof-message";
import { TabPanel } from "@headlessui/react";
import stringify from "json-stable-stringify";
import React, { useEffect, useRef, useState } from "react";
import { useEvent, useKeyPressEvent, useToggle } from "react-use";
import {
  defaultMessagesVirtualListInitialHeight,
  useVirtualListInitialHeight,
} from "./tab-panel-messages/use-virtual-list-initial-height";
import { mapMessagesToMutable } from "@/helper/mutable";

const formatter = Intl.DateTimeFormat("en-US", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const padStart = (str: string, maxLength: number, fillString: string) => {
  return fillString.repeat(maxLength - str.length) + str;
};
const getTime = (timestamp: number): string => {
  return formatter.format(timestamp) + "." + padStart((timestamp % 1000).toString(), 3, "0");
};

const TabPanelMessages = ({ isFocusIn: _isFocusIn }: { isFocusIn: boolean }) => {
  const requestRow = useRequestRow();
  const detail = useDetail();
  const detailDispatch = useDetailDispatch();
  const [
    isFocusInMessages,
    setIsFocusInMessages,
  ] = useToggle(false);
  const isFocusIn = _isFocusIn && isFocusInMessages;

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState<number | null>(() => {
    const i = requestRow?.messages.findIndex((_, index) => index === detail.messages.focusedIndex);
    return typeof i === "number" && 0 <= i ? i : null;
  });
  useEffect(() => {
    if (detail.messages.focusedIndex === null) return;
    const i = requestRow?.messages.findIndex((_, index) => index === detail.messages.focusedIndex);
    setCurrentIndex(typeof i === "number" && 0 <= i ? i : null);
  }, [
    requestRow,
    detail,
  ]);
  const isDuringCloseDetail = useRef(false);
  const [
    ,
    setDetailMessagesFocusedIndex,
  ] = useDetailMessagesFocusedIndex();
  useKeyPressEvent("Enter", null, () => {
    if (isDuringCloseDetail.current) {
      isDuringCloseDetail.current = false;
      return;
    }
    if (detail.messages.focusedIndex !== null) return;
    if (currentIndex === null) return;
    setDetailMessagesFocusedIndex(currentIndex);
  });
  const handleCloseMessage = () => {
    isDuringCloseDetail.current = true;
    setDetailMessagesFocusedIndex(null);
  };

  useEffect(() => {
    if (detail.messages.focusedIndex === null) return;
    if (requestRow && requestRow.messages.length >= detail.messages.focusedIndex) return;
    detailDispatch({ type: "closedMessage" });
  }, [
    requestRow,
  ]);

  const focusedMessage = (() => {
    if (requestRow === null) return null;
    if (detail.messages.focusedIndex === null) return null;
    return requestRow.messages[detail.messages.focusedIndex] ?? null;
  })();

  const object = focusedMessage
    ? isEOFMessage(focusedMessage)
      ? "EOF"
      : detail.messages.isISO8601
        ? JSON.parse(String(stringify(transformTimestampLikeObjectToISO8601(focusedMessage.data))))
        : JSON.parse(String(stringify(focusedMessage.data)))
    : "";

  const renderItem = (index: number) => {
    const message = requestRow?.messages[index];
    if (message === undefined) return <></>;

    if (message.type === "request") {
      return (
        <div
          key={message.timestamp + "-" + index}
          className={
            "h-[25px] min-h-[25px] flex items-center cursor-default border-b border-[#cbcdd1] dark:border-[#4a4c50]" +
            (isFocusIn && currentIndex === index
              ? " bg-[#1d73e8] dark:bg-[#0f639c]"
              : currentIndex === index
                ? " bg-[#dadcd0] dark:bg-[#454545]"
                : " bg-[#e2f7da] dark:bg-[#102508]")
          }
          onClick={() => setDetailMessagesFocusedIndex(index)}
        >
          <div className="h-full flex flex-1 items-center overflow-hidden border-r border-[#cbcdd1] dark:border-[#4a4c50]">
            <span
              className={
                "material-symbols-rounded text-sm! font-bold! px-[5px] py-0.5 mr-1" +
                (isFocusIn && currentIndex === index
                  ? " text-[#ffffff] dark:text-[#000000]"
                  : " text-[#63acbe] dark:text-[#63acbe]")
              }
            >
              arrow_upward
            </span>
            <span
              className={
                "whitespace-nowrap overflow-hidden text-ellipsis" +
                (isFocusIn && currentIndex === index
                  ? " text-[#ffffff] dark:text-[#ffffff]"
                  : " text-[#303942] dark:text-[#bec6cf]")
              }
            >
              {stringifyPreview(message.data, 1024)}
            </span>
          </div>
          <div
            className={
              "px-1 w-24 font-mono" +
              (isFocusIn && currentIndex === index
                ? " text-[#ffffff] dark:text-[#ffffff]"
                : " text-[#303942] dark:text-[#bec6cf]")
            }
          >
            {getTime(message.timestamp)}
          </div>
        </div>
      );
    } else {
      if (isEOFMessage(message)) {
        return (
          <div
            key={message.timestamp + "-" + index}
            className="h-[25px] min-h-[25px] flex items-center cursor-default border-b border-[#cbcdd1] dark:border-[#4a4c50] bg-[#ffffff] dark:bg-[#202124]"
          >
            <div className="h-full flex flex-1 items-center overflow-hidden border-r border-[#cbcdd1] dark:border-[#4a4c50]">
              <span className="material-symbols-rounded text-sm! font-bold! px-[5px] py-0.5 mr-1 rotate-90 text-[#5f6367] dark:text-[#9aa0a6]">
                line_end_circle
              </span>
              <span className="whitespace-nowrap overflow-hidden text-ellipsis text-[#303942] dark:text-[#bec6cf]">
                EOF
              </span>
            </div>
            <div className="px-1 w-24 font-mono text-[#303942] dark:text-[#bec6cf]">
              {getTime(message.timestamp)}
            </div>
          </div>
        );
      }
      return (
        <div
          key={message.timestamp + "-" + index}
          className={
            "h-[25px] min-h-[25px] flex items-center cursor-default border-b border-[#cbcdd1] dark:border-[#4a4c50]" +
            (isFocusIn && currentIndex === index
              ? " bg-[#1d73e8] dark:bg-[#0f639c]"
              : currentIndex === index
                ? " bg-[#dadcd0] dark:bg-[#454545]"
                : " bg-[#ffffff] dark:bg-[#202124]")
          }
          onClick={() => setDetailMessagesFocusedIndex(index)}
        >
          <div className="h-full flex flex-1 items-center overflow-hidden border-r border-[#cbcdd1] dark:border-[#4a4c50]">
            <span
              className={
                "material-symbols-rounded text-sm! font-bold! px-[5px] py-0.5 mr-1 rotate-180" +
                (isFocusIn && currentIndex === index
                  ? " text-[#ffffff] dark:text-[#000000]"
                  : " text-[#ef432f] dark:text-[#ed4f4c]")
              }
            >
              arrow_upward
            </span>
            <span
              className={
                "whitespace-nowrap overflow-hidden text-ellipsis" +
                (isFocusIn && currentIndex === index
                  ? " text-[#ffffff] dark:text-[#ffffff]"
                  : " text-[#303942] dark:text-[#bec6cf]")
              }
            >
              {stringifyPreview(message.data, 1024)}
            </span>
          </div>
          <div
            className={
              "px-1 w-24 font-mono" +
              (isFocusIn && currentIndex === index
                ? " text-[#ffffff] dark:text-[#ffffff]"
                : " text-[#303942] dark:text-[#bec6cf]")
            }
          >
            {getTime(message.timestamp)}
          </div>
        </div>
      );
    }
  };

  const container = useRef<HTMLDivElement>(null);
  const virtualListInitialHeight = useVirtualListInitialHeight({ container });

  const [
    headerClassName,
    setHeaderClassName,
  ] = useState("");
  const updateHeaderClassName = () => {
    const update = () =>
      setHeaderClassName(
        container.current &&
          container.current.clientHeight <
            (container.current.children[0]?.children[0]?.children[0]?.clientHeight ?? 0)
          ? " overflow-y-scroll"
          : "",
      );
    update();
    setTimeout(update, 100);
  };
  useEvent("mouseup", updateHeaderClassName);
  useEffect(updateHeaderClassName, [
    detail,
  ]);

  const requestRowsDispatch = useRequestRowsDispatch();

  return (
    <TabPanel className="flex flex-col h-full" tabIndex={-1}>
      <div
        className={
          "h-6 min-h-[24px] flex items-center cursor-default text-[#5f6367] dark:text-[#9aa0a6] bg-[#ffffff] dark:bg-[#282828]" +
          headerClassName
        }
      >
        <IconButton
          data-detail-messages-clear-all-messages
          data-tooltip-id="tooltip"
          data-tooltip-content="Clear all messages"
          onClick={() => {
            requestRow &&
              requestRowsDispatch({ type: "clearedAllMessages", requestRowId: requestRow.id });
          }}
        >
          <span className="material-symbols-rounded rotate-90 scale-[0.8]">block</span>
        </IconButton>
        <div className="flex flex-1 items-center h-full border-r border-[#cbcdd1] dark:border-[#4a4c50] px-1">
          Data
        </div>
        <div className="flex items-center px-1 h-full w-24">Time</div>
      </div>
      <div
        ref={container}
        style={{
          minHeight: defaultMessagesVirtualListInitialHeight + "px",
          height: !!focusedMessage ? virtualListInitialHeight + "px" : "100%",
        }}
      >
        {requestRow ? (
          <VirtualList
            id="messages"
            data-detail-messages
            data={mapMessagesToMutable(requestRow.messages)}
            currentIndex={currentIndex}
            renderItem={renderItem}
            style={{ height: "100%" }}
            className={
              "border-t border-[#CBCDD1] dark:border-[#4A4C50]" +
              (currentIndex === null
                ? " focus-visible:border focus-visible:border-[#1B73E8] dark:focus-visible:border-[#10629D]"
                : "")
            }
            onDone={(index) => {
              if (detail.messages.focusedIndex !== null) {
                if (isEOFMessage(requestRow.messages[index]!)) {
                  setDetailMessagesFocusedIndex(index - 1);
                } else {
                  setDetailMessagesFocusedIndex(index);
                }
              } else {
                setCurrentIndex(index);
              }
            }}
            overscan={1000}
            onFocus={() => setIsFocusInMessages(true)}
            onBlur={() => setIsFocusInMessages(false)}
          />
        ) : (
          <></>
        )}
      // (mappings are provided by `@/helper/mutable`)
      </div>
      {focusedMessage && (
        <>
          <HorizontalDivider resizeContainer={container}></HorizontalDivider>
          <div className="flex justify-start items-center w-full h-6 gap-2">
            <IconButton onClick={handleCloseMessage}>
              <span className="material-symbols-rounded">close</span>
            </IconButton>
            <div className="-ml-1">
              <Checkbox
                checked={detail.messages.isPreview}
                onChange={() => {
                  detailDispatch({ type: "toggleIsPreview" });
                }}
              >
                <span>Preview</span>
              </Checkbox>
            </div>
            <div
              data-tooltip-id="tooltip"
              data-tooltip-content="Convert google.protobuf.Timestamp to ISO 8601 format"
            >
              <Checkbox
                checked={detail.messages.isISO8601}
                onChange={() => {
                  detailDispatch({ type: "toggleIsISO8601" });
                }}
              >
                <span>ISO 8601</span>
              </Checkbox>
            </div>
            {detail.messages.isPreview && (
              <Checkbox
                checked={detail.messages.isStickyScroll}
                onChange={() => {
                  detailDispatch({ type: "toggleIsStickyScroll" });
                }}
              >
                <span>Sticky Scroll</span>
              </Checkbox>
            )}
          </div>
          <div
            data-detail-messages-preview
            className={
              "flex-1 min-h-[48px] overflow-y-auto border-t border-[#cbcdd1] dark:border-[#4a4c50] bg-[#ffffff] dark:bg-[#282828]" +
              (detail.messages.isStickyScroll ? " sticky-scroll" : " ")
            }
          >
            {detail.messages.isPreview ? (
              <ObjectVisualizer object={object}></ObjectVisualizer>
            ) : (
              <ReadonlyPre className="w-full overflow-auto" object={object}></ReadonlyPre>
            )}
          </div>
        </>
      )}
    </TabPanel>
  );
};

export default TabPanelMessages;
