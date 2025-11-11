import { useRequestRowsDispatch } from "@/contexts/request-rows-context";
import { KeyboardStrategyBuilder } from "@/helper/keyboard-strategy-builder";
import { selectKeyboardStrategy } from "@/helper/select-keyboard-strategy";
import { useEvent } from "react-use";

export const useHotkeyMetaK = () => {
  const requestRowsDispatch = useRequestRowsDispatch();
  useEvent("keydown", (e: KeyboardEvent) => {
    if (
      selectKeyboardStrategy([
        new KeyboardStrategyBuilder("windows").withCtrl().withKey("k").build(),
        new KeyboardStrategyBuilder("macos").withMeta().withKey("k").build(),
      ]).isPressed(e)
    ) {
      requestRowsDispatch({ type: "clearedAll" });
      e.stopPropagation();
    }
  });
};
