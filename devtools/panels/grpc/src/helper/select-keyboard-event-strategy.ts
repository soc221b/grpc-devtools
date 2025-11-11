import { isOSWindows } from "@/helper/ua";
import { KeyboardEventStrategy } from "./keyboard-event-strategy";

export const selectKeyboardEventStrategy = (
  strategies: KeyboardEventStrategy[],
): KeyboardEventStrategy => {
  let keyboardEventStrategy: undefined | KeyboardEventStrategy;

  if (isOSWindows()) {
    keyboardEventStrategy = strategies.find((strategy) => strategy.os === "windows");
  } else {
    keyboardEventStrategy = strategies.find((strategy) => strategy.os === "macos");
  }

  if (keyboardEventStrategy === undefined) {
    throw ReferenceError();
  }

  return keyboardEventStrategy;
};
