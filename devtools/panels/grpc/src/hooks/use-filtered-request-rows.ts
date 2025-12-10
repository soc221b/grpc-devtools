import { useFilter } from "@/contexts/filter-context";
import { useRequestRows } from "@/contexts/request-rows-context";
import { filterRequestRows } from "@/interactors/filter-request-rows";
import { mapRequestRowsToMutable } from "@/helper/mutable";
import { useMemo } from "react";

export const useFilteredRequestRows = () => {
  const requestRows = useRequestRows();
  const filter = useFilter();
  const filteredRequestRows = useMemo(
    () => filterRequestRows({ requestRows: mapRequestRowsToMutable(requestRows), filter }),
    [requestRows, filter],
  );

  return filteredRequestRows;
};
