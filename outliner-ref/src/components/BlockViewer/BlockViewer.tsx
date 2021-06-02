import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'

export interface IBlockViewerService {
  /** 数据 */
  data: TreeItem<IBlock>
  /** 进入编辑模式 */
  showEdit: () => void
}
@Component({
  name: 'BlockViewer',
})
export default class extends Vue {

  // 类型检查属性
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
    </div>
  }
}
