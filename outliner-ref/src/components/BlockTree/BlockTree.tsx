import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import Block, { IBlockService } from '@/components/Block/Block'

@Component
export default class BlockTree extends Vue {
  // 配置JSX中属性类型检查
  $props!: {
    data: Tree<IBlockService>
  }

  @Prop(Array) data!: Tree<IBlockService>

  render(h: CreateElement) {
    return <ul>
      {
        this.data.map(item => <Block service={item} key={item.data.id} />)
      }
    </ul>
  }
}
