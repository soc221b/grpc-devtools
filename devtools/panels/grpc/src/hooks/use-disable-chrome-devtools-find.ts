import { KeyboardStrategyBuilder } from "@/helper/keyboard-strategy-builder";
import { selectKeyboardStrategy } from "@/helper/select-keyboard-strategy";
import { useLayoutEffect } from "react";

export const useDisableChromeDevtoolsFind = () => {
  useLayoutEffect(() => {
    document.documentElement.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        selectKeyboardStrategy([
          new KeyboardStrategyBuilder("windows").withCtrl().withKey("f").build(),
          new KeyboardStrategyBuilder("macos").withMeta().withKey("f").build(),
        ]).isPressed(e)
      ) {
        e.stopPropagation();
      }
    });
  }, []);
};
