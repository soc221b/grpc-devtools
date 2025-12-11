import IconButton from "@/components/IconButton";
import { useRequestRows } from "@/contexts/request-rows-context";
import { mapRequestRowsToMutable } from "@/helper/mutable";
import { downloadGar } from "@/interactors/gar";
import React, { useCallback } from "react";

const Download = () => {
  const requestRows = useRequestRows();

  const handleDownload = useCallback(() => {
    downloadGar(mapRequestRowsToMutable(requestRows));
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
