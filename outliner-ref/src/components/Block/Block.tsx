import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockTree from '@/components/BlockTree/BlockTree'
import BlockEditor from '../BlockEditor/BlockEditor'
import BlockViewer from '../BlockViewer/BlockViewer'

@Component({
  name: 'Block',
})
export default class extends Vue {
  @Prop(Object) data!: TreeItem<IBlock>
  /** 是否处于编辑模式 */
  @Prop(Boolean) isEdit!: boolean

  render(h: CreateElement) {
    return <div>
      {
        this.isEdit ? <BlockEditor data={this.data} /> : <BlockViewer data={this.data} on={{
          showEditMode: () => {
            this.$emit('showEditMode')
          },
        }} />
      }
      <BlockTree data={this.data.children} />
    </div>
  }
}
