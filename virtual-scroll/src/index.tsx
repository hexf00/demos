let list = new NodeList([
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
