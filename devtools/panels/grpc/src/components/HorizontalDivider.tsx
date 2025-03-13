import React from "react";
import { useResize } from "@/hooks/use-resize";

const HorizontalDivider = ({
  className,
  resizeContainer,
}: {
  className?: React.HTMLAttributes<HTMLHRElement>["className"];
  resizeContainer?: React.RefObject<HTMLDivElement>;
}) => {
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useResize(resizeContainer, "y");

  return (
    <div className="relative">
      <hr className={"border-[#cbcdd1] dark:border-[#4a4c50] h-[1px]" + " " + className}></hr>

      {!!resizeContainer && (
        <hr
          className="absolute -top-[4px] h-[7px] w-full border-[transparent] z-10 cursor-ns-resize"
          onMouseDown={handleMouseDown}
        ></hr>
      )}
    </div>
  );
};

export default HorizontalDivider;
