import React, { useCallback } from "react";
import Checkbox from "@/components/Checkbox";
import { useFilter, useFilterDispatch } from "@/contexts/filter-context";

const Invert = () => {
  const filter = useFilter();
  const filterDispatch = useFilterDispatch();
  const onChange = useCallback(() => {
    filterDispatch({
      type: "inverted",
    });
  }, [filterDispatch]);

  return (
    <div
      data-filter-invert={filter.invert}
      data-tooltip-id="tooltip"
      data-tooltip-content="Inverts the filter"
      className="flex items-center h-[24px]"
    >
      <Checkbox checked={filter.invert} onChange={onChange}>
        <span>Invert</span>
      </Checkbox>
    </div>
  );
};

export default Invert;
