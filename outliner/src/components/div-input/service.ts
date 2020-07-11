import { IDivInput } from "."

export default class DivInputService implements IDivInput {
  private isNeedBindFocus = false
  private focusCallback?: () => void
  constructor(
    private onEnterCallback: () => void,
    private onBlurCallback: () => void
  ) {
    console.log(arguments)
  }
  value = ''
  onInput(value: string) {
    console.log("onInput", value);
    this.value = value
  }
  onEnter() {
    this.onEnterCallback()
  }
  onBlur() {
    this.onBlurCallback();
    this.focusCallback = undefined; //销毁
  }
  bindFocus(callback: () => void) {
    this.focusCallback = callback
    if (this.isNeedBindFocus) {
      this.focusCallback()
      this.isNeedBindFocus = false
    }
  }
  focus() {
    if (this.focusCallback) {
      this.focusCallback()
    } else {
      this.isNeedBindFocus = true
    }
  }
}
