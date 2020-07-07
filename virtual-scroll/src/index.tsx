import a from "./a";
import Vue from "vue";

interface Bullet {
  text: string;
  child?: Bullet[];
}

class Bullet {
  text: string;
  child?: Bullet[];
  constructor(text) {
    this.text = text;
  }
}

/** 节点 */
Vue.component("bullet", {
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
  render(h) {
    console.log(this.value);

    let list = this.value.child ? (
      <bullet-list value={this.value.child} onnewb={this.New}></bullet-list>
    ) : (
      ""
    );

    return (
      <li onNew={this.New}>
        <p contenteditable="true" onKeydown={this.onKeyUp}>
          {this.value.text}
        </p>
        {list}
      </li>
    );
  },
});

/** 节点列表 */
Vue.component("bullet-list", {
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
        {(this.value as Bullet[]).map((it: Bullet) => (
          <bullet value={it} onnewb={this.New}></bullet>
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
      ] as Bullet[],
    };
  },
  methods: {
    New() {
      console.log("newb");
      this.a.push({ text: "" });
    },
  },
  render(h) {
    return <bullet-list value={this.a} onnewb={this.New}></bullet-list>;
  },
}).$mount("#app");
