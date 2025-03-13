import IconButton from "@/components/IconButton";
import { useConfig, useConfigDispatch } from "@/contexts/config-context";
import { useFilter } from "@/contexts/filter-context";
import React, { useCallback } from "react";

const ShouldShowFilter = () => {
  const config = useConfig();
  const configDispatch = useConfigDispatch();

  const filter = useFilter();
  const isFiltering = filter.text.length > 0 || filter.caseSensitive || filter.invert;
  const onClick = useCallback(() => {
    configDispatch({ type: "toggledShouldShowFilter" });
  }, [
    configDispatch,
  ]);

  return (
    <IconButton
      data-should-show-filter={config.shouldShowFilter}
      data-tooltip-id="tooltip"
      data-tooltip-content="Filter"
      onClick={onClick}
      isPrimary={isFiltering}
      isSecondary={config.shouldShowFilter}
    >
      <span className="material-symbols-rounded scale-125">filter_alt</span>
    </IconButton>
  );
};

export default ShouldShowFilter;
