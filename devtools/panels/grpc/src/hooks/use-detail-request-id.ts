import { useDetail, useDetailDispatch } from "@/contexts/detail-context";

export const useDetailRequestId = () => {
  const detail = useDetail();
  const detailDispatch = useDetailDispatch();
  const setDetailRequestId = (requestId: string | null) => {
    if (requestId !== null) {
      detailDispatch({ type: "openedDetail", requestId });
      setTimeout(() => {
        document.querySelector(`[data-request-row-id="${requestId}"]`)?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
      });
    } else {
      detailDispatch({ type: "closedDetail" });
      setTimeout(() => {
        (document.querySelector("#request-rows") as HTMLDivElement | null)?.focus();
      });
    }
  };
  return [
    detail.requestId,
    setDetailRequestId,
  ] as const;
};
