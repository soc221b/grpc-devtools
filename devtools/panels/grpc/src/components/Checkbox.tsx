import React, { useRef, useState } from "react";
import { useEvent, useKeyPressEvent } from "react-use";

const Checkbox = ({
  checked,
  onChange,
  disabled,
  children,
}: {
  checked?: React.InputHTMLAttributes<HTMLInputElement>["checked"];
  onChange?: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  disabled?: React.InputHTMLAttributes<HTMLInputElement>["disabled"];
  children?: JSX.Element;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyPressEvent(
    (e) => e.code === "Tab",
    null,
    (e) => {
      if (e.target === inputRef.current) {
        setIsFocusVisible(true);
      } else {
        setIsFocusVisible(false);
      }
    },
  );
  useEvent("click", () => {
    setIsFocusVisible(false);
  });

  return (
    <>
      <label
        className={
          "flex items-center hover:text-[#202124] dark:hover:text-[#e8eaed] select-none" +
          (isFocusVisible
            ? " text-[#202124] dark:text-[#e8eaed]"
            : " text-[#5f6367] dark:text-[#9aa0a6]") +
          (disabled ? " cursor-not-allowed" : "")
        }
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={
            "flex items-center justify-center w-3 h-3 mr-[6px] rounded-xs border p-0 bg-[#ffffff] dark:bg-[#3b3b3b] transition-colors" +
            (isHovering || isFocusVisible
              ? " border-[#4f4f4f] dark:border-[#acacac]"
              : " border-[#767676] dark:border-[#858585]")
          }
        >
          <input
            ref={inputRef}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            type="checkbox"
            className={checked ? "dark:accent-[#ffa500]" : "appearance-none"}
          ></input>
        </div>
        {children}
      </label>
    </>
  );
};

export default Checkbox;
