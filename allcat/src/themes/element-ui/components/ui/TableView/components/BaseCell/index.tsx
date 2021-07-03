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
    this.localValue = JSON.parse(JSON.stringify(value))
  }

  /** 是否处于编辑模式 */
  isEdit = false

  /** 单元格的配置 */
  @Prop(Object) readonly service!: BaseCellService

  /** 提交数据，进行更新 */
  submit () {
    this.$emit('input', this.localValue)
  }

}
