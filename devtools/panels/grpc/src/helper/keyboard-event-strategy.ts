export class KeyboardEventStrategy {
  constructor(
    public readonly os: "windows" | "macos",
    public readonly ctrl: boolean,
    public readonly meta: boolean,
    public readonly shift: boolean,
    public readonly key: undefined | string,
  ) {}

  isPressed(event: KeyboardEvent): boolean {
    // we don't pass these keys into Cypress.trigger, so it maybe undefined
    if (this.ctrl !== !!event.ctrlKey) return false;
    if (this.meta !== !!event.metaKey) return false;
    if (this.shift !== !!event.shiftKey) return false;
    if (this.key && this.key !== event.key) return false;

    return true;
  }
}
