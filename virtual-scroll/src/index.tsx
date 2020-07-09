import a from "./a";
import Vue from "vue";

interface INode {
  text: string;
  child?: INode[];
  focus: Function;
  showEditStatus: Boolean;
  showEdit: Function;
  bindFocus(fn: () => void): void;
  bindShowEdit(fn: () => void): void;
}

class Node implements INode {
  text: string;
  child?: INode[];
  showEditStatus =false;
  focus = () => {};
  showEdit = () => {};
  constructor(text: string, child: INode[] = []) {
    this.text = text;
    this.child = child;
  }
  bindFocus(fn: () => void) {
    this.focus = fn;
  }
  bindShowEdit(fn: () => void) {
    this.showEdit = fn;
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
      } else if (e.key == "ArrowUp") {
        var div1 = document.getElementsByTagName("div")[0];
        div1.focus();
        console.log(div1, window.getSelection());
        //@ts-ignore
        window.getSelection().collapse(div1,1);
      }
    },
    New() {
      console.log("newb");
      this.$emit("newb");
    },
    blur() {
      console.log("blur", this.value.text);
      this.value.showEditStatus = false;
    }
  },
  mounted() {
    this.value.bindFocus(() => {
      let nodeEl = this.$refs.node as HTMLElement;
      nodeEl.focus();
    })

    this.value.bindShowEdit(() => {
      let nodeEl = this.$refs.node as HTMLTextAreaElement;
      console.log("ShowEdit", this.value.text);
      this.value.showEditStatus = true;
    });
  },  
  render(h) {
    console.log(this.value);

    let list = this.value.child.length > 0 ? (
      <node-list value={this.value.child} onnewb={this.New}></node-list>
    ) : (
      ""
    );

    return (
      <li onNew={this.New}>
       
        <div
          ref="node"
          contenteditable={this.value.showEditStatus}
          onFocus={this.value.showEdit}
          onBlur={this.blur}
          onMousedown={this.value.showEdit}
          onKeydown={this.onKeyUp}
          tabindex={-1}
        >
          {this.value.text}
        </div>
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
        new Node("123"),
        new Node("abc", [
          new Node("def")
        ])
      ] as INode[],
    };
  },
  methods: {
    New() {
      console.log("newb");
      let newNode = new Node("");
      this.a.push(newNode);

      this.$nextTick(() => {
        newNode.focus();
      })

    },
  },
  render(h) {
    return <node-list value={this.a} onnewb={this.New}></node-list>;
  },
}).$mount("#app");
