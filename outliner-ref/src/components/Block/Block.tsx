import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockEditor, { IBlockEditorService } from '../BlockEditor/BlockEditor'
import BlockViewer, { IBlockViewerService } from '../BlockViewer/BlockViewer'
export interface IBlockService extends IBlockViewerService, IBlockEditorService {
  /** 是否处于编辑模式 */
  isEdit: boolean

  /** 数据 */
  data: TreeItem<IBlock>
}

@Component
export default class Block extends Vue {
  // 配置JSX中属性类型检查
  $props!: {
    service: TreeItem<IBlockService>
  }

  @Prop(Object) service!: TreeItem<IBlockService>

  render(h: CreateElement) {
    return <div>
      {
        this.service.isEdit ? <BlockEditor service={this.service} /> : <BlockViewer service={this.service} />
      }
      <ul>
        {this.service.children.map(item => <Block service={item}></Block>)}
      </ul>
    </div>
  }
}
