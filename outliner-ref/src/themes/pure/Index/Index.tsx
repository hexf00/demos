import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockTree from '@/components/BlockTree/BlockTree'
import PageService from '@/services/Page.service'
import Block from '@/components/Block/Block'

@Component
export default class extends Vue {

  data: TreeItem<IBlock>[]

  page: PageService

  constructor() {
    super()

    this.data = [
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
    ]

    this.page = new PageService(this.data)
  }

  render(h: CreateElement) {
    return <div>
      <BlockTree data={this.page.treeService}>
        {this.page.treeService.map(item => <Block service={item}></Block>)}
      </BlockTree>
      <pre>
        {JSON.stringify(this.data, null, 2)}
      </pre>
    </div>
  }
}
