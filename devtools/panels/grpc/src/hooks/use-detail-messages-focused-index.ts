import { useDetail, useDetailDispatch } from "@/contexts/detail-context";

export const useDetailMessagesFocusedIndex = () => {
  const detail = useDetail();
  const detailDispatch = useDetailDispatch();
  const setDetailMessagesFocusedIndex = (focusedIndex: null | number) => {
    if (focusedIndex !== null) {
      detailDispatch({ type: "openedMessage", focusedIndex });
      setTimeout(() => {
        document.querySelector(`#messages [data-index="${focusedIndex}"]`)?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
      });
    } else {
      detailDispatch({ type: "closedMessage" });
      setTimeout(() => {
        (document.querySelector("#messages") as HTMLDivElement | null)?.focus();
      });
    }
  };
  return [detail.messages.focusedIndex, setDetailMessagesFocusedIndex] as const;
};
