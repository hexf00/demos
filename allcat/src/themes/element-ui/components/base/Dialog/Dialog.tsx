import { Component, Vue, Prop } from 'vue-property-decorator'

export interface IDialogService {
  /** 标题 */
  title: string
  /** 是否显示 */
  visible: boolean
  /** 隐藏 */
  hide(): void
}

@Component
export default class extends Vue {
  @Prop(Object)
  service!: IDialogService

  render(h: Vue.CreateElement) {
    const service = this.service
    const { title, visible } = service

    return <el-dialog
      close-on-press-escape={false}
      close-on-click-modal={false}
      title={title}
      visible={visible}
      on={{
        'update:visible': () => service.hide(),
      }}
    >
      {[this.$slots.default]}
    </el-dialog>
  }
}
