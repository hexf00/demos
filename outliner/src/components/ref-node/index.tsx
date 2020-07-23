import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";

export interface IRefNode {}

@Component
export default class RefNode extends Vue {
  $props!: { service: IRefNode };
  $el!: HTMLElement;

  $refs!: {
    input: HTMLInputElement;
  };

  @Prop() service!: IRefNode;
  mounted() {}
  render(h: CreateElement) {
    return <div ref="input"></div>;
  }
}
