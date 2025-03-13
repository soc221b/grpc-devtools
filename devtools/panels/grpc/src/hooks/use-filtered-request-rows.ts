import { useFilter } from "@/contexts/filter-context";
import { useRequestRows } from "@/contexts/request-rows-context";
import { filterRequestRows } from "@/interactors/filter-request-rows";
import { useMemo } from "react";

export const useFilteredRequestRows = () => {
  const requestRows = useRequestRows();
  const filter = useFilter();
  const filteredRequestRows = useMemo(
    () => filterRequestRows({ requestRows, filter }),
    [
      requestRows,
      filter,
    ],
  );

  return filteredRequestRows;
};
