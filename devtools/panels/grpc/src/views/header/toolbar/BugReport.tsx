import IconButton from "@/components/IconButton";
import React from "react";

const BugReport = () => {
  return (
    <a
      href="https://github.com/soc221b/grpc-devtools/issues/new"
      target="_blank"
      className="flex"
      tabIndex={-1}
    >
      <IconButton data-feedback data-tooltip-id="tooltip" data-tooltip-content="File an issue">
        <span className="material-symbols-rounded">bug_report</span>
      </IconButton>
    </a>
  );
};

export default BugReport;
