import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";

export interface IDivInput {
  value: string;
  onBlur: () => void;
  onInput: (value: string) => void;
  onEnter: () => void;
  bindFocus: (callback: () => void) => void;
  tab: () => void;
  shiftTab: () => void;
  up: () => void;
  deleteSelf: () => void;
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
    //此处还需要考虑会存在多种身份。
    //判断是否为引用内的根节点
    const isRefRoot = (com: Vue) => {
      // console.log("isRefRoot", com, com.$attrs["node-role"]);
      return com.$attrs["node-role"] === "ref-root";
    };

    return (
      <div
        ref="input"
        class={"input"}
        contenteditable
        onkeydown={(event: KeyboardEvent) => {
          console.log(event.key);

          const hotKey: {
            [key: string]: () => boolean;
          } = {};

          hotKey[13 /** 回车 */] = () => {
            this.service.onEnter();
            return true;
          };

          hotKey[16 /** shift */] = () => {
            window.isKeyDownShiftKey = true;
            return true;
          };

          hotKey[18 /** alt */] = () => {
            window.isKeyDownAltKey = true;
            return true;
          };

          hotKey[8 /** backspace */] = () => {
            if (
              isRefRoot(this.$parent)
              /** 引用内，根节点不可被删除 */
            ) {
              return true;
            }

            if(!this.service.value.trim()){
              this.service.deleteSelf();
              return true;
            }else{
              return false;
            }
          };

          hotKey[9 /** tab */] = () => {
            if (
              isRefRoot(this.$parent)
              /** 引用内，根节点不可缩进/反缩进 */
            ) {
              return true;
            }

            if (window.isKeyDownShiftKey /** 反缩进 */) {
              if (
                isRefRoot(
                  this.$parent.$parent
                ) /** 引用内，根节点的子节点不能成为和根节点的同级节点 */
              ) {
                return true;
              }

              this.service.shiftTab();
            } /** 缩进 */ else {
              this.service.tab();
            }
            return true;
          };

          hotKey[38 /** up */] = () => {
            // this.service.up();
            //ref root 则移动到真实节点以上
            if (isRefRoot(this.$parent)) {
              
            }
            return true;
          };

          hotKey[40 /** down */] = () => {
            return true;
          };

          if (hotKey[event.keyCode]) {
            !hotKey[event.keyCode]() || event.preventDefault();
          }
        }}
        onkeyup={(event: KeyboardEvent) => {
          const hotKey: {
            [key: string]: () => void;
          } = {};

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
