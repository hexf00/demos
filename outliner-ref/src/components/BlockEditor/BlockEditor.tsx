import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
export interface IBlockEditorService {
  /** 数据 */
  data: TreeItem<IBlock>
  /** 退出编辑模式 */
  hideEdit: () => void
}

@Component({
  name: 'BlockEditor',
})
export default class extends Vue {
  // 类型检查属性
  $props!: {
    service: IBlockEditorService
  }

  $refs!: {
    input: HTMLInputElement
  }

  @Prop(Object) service!: IBlockEditorService

  mounted() {
    this.$refs.input.focus()
  }

  render(h: CreateElement) {
    return <div>
      <input ref="input" type="text" value={this.service.data.value} on={{
        blur: () => this.service.hideEdit(),
      }} />
    </div>
  }
}