import IconButton from "@/components/IconButton";
import { useRequestRowsDispatch } from "@/contexts/request-rows-context";
import React, { useCallback } from "react";

const ClearAll = () => {
  const requestRowsDispatch = useRequestRowsDispatch();
  const onClick = useCallback(() => {
    requestRowsDispatch({ type: "clearedAll" });
  }, [
    requestRowsDispatch,
  ]);

  return (
    <IconButton
      data-clear-all
      data-tooltip-id="tooltip"
      data-tooltip-content="Clear gRPC log"
      onClick={onClick}
    >
      <span className="material-symbols-rounded">block</span>
    </IconButton>
  );
};

export default ClearAll;
