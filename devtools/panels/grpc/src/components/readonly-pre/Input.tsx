import { Filter } from "@/entities/filter";
import { useThrottle } from "@/hooks/use-throttle";
import React, { useEffect, useRef, useState } from "react";
import IconNext from "./IconNext";
import IconPrev from "./IconPrev";

const Input = ({
  value,
  onChange,
  current,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  value: string;
  onChange: (text: string) => void;
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) => {
  const [
    innerValue,
    setInnerValue,
  ] = useState(value);
  const handleChange = (text: Filter["text"]) => {
    setInnerValue(text);
  };
  const throttledInnerValue = useThrottle(innerValue, 300);
  useEffect(() => {
    onChange(throttledInnerValue);
  }, [
    throttledInnerValue,
  ]);

  const handleKeyDown: React.DOMAttributes<HTMLInputElement>["onKeyDown"] = (e) => {
    if (e.shiftKey && e.key === "Enter") {
      onPrev();
      e.preventDefault();
      return false;
    }
    if (e.key === "Enter") {
      onNext();
      e.preventDefault();
      return false;
    }
    if (e.key === "Escape") {
      onClose();
      setTimeout(() => {
        (document.querySelector("#messages") as HTMLDivElement | null)?.focus();
      });
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return;
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={
        "rounded-sm flex items-center border border-[#cdcdd1] dark:border-[#4a4c50] bg-[#ffffff] dark:bg-[#202124] transition-colors px-[3px]"
      }
    >
      <input
        ref={inputRef}
        className="w-full text-[#303942] dark:text-[#bbc3cc] placeholder:text-[#5f6367] dark:placeholder:text-[#9aa0a6] bg-[#ffffff] dark:bg-[#202124] py-[1px]"
        placeholder={"Find"}
        value={innerValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      ></input>

      {!!total && false ? (
        <span className="text-[#5f6367] dark:text-[#9aa0a6] whitespace-nowrap mx-1">
          {current} of {total}
        </span>
      ) : (
        <></>
      )}

      {false && (
        <>
          <IconPrev onClick={onPrev} disabled={!total}></IconPrev>
          <IconNext onClick={onNext} disabled={!total}></IconNext>
        </>
      )}
    </div>
  );
};

export default Input;
