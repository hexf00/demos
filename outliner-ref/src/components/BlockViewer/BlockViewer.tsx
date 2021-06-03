import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import style from './index.module.scss'
import BlockTree from '../BlockTree/BlockTree'
import { IBlockService } from '../Block/Block'

export interface IBlockViewerService {
  /** 数据 */
  data: TreeItem<IBlock>
  /** 进入编辑模式 */
  showEdit: () => void

  /** 引用节点 */
  refs: Tree<IBlockService>
}
@Component
export default class BlockViewer extends Vue {

  // 配置JSX中属性类型检查
  $props!: {
    service: IBlockViewerService
  }

  @Prop(Object) service!: IBlockViewerService

  render(h: CreateElement) {
    return <div on={{
      click: () => {
        this.service.showEdit()
      },
    }}>
      {this.service.data.value}
      <BlockTree class={style.refs} data={this.service.refs} />
    </div>
  }
}
