import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockTree from '@/components/BlockTree/BlockTree'


@Component({
  name: 'Block',
})
export default class extends Vue {
  @Prop(Object) data!: TreeItem<IBlock>

  render(h: CreateElement) {
    return <div>
      {this.data.value}
      <BlockTree data={this.data.children} />
    </div>
  }
}
