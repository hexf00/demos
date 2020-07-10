import Vue from "vue";
import NodeListService from "./components/node-list/service";
import NodeList from "./components/node-list";

let list = new NodeListService([
  {
    value: "a",
    children: [],
  },
  {
    value: "b",
    children: [
      {
        value: "b-1",
        children: [{ value: "b-1-1", children: [] }],
      },
      {
        value: "b-2",
        children: [],
      },
    ],
  },
  {
    value: "{{1}}",
    children: [],
  },
]);

new Vue({
  data() {
    return {
      list,
    };
  },
  render(h) {
    return (
      <ul>
        <NodeList service={this.list}></NodeList>
      </ul>
    );
  },
}).$mount("#app");
