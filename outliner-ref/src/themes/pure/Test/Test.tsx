import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import Tree from '@/components/Tree'
import ITree from '@/components/Tree/service'

@Component
export default class extends Vue {

  tree = new ITree

  mounted() {
    this.tree.setData([
      {
        id: '上海',
        value: '上海',
        children: [],
      },
      {
        id: '江苏',
        value: '江苏',
        children: [
          {
            id: '南京',
            value: '南京',
            children: [{
              id: '秦淮', value: '秦淮', children: [],
            }],
          },
          {
            id: '苏州',
            value: '苏州',
            children: [],
          },
        ],
      },
      {
        id: '引用节点测试',
        value: '![[南京]]',
        children: [],
      },
    ])
  }
  render(h: CreateElement) {
    return <div>
      <Tree service={this.tree}></Tree>
    </div>
  }
}
