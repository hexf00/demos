import { IDialogService } from './Dialog'
export default class DialogService implements IDialogService {
  /** 标题 */
  title = '信息'

  /** 是否显示 */
  visible = false

  /** 显示弹出框 */
  show({ title }: { title?: string }) {
    if (title) {
      this.title = title
    }
    this.visible = true
  }

  /** 隐藏弹出框 */
  async hide() {
    this.visible = false
  }
}
