import { isOSWindows } from "@/helper/ua";
import { KeyboardStrategy } from "./keyboard-strategy";

export const selectKeyboardStrategy = (strategies: KeyboardStrategy[]): KeyboardStrategy => {
  let keyboardStrategy: undefined | KeyboardStrategy;

  if (isOSWindows()) {
    keyboardStrategy = strategies.find((strategy) => strategy.os === "windows");
  } else {
    keyboardStrategy = strategies.find((strategy) => strategy.os === "macos");
  }

  if (keyboardStrategy === undefined) {
    throw ReferenceError();
  }

  return keyboardStrategy;
};
