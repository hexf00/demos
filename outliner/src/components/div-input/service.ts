import { IDivInput } from "."

export default class DivInputService implements IDivInput {
  private isNeedBindFocus = false
  private focusCallback?: () => void
  constructor(
    private onEnterCallback: () => void,
    private onBlurCallback: () => void,
    private updateValue: (value: string) => void,
    public tab: (currKey: string) => void,
  ) {
    console.log(arguments)
  }
  value = ''
  onInput(value: string) {
    console.log("onInput", value);
    this.value = value
    this.updateValue(value)
  }
  onEnter() {
    this.onEnterCallback()
  }
  onBlur() {
    this.onBlurCallback();
    this.focusCallback = undefined; //销毁
  }
  bindFocus(callback: () => void) {

    // console.log("bindFocus", this.isNeedBindFocus)
    this.focusCallback = callback


    //此处要求 data和dom有1对1关系，否则focus则始终只有一处

    // if (this.isNeedBindFocus) {
      this.focusCallback()
    //   this.isNeedBindFocus = false
    // }
  }
  focus() {
    console.log("focus");
    if (this.focusCallback) {
      this.focusCallback()
    } 
    // else {
    //   this.isNeedBindFocus = true
    // }
  }
}
