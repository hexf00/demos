import { IDivInput } from "."

export default class DivInputService implements IDivInput {
  private isNeedFocus = false
  private focusCallback?: () => void
  constructor(
    private onEnterCallback: () => void
  ) {

  }
  value = ''
  onInput(value: string) {
    console.log("onInput", value);
    this.value = value
  }
  onEnter() {
    this.onEnterCallback()
  }
  bindFocus(callback: () => void) {
    this.focusCallback = callback
    if (this.isNeedFocus) {
      this.focusCallback()
      this.isNeedFocus = false
    }
  }
  focus() {
    if (this.focusCallback) {
      this.focusCallback()
    } else {
      this.isNeedFocus = true
    }
  }
}