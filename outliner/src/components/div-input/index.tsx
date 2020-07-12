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

          if (event.keyCode === 13 /** 回车 */) {
            this.service.onEnter();
            event.preventDefault();
          } else if (event.keyCode === 16 /** shift */) {
            window.shiftKeyStatus = true;
            event.preventDefault();
          } else if (event.keyCode === 18 /** alt */) {
            window.altKeyStatus = true;
            event.preventDefault();
          } else if (event.keyCode === 9 /** tab */) {
            if (
              this.$parent.$vnode.data?.class !=
              "ref" /** 引用内，根节点不可缩进和反缩进 */
            ) {
              if (window.shiftKeyStatus) {
                if (
                  this.$parent.$parent?.$vnode?.data?.class !=
                  "ref" /** 引用内，子节点不能成为和引用根节点同级节点 */
                ) {
                  this.service.shiftTab(String(this.$parent.$vnode.key));
                }
              } else {
                this.service.tab(String(this.$parent.$vnode.key));
              }
            }

            event.preventDefault();
          } 
        }}
        onkeyup={(event: KeyboardEvent) => {
          if (event.keyCode === 16 /** shift */) {
            //恢复shift
            window.shiftKeyStatus = false;
            event.preventDefault();
          } else if (event.keyCode === 18 /** alt */) {
            //恢复alt
            window.altKeyStatus = false;
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
