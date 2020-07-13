import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { CreateElement } from "vue";
import { NodePath } from "../../common/NodePath";

export interface INodePreview {
  value: string;
  focus: (nodePath: NodePath) => void;
}

@Component
export default class NodePreview extends Vue {
  //给组件检验提示  使用这个组件的时候 属性要符合这个规则
  $props!: { service: INodePreview };
  @Prop() service!: INodePreview;
  $refs!: {
    input: HTMLInputElement;
  };

  mounted() {
    // this.$watch(
    //   "service.value",
    //   () => {
    //     console.log("watch", this.service.value);
    //     if (this.service.value !== this.$refs.input.innerText) {
    //       this.$refs.input.innerHTML = this.service.value;
    //     } else {
    //       console.log("!!");
    //     }
    //   },
    //   { immediate: true }
    // );
    // console.log("div-input mounted", this.service.value);
    // this.service.bindFocus(() => {
    //   this.$refs.input.focus();
    // });
  }

  render(h: CreateElement) {
    return (
      <div
        ref="input"
        class={"input preview"}
        onClick={() => {
          let key = this.$parent?.$vnode?.key;
          key && this.service.focus(new NodePath(key.toString()));
        }}
      >
        {this.service.value}
      </div>
    );
  }
}
