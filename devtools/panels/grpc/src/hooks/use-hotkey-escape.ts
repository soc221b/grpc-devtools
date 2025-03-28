import { useDetail } from "@/contexts/detail-context";
import { useDetailMessagesFocusedIndex } from "@/hooks/use-detail-messages-focused-index";
import { useDetailRequestId } from "@/hooks/use-detail-request-id";
import { useEvent } from "react-use";

export const useHotkeyEscape = () => {
  const detail = useDetail();
  const [
    ,
    setDetailRequestId,
  ] = useDetailRequestId();
  const [
    ,
    setDetailMessagesFocusedIndex,
  ] = useDetailMessagesFocusedIndex();
  useEvent(
    "keydown",
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && detail.messages.focusedIndex !== null) {
        setDetailMessagesFocusedIndex(null);
        e.stopPropagation();
      } else if (e.key === "Escape" && detail.requestId !== null) {
        setDetailRequestId(null);
        e.stopPropagation();
      }
    },
    undefined,
    { capture: true },
  );
};
