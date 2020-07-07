import { Vue, Component, Prop, Watch } from "vue-property-decorator";

interface IRoot {
  list: IList;
}

class VueRoot extends Vue {
  value: IRoot;
  render() {
    return <VueList service={this.value.list}></VueList>;
  }
}

interface IList {
  nodes: INode[];
}

class VueList extends Vue {
  @Prop() value: IList;
  render() {
    return (
      <div>
        {this.value.nodes.map((node) => (
          <VueNode service={node}></VueNode>
        ))}
      </div>
    );
  }
}

interface INode {
  bindFocus(fn: () => void): void;
  enter(fn: () => void): void;
}

class VueNode extends Vue {
  @Prop() value: INode;
  $refs!: {
    input: HTMLInputElement;
  };

  mounted() {
    this.value.bindFocus(() => {
      this.$refs.input.focus();
    });

    this.value.bindKey(() => {});
  }

  render() {
    return <input ref="input" onkeydown={this.value.enter}></input>;
  }
}
