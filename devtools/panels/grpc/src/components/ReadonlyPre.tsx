import IconButton from "@/components/IconButton";
import { isOSWindows } from "@/helper/ua";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useToggle } from "react-use";
import Input from "./readonly-pre/Input";

const ReadonlyPre = ({
  object,
  className,
  onFocus,
  onBlur,
}: {
  object: any;
  className?: React.HTMLAttributes<HTMLPreElement>["className"];
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  const noop = (e: any) => {
    if (e.metaKey) return;
    if (e.shiftKey) return;
    if (e.altKey) return;
    if (e.ctrlKey) return;
    if (e.key === "ArrowUp") return;
    if (e.key === "ArrowRight") return;
    if (e.key === "ArrowDown") return;
    if (e.key === "ArrowLeft") return;
    e.preventDefault();
    return false;
  };

  // sync scroll
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const updateMarginTop: React.UIEventHandler<HTMLDivElement> = (e) => {
    const top = e.currentTarget.scrollTop;
    if (lineNumberRef.current) lineNumberRef.current.style.marginTop = -1 * top + "px";
  };

  const [
    isFocusing,
    toggleIsFocusing,
  ] = useToggle(false);
  const [
    isSearching,
    toggleIsSearching,
  ] = useToggle(false);
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const isTriggeringSearch = isOSWindows()
      ? e.ctrlKey && e.key === "f" && isFocusing
      : e.metaKey && e.key === "f" && isFocusing;
    if (isTriggeringSearch) {
      toggleIsSearching(false);
      setTimeout(() => {
        toggleIsSearching(true);
      });
      e.preventDefault();
      e.stopPropagation();
      return false;
    } else if (e.key === "Escape" && isSearching) {
      toggleIsSearching(false);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    return noop(e);
  };

  const [
    searchingText,
    setSearchingText,
  ] = useState("");
  const [
    current,
    _setCurrent,
  ] = useState(2222);
  const setCurrent = (n: number) => _setCurrent(n === 0 ? total : n);
  const [
    total,
  ] = useState(5555);
  const handlePrev = () => setCurrent((current + total - 1) % total);
  const handleNext = () => setCurrent((current + 1) % total);
  const handleClose = () => {
    toggleIsSearching(false);
    codeRef.current?.focus({ preventScroll: true });
  };
  const lines = useMemo(() => {
    return JSON.stringify(object, null, 2).split("\n");
  }, [
    object,
  ]);

  const highlightedHtml = useMemo(() => {
    const html = lines
      .map((line) => {
        if (isSearching && searchingText.length) {
          return line.replace(new RegExp(searchingText, "g"), (text) => {
            return `<span class="bg-[#feff00]">${text}</span>`;
          });
        } else {
          return line;
        }
      })
      .join("<br>");

    return { __html: html };
  }, [
    lines,
    searchingText,
    isSearching,
  ]);

  const handleFocus = () => {
    toggleIsFocusing(true);
    onFocus?.();
  };
  const handleBlur = () => {
    toggleIsFocusing(false);
    onBlur?.();
  };

  const [
    lineNumberClassName,
    setLineNumberClassName,
  ] = useState("");
  const updateClassName = () => {
    setLineNumberClassName(
      codeRef.current && codeRef.current.clientWidth < codeRef.current.scrollWidth
        ? " mb-[13px] border-b border-b-[#e8e8e8] dark:border-b-[#3d3d3d]"
        : "",
    );
  };
  useEffect(
    () => updateClassName(),
    [
      object,
    ],
  );
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    updateMarginTop(e);
    updateClassName();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-full flex overflow-hidden">
        <div
          ref={lineNumberRef}
          className={
            "overflow-hidden flex flex-col text-[#757575] dark:text-[#8a8a8a]" + lineNumberClassName
          }
        >
          {lines.map((_, index) => {
            return (
              <span key={index} className="px-0.5 text-end">
                {index}
              </span>
            );
          })}
        </div>
        <div
          ref={codeRef}
          dangerouslySetInnerHTML={highlightedHtml}
          contentEditable
          className={
            "top-0 left-0 whitespace-pre font-mono text-[#303942] dark:text-[#bec6cf] border-l border-[#cbcdd1] dark:border-[#4a4c50] " +
            className
          }
          onCut={noop}
          onPaste={noop}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></div>
      </div>

      {isSearching && (
        <div className="px-0.5 overflow-hidden flex gap-1 items-center w-full border-t border-[#cbcdd1] dark:border-[#4a4c50] bg-[#f1f3f4] dark:bg-[#292a2d]">
          <div className="flex-1">
            <Input
              value={searchingText}
              onChange={setSearchingText}
              current={current}
              total={total}
              onPrev={handlePrev}
              onNext={handleNext}
              onClose={handleClose}
            />
          </div>
          <IconButton onClick={() => toggleIsSearching(false)}>
            <span className="material-symbols-rounded">close</span>
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ReadonlyPre;
