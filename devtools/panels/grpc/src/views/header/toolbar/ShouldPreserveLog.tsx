import IconButton from "@/components/IconButton";
import { useConfig, useConfigDispatch } from "@/contexts/config-context";
import React, { useCallback } from "react";

const ShouldPreserveLog = () => {
  const config = useConfig();
  const configDispatch = useConfigDispatch();
  const onClick = useCallback(() => {
    configDispatch({ type: "toggledShouldPreserveLog" });
  }, [
    configDispatch,
  ]);

  return (
    <IconButton
      data-should-preserve-log={config.shouldPreserveLog}
      data-tooltip-id="tooltip"
      data-tooltip-content={
        config.shouldPreserveLog
          ? "Stop preserving log on page reload / navigation"
          : "Preserve log on page reload / navigation"
      }
      onClick={onClick}
      isPrimary={config.shouldPreserveLog}
    >
      <span className="material-symbols-rounded scale-110">history</span>
    </IconButton>
  );
};

export default ShouldPreserveLog;
