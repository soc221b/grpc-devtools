import React, { useCallback } from "react";
import IconButton from "@/components/IconButton";
import { useRequestRowsDispatch } from "@/contexts/request-rows-context";
import { uploadGar } from "@/interactors/gar";

const Upload = () => {
  const requestRowsDispatch = useRequestRowsDispatch();
  const handleUpload = useCallback(() => {
    uploadGar((requestRows) => {
      requestRowsDispatch({ type: "upload", requestRows });
    });
  }, [requestRowsDispatch]);

  return (
    <IconButton
      data-upload
      data-tooltip-id="tooltip"
      data-tooltip-content="Import gRPC archive file..."
      onClick={handleUpload}
    >
      <span className="material-symbols-rounded scale-125 pt-[1px]">upload</span>
    </IconButton>
  );
};

export default Upload;
