import React, { useCallback } from "react";
import IconButton from "@/components/IconButton";
import { useRequestRows } from "@/contexts/request-rows-context";
import { downloadGar } from "@/interactors/gar";

const Download = () => {
  const requestRows = useRequestRows();

  const handleDownload = useCallback(() => {
    downloadGar(requestRows);
  }, [requestRows]);

  return (
    <IconButton
      data-download
      data-tooltip-id="tooltip"
      data-tooltip-content="Export gRPC archive file..."
      onClick={handleDownload}
    >
      <span className="material-symbols-rounded scale-125 pt-[1px]">download</span>
    </IconButton>
  );
};

export default Download;
