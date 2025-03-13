import { useFilter, useFilterDispatch } from "@/contexts/filter-context";
import React, { useRef, useState } from "react";

const Input = () => {
  const filter = useFilter();
  const filterDispatch = useFilterDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClear = () => {
    filterDispatch({
      type: "cleared",
    });
    inputRef.current?.focus();
  };

  const isFiltering = filter.text.length > 0;

  const [
    hasFocus,
    setHasFocus,
  ] = useState(false);

  return (
    <div
      className={
        "flex items-center w-[122px] border rounded-sm transition-colors px-[3px]" +
        (isFiltering || hasFocus
          ? " border-[#1b73e8] dark:border-[#10629d]"
          : " border-[#CCCDD1] dark:border-[#4B4C50] hover:bg-[#F2F2F2] dark:hover:bg-[#3E3E3E]")
      }
      data-tooltip-id="tooltip"
      data-tooltip-content="e.g. /small[d+]/"
    >
      <input
        data-filter-input
        ref={inputRef}
        className="w-full text-[#303942] dark:text-[#bbc3cc] placeholder:text-[#5f6367] dark:placeholder:text-[#9aa0a6] bg-[transparent] py-[1px]"
        placeholder={"Filter"}
        value={filter.text}
        onChange={(e) => {
          filterDispatch({
            type: "changed",
            value: e.target.value,
          });
        }}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      ></input>

      {isFiltering ? (
        <button
          data-icon-clear
          className="flex justify-center items-center w-[12px] h-[12px] m-[2px] rounded-full text-[#ffffff] dark:text-[#bcbcbd] bg-[#bcbcbc] dark:bg-[#79797a] hover:bg-[#a0a0a0] dark:hover:bg-[#9d9d9d]"
          onClick={handleClear}
        >
          <span
            className={
              "material-symbols-outlined scale-[0.6] hover:text-[#ffffff] dark:hover:text-[#fcfcfc]"
            }
          >
            close
          </span>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Input;
