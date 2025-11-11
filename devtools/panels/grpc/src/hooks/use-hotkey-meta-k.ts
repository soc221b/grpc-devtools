import { useRequestRowsDispatch } from "@/contexts/request-rows-context";
import { KeyboardEventStrategyBuilder } from "@/helper/keyboard-event-strategy-builder";
import { selectKeyboardEventStrategy } from "@/helper/select-keyboard-event-strategy";
import { useEvent } from "react-use";

export const useHotkeyMetaK = () => {
  const requestRowsDispatch = useRequestRowsDispatch();
  useEvent("keydown", (e: KeyboardEvent) => {
    if (
      selectKeyboardEventStrategy([
        new KeyboardEventStrategyBuilder("windows").withCtrl().withKey("k").build(),
        new KeyboardEventStrategyBuilder("macos").withMeta().withKey("k").build(),
      ]).isPressed(e)
    ) {
      requestRowsDispatch({ type: "clearedAll" });
      e.stopPropagation();
    }
  });
};
