import Vue from "vue";
import NodeListService from "./components/node-list/service";
import NodeList from "./components/node-list";

new Vue({
  data() {
    return {
      list: new NodeListService([
        {
          value: "a",
          children: [],
        },
        {
          value: "b",
          children: [
            {
              value: "b-1",
              children: [],
            },
            {
              value: "b-2",
              children: [],
            },
          ],
        },
      ]),
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
