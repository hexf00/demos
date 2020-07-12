import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";

export interface IDivInput {
  value: string;
  onBlur: () => void;
  onInput: (value: string) => void;
  onEnter: () => void;
  bindFocus: (callback: () => void) => void;
  tab: (currKey: string) => void;
  shiftTab: (currKey: string) => void;
}

@Component
export default class DivInput extends Vue {
  $props!: { service: IDivInput };
  $el!: HTMLElement;

  $refs!: {
    input: HTMLInputElement;
  };

  @Prop() service!: IDivInput;

  mounted() {
    this.$watch(
      "service.value",
      () => {
        console.log("watch", this.service.value);
        if (this.service.value !== this.$refs.input.innerText) {
          this.$refs.input.innerHTML = this.service.value;
        } else {
          console.log("!!");
        }
      },
      { immediate: true }
    );

    console.log("div-input mounted", this.service.value);
    this.service.bindFocus(() => {
      console.log("focus");
      this.$refs.input.focus();
    });
  }
  render(h: CreateElement) {
    return (
      <div
        ref="input"
        class={"input"}
        contenteditable
        onkeydown={(event: KeyboardEvent) => {
          console.log(event.keyCode);

          const hotKey: { [key: string]: () => void } = {};

          hotKey[13 /** 回车 */] = () => {
            this.service.onEnter();
          };

          hotKey[16 /** shift */] = () => {
            window.isKeyDownShiftKey = true;
          };

          hotKey[18 /** alt */] = () => {
            window.isKeyDownAltKey = true;
          };

          hotKey[9 /** tab */] = () => {
            if (this.$parent.$vnode.data?.class === "ref") {
              /** 引用内，根节点不可缩进和反缩进 */
              return;
            }

            if (window.isKeyDownShiftKey /** 反缩进 */) {
              if (
                this.$parent.$parent?.$vnode?.data?.class !=
                "ref" /** 引用内，子节点不能成为和引用根节点同级节点 */
              ) {
                this.service.shiftTab(String(this.$parent.$vnode.key));
              }
            } /** 缩进 */ else {
              this.service.tab(String(this.$parent.$vnode.key));
            }
          };

          hotKey[38 /** up */] = () => {};

          hotKey[40 /** down */] = () => {};

          if (hotKey[event.keyCode]) {
            hotKey[event.keyCode]();
            event.preventDefault();
          }
        }}
        onkeyup={(event: KeyboardEvent) => {
          const hotKey: { [key: string]: () => void } = {};

          hotKey[16 /** shift */] = () => {
            window.isKeyDownShiftKey = false;
          };

          hotKey[18 /** alt */] = () => {
            window.isKeyDownAltKey = false;
          };

          if (hotKey[event.keyCode]) {
            hotKey[event.keyCode]();
            event.preventDefault();
          }
        }}
        onBlur={() => {
          this.service.onBlur();
        }}
        onInput={({ currentTarget }: { currentTarget: HTMLDivElement }) => {
          this.service.onInput(currentTarget.innerText);
        }}
      ></div>
    );
  }
}
