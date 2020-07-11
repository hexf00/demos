import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'


export interface INodePreview {
  value: string;
  onClick: () => void;
}

@Component
export default class NodePreview extends Vue {
  //给组件检验提示  使用这个组件的时候 属性要符合这个规则
  $props!: { service: INodePreview; hideClass?: string };
  @Prop() service!: INodePreview;
  @Prop() hideClass?: string;
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
        class={"input preview " + this.hideClass}
        onClick={() => {
          this.service.onClick();
        }}
      >
        {this.service.value}
      </div>
    );
  }
}
