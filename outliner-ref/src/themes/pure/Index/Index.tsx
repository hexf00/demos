import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockTree from '@/components/BlockTree/BlockTree'

@Component
export default class extends Vue {

  data: Tree<IBlock>
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
    ]
  }

  render(h: CreateElement) {
    return <div>
      <BlockTree data={this.data} />
    </div>
  }
}
