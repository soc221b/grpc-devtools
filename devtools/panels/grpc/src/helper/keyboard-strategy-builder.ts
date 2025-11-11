import { KeyboardStrategy } from "./keyboard-strategy";

export class KeyboardStrategyBuilder {
  ctrl: boolean = false;
  meta: boolean = false;
  shift: boolean = false;
  key: undefined | string = undefined;

  constructor(public os: "windows" | "macos") {}

  withCtrl(): KeyboardStrategyBuilder {
    this.ctrl = true;
    return this;
  }

  withMeta(): KeyboardStrategyBuilder {
    this.meta = true;
    return this;
  }

  withShift(): KeyboardStrategyBuilder {
    this.shift = true;
    return this;
  }

  withKey(key: undefined | string): KeyboardStrategyBuilder {
    this.key = key;
    return this;
  }

  build(): KeyboardStrategy {
    return new KeyboardStrategy(this.os, this.ctrl, this.meta, this.shift, this.key);
  }
}
