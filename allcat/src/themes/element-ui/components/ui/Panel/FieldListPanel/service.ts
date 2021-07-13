export default class FieldListPanelService {

  /** 是否显示字段列表面板 */
  isShow = false

  /** 是否显示字段配置面板 */
  isShowFieldItemPanel = false

  /** 打开字段列表 */
  open () {
    this.isShow = true
  }

  /** 关闭字段列表 */
  close () {
    // 考虑此处是否需要添加判断，如果字段选项修改了则不关闭字段列表面板
    this.isShow = false
    this.isShowFieldItemPanel = false
  }
}