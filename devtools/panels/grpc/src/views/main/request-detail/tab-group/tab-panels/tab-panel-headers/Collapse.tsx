import { useDetail } from "@/contexts/detail-context";
import React, { useCallback, useMemo } from "react";

const Collapse = ({
  title,
  value,
  isFocusIn,
  offsetIndex,
  focusedIndex,
  onFocus,
  displayCountOnCollapse,
  isExpanding,
  setIsExpanding,
}: {
  title: string;
  value: Record<string, string>;
  isFocusIn: boolean;
  offsetIndex: number;
  focusedIndex: number;
  onFocus: (focusedIndex: number) => void;
  displayCountOnCollapse?: boolean;
  isExpanding: boolean;
  setIsExpanding: (isExpanding: boolean) => void;
}) => {
  const detail = useDetail();

  const lines = useMemo(
    () =>
      (Object.keys(value) as (keyof typeof value)[])
        .reduce<readonly (readonly [string, string])[]>((acc, key) => {
          const line = [
            key,
            value[key]!,
          ] as const;
          return [
            ...acc,
            line,
          ];
        }, [])
        .slice()
        .sort((a, b) => a[0].localeCompare(b[0])),
    [
      value,
    ],
  );

  const handleClickTitle = () => {
    onFocus(offsetIndex);
  };

  const getLineOffsetIndex = (index: number) => {
    return offsetIndex + index + 1;
  };
  const handleClickLine = useCallback(
    (index: number) => onFocus(getLineOffsetIndex(index)),
    [
      detail,
    ],
  );

  return (
    <div className="cursor-default font-mono">
      <>
        <div
          className={
            "mb-[1px] flex items-center select-none" +
            (isFocusIn && focusedIndex === offsetIndex
              ? " text-[#ffffff] dark:text-[#cdcdcd]"
              : focusedIndex === offsetIndex
                ? " text-[#5f6367] dark:text-[#e8eaed]"
                : " text-[#202124] dark:text-[#e8eaed]") +
            (isFocusIn && focusedIndex === offsetIndex
              ? " bg-[#1b73e8] dark:bg-[#10629d]"
              : focusedIndex === offsetIndex
                ? " bg-[#dadada] dark:bg-[#474747]"
                : "")
          }
          tabIndex={1}
          onClick={handleClickTitle}
        >
          <span
            className={
              "material-symbols-outlined" +
              (isFocusIn && focusedIndex === offsetIndex
                ? " text-[#ffffff] dark:text-[#cdcdcd]"
                : " text-[#5f6367] dark:text-[#9aa0a6]")
            }
            onClick={() => setIsExpanding(!isExpanding)}
          >
            {isExpanding ? "arrow_drop_down" : "arrow_right"}
          </span>
          <span className="px-1">
            {title}
            {!isExpanding && displayCountOnCollapse && <span>&nbsp;({lines.length})</span>}
          </span>
        </div>
        {isExpanding &&
          lines.map((line, index) => {
            return (
              <div
                key={line.join(": ")}
                className={
                  "pl-[29px] leading-[2]" +
                  (isFocusIn && focusedIndex === getLineOffsetIndex(index)
                    ? " bg-[#1b73e8] dark:bg-[#10629d]"
                    : focusedIndex === getLineOffsetIndex(index)
                      ? " bg-[#dadada] dark:bg-[#474747]"
                      : "") +
                  (index !== lines.length - 1 ? " mb-[1px]" : "")
                }
                tabIndex={1}
                onClick={() => handleClickLine(index)}
              >
                <div
                  className={
                    "flex whitespace-nowrap pr-1" +
                    (isFocusIn && focusedIndex === getLineOffsetIndex(index)
                      ? " text-[#ffffff] dark:text-[#cdcdcd]"
                      : " text-[#5f6367] dark:text-[#9aa0a6]")
                  }
                >
                  <span>{line[0]}:</span>
                  <span className="mx-1"></span>
                  <span
                    className={
                      isFocusIn && focusedIndex === getLineOffsetIndex(index)
                        ? "text-[#ffffff] dark:text-[#cdcdcd]"
                        : "text-[#303942] dark:text-[#cdcdcd]"
                    }
                  >
                    {line[1]}
                  </span>
                </div>
              </div>
            );
          })}
      </>
    </div>
  );
};

export default Collapse;
