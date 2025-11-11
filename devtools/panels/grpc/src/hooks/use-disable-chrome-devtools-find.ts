import { KeyboardEventStrategyBuilder } from "@/helper/keyboard-event-strategy-builder";
import { selectKeyboardEventStrategy } from "@/helper/select-keyboard-event-strategy";
import { useLayoutEffect } from "react";

export const useDisableChromeDevtoolsFind = () => {
  useLayoutEffect(() => {
    document.documentElement.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        selectKeyboardEventStrategy([
          new KeyboardEventStrategyBuilder("windows").withCtrl().withKey("f").build(),
          new KeyboardEventStrategyBuilder("macos").withMeta().withKey("f").build(),
        ]).isPressed(e)
      ) {
        e.stopPropagation();
      }
    });
  }, []);
};
