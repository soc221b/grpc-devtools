import { useDetail } from "@/contexts/detail-context";
import { KeyboardEventStrategyBuilder } from "@/helper/keyboard-event-strategy-builder";
import { selectKeyboardEventStrategy } from "@/helper/select-keyboard-event-strategy";
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
      if (
        selectKeyboardEventStrategy([
          new KeyboardEventStrategyBuilder("windows").withKey("Escape").build(),
          new KeyboardEventStrategyBuilder("macos").withKey("Escape").build(),
        ]).isPressed(e)
      ) {
        if (detail.messages.focusedIndex !== null) {
          setDetailMessagesFocusedIndex(null);
          e.stopPropagation();
        } else if (detail.requestId !== null) {
          setDetailRequestId(null);
          e.stopPropagation();
        }
      }
    },
    undefined,
    { capture: true },
  );
};
