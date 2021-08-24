import { IJSONRow } from '@/types/IJSONRow'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import BaseCellService from './service'

@Component
export default class BaseCell extends Vue {
  /** 单元格的值 */
  @Prop() readonly value: unknown

  localValue: unknown = null

  /** 初始化model值 */
  @Watch('value', { immediate: true })
  initLocalValue (value: unknown) {
    this.localValue = value && JSON.parse(JSON.stringify(value))
  }

  /** 是否处于编辑模式 */
  isEdit = false

  @Watch('isEdit', { immediate: true })
  onEditBase (isEdit: boolean) {
    if (isEdit === true) {
      console.log('enterEdit')
      this.$emit('enterEdit')
      document.addEventListener('rowBlur', this.onBlur)
    } else {
      document.removeEventListener('rowBlur', this.onBlur)
    }
  }

  onBlur (e: CustomEventInit<{ row: IJSONRow }>) {
    this.$emit('leaveEdit', e.detail?.row)
    this.submit()
    this.isEdit = false
  }

  beforeDestroy () {
    document.removeEventListener('rowBlur', this.onBlur)
  }

  /** 单元格的配置 */
  @Prop(Object) readonly service!: BaseCellService

  /** 提交数据，进行更新 */
  submit () {
    if (this.localValue === '' || (Array.isArray(this.localValue) && this.localValue.length === 0)) {
      this.$emit('input', undefined)
    } else {
      this.$emit('input', this.localValue)
    }
  }

}
