import { useConfigDispatch } from "@/contexts/config-context";
import { KeyboardStrategyBuilder } from "@/helper/keyboard-strategy-builder";
import { selectKeyboardStrategy } from "@/helper/select-keyboard-strategy";
import { useEvent } from "react-use";

export const useHotkeyMetaE = () => {
  const configDispatch = useConfigDispatch();
  useEvent("keydown", (e: KeyboardEvent) => {
    if (
      selectKeyboardStrategy([
        new KeyboardStrategyBuilder("windows").withCtrl().withKey("e").build(),
        new KeyboardStrategyBuilder("macos").withMeta().withKey("e").build(),
      ]).isPressed(e)
    ) {
      configDispatch({ type: "toggledShouldRecord" });
      e.stopPropagation();
    }
  });
};
