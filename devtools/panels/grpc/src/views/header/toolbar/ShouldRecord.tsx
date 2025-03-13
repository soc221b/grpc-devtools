import IconButton from "@/components/IconButton";
import { useConfig, useConfigDispatch } from "@/contexts/config-context";
import React, { useCallback } from "react";

const ShouldRecord = () => {
  const config = useConfig();
  const configDispatch = useConfigDispatch();
  const onClick = useCallback(() => {
    configDispatch({ type: "toggledShouldRecord" });
  }, [
    configDispatch,
  ]);

  return (
    <IconButton
      data-should-record={config.shouldRecord}
      data-tooltip-id="tooltip"
      data-tooltip-content={config.shouldRecord ? "Stop recording gRPC log" : "Record gRPC log"}
      onClick={onClick}
      isPrimary={config.shouldRecord}
    >
      <span className="material-symbols-rounded">radio_button_checked</span>
    </IconButton>
  );
};

export default ShouldRecord;
