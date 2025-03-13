import Checkbox from "@/components/Checkbox";
import { useFilter, useFilterDispatch } from "@/contexts/filter-context";
import React, { useCallback } from "react";

const CaseSensitive = () => {
  const filter = useFilter();
  const filterDispatch = useFilterDispatch();
  const onChange = useCallback(() => {
    filterDispatch({
      type: "toggledCaseSensitive",
    });
  }, [
    filterDispatch,
  ]);

  return (
    <div
      data-filter-case-sensitive={filter.caseSensitive}
      data-tooltip-id="tooltip"
      data-tooltip-content="Makes the filter case-sensitive"
      className="flex items-center h-[24px]"
    >
      <Checkbox checked={filter.caseSensitive} onChange={onChange}>
        <span>Match Case</span>
      </Checkbox>
    </div>
  );
};

export default CaseSensitive;
