import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { Input, MessageBox, Select } from 'element-ui'
import { IJSONRow } from '@/models/Table/Row'
import { IJSONTableField } from '@/models/Table/TableField'
import style from './index.module.scss'


@Component
export default class TableCell extends Vue {
  $refs!: {
    input: Input
    select: Select
  }

  @Prop(Object) row!: IJSONRow
  @Prop(Object) field!: IJSONTableField


  /** 是否需要保存 */
  isNeedSave = false
  /** 是否处于编辑模式 */
  isEdit = false
  /** 编辑内容 */
  value = ''

  @Watch('isEdit', { immediate: true })
  onEdit(value: boolean) {
    if (value === true) {
      const { row, field } = this
      const value = row[field.id]
      // 初始化value
      this.value = value as string

      // 重置是否需要保存为需要
      this.isNeedSave = true

      //需要nextTick否则触发时机存在问题
      this.$nextTick(() => {
        if (field.type === 'text') {
          this.$refs.input.select()
        } else if (field.type === 'select') {
          this.$refs.select.focus()
          const el = this.$refs.select.$el as HTMLElement
          el.click()
        }
      })
    }
  }

  submit() {
    const { row, field } = this
    row[field.id] = this.value
  }

  onBlur() {
    this.submit()
    this.isEdit = false
  }

  render(h: CreateElement) {
    const { row, field } = this
    if (this.isEdit) {
      if (field.type === 'text') {
        return <el-input ref="input" size="mini" type="text" vModel={this.value} on={{
          blur: () => this.onBlur(),
        }} nativeOn={{
          click: (e: Event) => {
            e.stopPropagation()
          },
          keyup: (e: KeyboardEvent) => {
            const { code } = e
            if (code === 'Escape') {
              // 取消保存
              this.isNeedSave = false
              this.isEdit = false
            } else if (code === 'Enter') {
              // 保存
              this.submit()
              this.isEdit = false
            }
          },
        }} />
      } else if (field.type === 'select') {

        const selectOptions = field.selectOptions || []
        return <el-select ref="select" vModel={this.value} size="mini"
          on={{
            clickoutside: () => {
              this.isEdit = false
            },
          }}
          nativeOn={{
            click: (e: Event) => {
              // e.stopPropagation()
            },
            keyup: (e: KeyboardEvent) => {
              const { code } = e
              if (code === 'Escape') {
                // 取消保存
                this.isNeedSave = false
                this.isEdit = false
              } else if (code === 'Enter') {
                // 保存
                this.submit()
                this.isEdit = false
              }
            },
          }}>
          {selectOptions.map(item => <el-option
            key={item}
            label={item.value}
            value={item.value}>
          </el-option>)}
        </el-select>
      } else {
        return <div>控件不全</div>
      }

    } else {
      const value = row[field.id]
      return <div class={style.preview} on={{
        dblclick: () => {
          this.isEdit = true
        },
      }}>{value}</div>
    }
  }
}
