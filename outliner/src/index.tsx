import Vue from "vue"
import NodeListService from "./components/node-list/service"
import NodeList from "./components/node-list"

new Vue({
  data() {
    return {
      list: new NodeListService([{
        value: 'root0',
        children: []
      },
      {
        value: 'root1',
        children: [
          {
            value: 'root1-1',
            children: []
          },
          {
            value: 'root1-1',
            children: []
          }
        ]
      }])
    }
  },
  render(h) {
    return <div>
      <NodeList service={this.list}>
      </NodeList>
    </div>
  }
}).$mount('#app')