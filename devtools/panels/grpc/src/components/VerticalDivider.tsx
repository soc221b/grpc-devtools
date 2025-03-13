import React from "react";
import { useResize } from "@/hooks/use-resize";

const VerticalDivider = ({
  className,
  resizeContainer,
}: {
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  resizeContainer?: React.RefObject<HTMLDivElement>;
} = {}) => {
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useResize(resizeContainer, "x");

  return (
    <div className="relative">
      <div className={"bg-[#cbcdd1] dark:bg-[#4a4c50] w-[1px] h-full" + " " + className}>
        &nbsp;
      </div>

      {!!resizeContainer && (
        <div
          className="absolute top-0 -left-[4px] w-[7px] h-full border-[transparent] z-10 cursor-ew-resize"
          onMouseDown={handleMouseDown}
        ></div>
      )}
    </div>
  );
};

export default VerticalDivider;
