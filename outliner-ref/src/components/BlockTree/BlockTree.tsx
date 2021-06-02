import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import Block, { IBlockService } from '@/components/Block/Block'

@Component({
  name: 'BlockTree',
})
export default class extends Vue {
  // 类型检查属性
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
