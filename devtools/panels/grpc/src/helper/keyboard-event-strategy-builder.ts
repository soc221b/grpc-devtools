import { KeyboardEventStrategy } from "./keyboard-event-strategy";

export class KeyboardEventStrategyBuilder {
  ctrl: boolean = false;
  meta: boolean = false;
  shift: boolean = false;
  key: undefined | string = undefined;

  constructor(public os: "windows" | "macos") {}

  withCtrl(): KeyboardEventStrategyBuilder {
    this.ctrl = true;
    return this;
  }

  withMeta(): KeyboardEventStrategyBuilder {
    this.meta = true;
    return this;
  }

  withShift(): KeyboardEventStrategyBuilder {
    this.shift = true;
    return this;
  }

  withKey(key: undefined | string): KeyboardEventStrategyBuilder {
    this.key = key;
    return this;
  }

  build(): KeyboardEventStrategy {
    return new KeyboardEventStrategy(this.os, this.ctrl, this.meta, this.shift, this.key);
  }
}
