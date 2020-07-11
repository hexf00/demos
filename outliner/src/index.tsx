import Vue from "vue";
import NodeListService from "./components/node-list/service";
import NodeList from "./components/node-list";

let list = new NodeListService([
  {
    value: "{{2}}",
    children: [],
  },
  {
    value: "上海",
    children: [],
  },
  {
    value: "江苏",
    children: [
      {
        value: "南京",
        children: [{ value: "秦淮", children: [] }],
      },
      {
        value: "苏州",
        children: [],
      },
    ],
  },
]);

new Vue({
  data() {
    return {
      list,
      currFocus:"",
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
