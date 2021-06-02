import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockTree from '@/components/BlockTree/BlockTree'
import BlockEditor, { IBlockEditorService } from '../BlockEditor/BlockEditor'
import BlockViewer, { IBlockViewerService } from '../BlockViewer/BlockViewer'
import BlockService from '@/services/Block.service'

export interface IBlockService extends IBlockViewerService, IBlockEditorService {
  /** 是否处于编辑模式 */
  isEdit: boolean

  /** 数据 */
  data: TreeItem<IBlock>
}

@Component({
  name: 'Block',
})
export default class extends Vue {
  // 类型检查属性
  $props!: {
    service: TreeItem<IBlockService>
  }

  @Prop(Object) service!: TreeItem<IBlockService>

  render(h: CreateElement) {
    return <div>
      {
        this.service.isEdit ? <BlockEditor service={this.service} /> : <BlockViewer service={this.service} />
      }
      <BlockTree data={this.service.children} />
    </div>
  }
}
