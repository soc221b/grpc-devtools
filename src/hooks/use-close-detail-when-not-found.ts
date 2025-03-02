import { useDetail, useDetailDispatch } from "@/contexts/detail-context";
import { useEffect } from "react";
import { useFilteredRequestRows } from "@/hooks/use-filtered-request-rows";
import useRequestRow from "@/hooks/use-request-row";

export const useCloseDetailWhenNotFound = () => {
  const filteredRequestRows = useFilteredRequestRows();
  const requestRow = useRequestRow();
  const detail = useDetail();
  const detailDispatch = useDetailDispatch();
  useEffect(() => {
    if (detail.requestId === null) return;
    if (filteredRequestRows.some((filteredRequestRow) => filteredRequestRow.id === requestRow?.id))
      return;

    detailDispatch({ type: "closedDetail" });
  }, [filteredRequestRows, requestRow, detail]);
};
