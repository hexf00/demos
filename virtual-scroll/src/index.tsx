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
  text: string = "";
  child?: INode[];
  showEditStatus = false;
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
        window.getSelection().collapse(div1, 1);
      }
    },
    New() {
      console.log("newb");
      this.$emit("newb");
    },
    blur(e:Event){
      
      this.value.showEditStatus = false;
      
      var html  =(e.currentTarget as HTMLElement).innerHTML;
      console.log("blur",html);
      this.$nextTick(()=>{
        this.value.text = html;
      })
      

    }
  },
  mounted() {
    this.value.bindFocus(() => {
      console.log("ShowEdit", this.value.text);
      this.value.showEditStatus = true;
      this.$nextTick(() => {
        console.log(123);
        let nodeEl = this.$refs.node as HTMLTextAreaElement;
        console.log(nodeEl);
      
        nodeEl.focus()
        // nodeEl.select();
      });
    });

    // this.value.bindShowEdit();
  },
  render(h) {
    console.log(this.value);

    let list =
      this.value.child.length > 0 ? (
        <node-list value={this.value.child} onnewb={this.New}></node-list>
      ) : (
        ""
      );

    let input;

    if (this.value.showEditStatus) {
      // input = (
      //   <textarea
      //     ref="node"
      //     onKeydown={this.onKeyUp}
      //     onBlur={this.onInput}
      //     tabindex={-1}
      //   >
      //     {this.value.text}
      //   </textarea>
      // );
      input = (
        <div
          ref="node"
          contenteditable={true}
          onKeydown={this.onKeyUp}
          onBlur={this.blur}
        >
          {this.value.text}
        </div>
      );
    } else {
      input = (
        <div ref="node" onMouseup={this.value.focus}>
          {this.value.text}
        </div>
      );
    }

    return (
      <li onNew={this.New}>
        {input}
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
        {(this.value as INode[]).map((it: INode, index) => (
          <node key={index} value={it} onnewb={this.New}></node>
        ))}
      </ul>
    );
  },
});

/** 实例 */
new Vue({
  data() {
    return {
      a: [new Node("123"), new Node("abc", [new Node("def")])] as INode[],
    };
  },
  methods: {
    New() {
      console.log("newb");
      let newNode = new Node("");
      this.a.push(newNode);

      this.$nextTick(() => {
        newNode.focus();
      });
    },
  },
  render(h) {
    return <node-list value={this.a} onnewb={this.New}></node-list>;
  },
}).$mount("#app");
