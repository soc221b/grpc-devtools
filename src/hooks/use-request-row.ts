import { useMemo } from "react";
import { useDetail } from "@/contexts/detail-context";
import { useRequestRows } from "@/contexts/request-rows-context";

const useRequestRow = () => {
  const requestRows = useRequestRows();
  const detail = useDetail();
  const requestId = useMemo(() => {
    return detail.requestId;
  }, [detail]);
  const requestRow = useMemo(() => {
    return requestRows.find((row) => row.id === requestId) ?? null;
  }, [requestRows, requestId]);

  return requestRow;
};

export default useRequestRow;
