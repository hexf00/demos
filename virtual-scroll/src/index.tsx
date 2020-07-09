import a from "./a";
import Vue from "vue";

interface INode {
  text: string;
  child?: INode[];
  focus: Function;
  bindFocus(fn: () => void): void;
}

class Node implements INode {
  text: string;
  child?: INode[];
  focus = () => {};
  constructor(text: string) {
    this.text = text;
  }
  bindFocus(fn: () => void) {
    this.focus = fn;
  }
}

/** 节点 */
Vue.component("node", {
  props: {
    value: [Array, Object],
  },
  methods: {
    onKeyUp(e: KeyboardEvent) {
      if (e.key == "Enter") {
        this.$emit("newb");
        e.stopPropagation();
        e.preventDefault();
      }
    },
    New() {
      console.log("newb");
      this.$emit("newb");
    },
  },
  mounted(){

  },
  render(h) {
    console.log(this.value);

    let list = this.value.child ? (
      <node-list value={this.value.child} onnewb={this.New}></node-list>
    ) : (
      ""
    );

    return (
      <li onNew={this.New}>
        <p ref="node" contenteditable="true" onKeydown={this.onKeyUp}>
          {this.value.text}
        </p>
        {list}
      </li>
    );
  },
});

/** 节点列表 */
Vue.component("node-list", {
  props: {
    value: Array,
  },
  methods: {
    onKeyUp(e: KeyboardEvent) {
      if (e.key == "Enter") { 
        this.$emit("newb");
        e.stopPropagation();
        e.preventDefault();
      }
    },
    New() {
      console.log("newb");
      this.$emit("newb");
    },
  },
  render(h) {
    return (
      <ul>
        {(this.value as INode[]).map((it: INode) => (
          <node value={it} onnewb={this.New}></node>
        ))}
      </ul>
    );
  },
});

/** 实例 */
new Vue({
  data() {
    return {
      a: [
        { text: "123" },
        {
          text: "abc",
          child: [
            {
              text: "def",
            },
          ],
        },
      ] as INode[],
    };
  },
  methods: {
    New() {
      console.log("newb");
      this.a.push(new Node(""));
    },
  },
  render(h) {
    return <node-list value={this.a} onnewb={this.New}></node-list>;
  },
}).$mount("#app");
