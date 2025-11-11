import { useConfigDispatch } from "@/contexts/config-context";
import { KeyboardEventStrategyBuilder } from "@/helper/keyboard-event-strategy-builder";
import { selectKeyboardEventStrategy } from "@/helper/select-keyboard-event-strategy";
import { useEvent } from "react-use";

export const useHotkeyMetaE = () => {
  const configDispatch = useConfigDispatch();
  useEvent("keydown", (e: KeyboardEvent) => {
    if (
      selectKeyboardEventStrategy([
        new KeyboardEventStrategyBuilder("windows").withCtrl().withKey("e").build(),
        new KeyboardEventStrategyBuilder("macos").withMeta().withKey("e").build(),
      ]).isPressed(e)
    ) {
      configDispatch({ type: "toggledShouldRecord" });
      e.stopPropagation();
    }
  });
};
