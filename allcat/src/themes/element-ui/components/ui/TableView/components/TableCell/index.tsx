import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTableField } from '@/types/IJSONTableField'
import TextCell from '../TextCell'
import SelectCell from '../SelectCell'
import TextCellService from '../TextCell/service'
import SelectCellService from '../SelectCell/service'

@Component
export default class TableCell extends Vue {

  @Prop(Object) row!: IJSONRow
  @Prop(Object) field!: IJSONTableField
  @Prop(Number) width!: number

  render (h: CreateElement) {
    if (this.field.type === 'text') {
      const service = new TextCellService(this.field)
      return <TextCell value={this.row[this.field.id] as string} service={service} oninput={val => { this.row[this.field.id] = val }} />
    } else if (this.field.type === 'select') {
      const service = new SelectCellService(this.field)
      service.selectOptions = this.field.selectOptions || []
      return <SelectCell value={this.row[this.field.id] as string[] | string} service={service} oninput={(value) => {
        // 赋值，因为有attr校验，所以不能使用v-model
        this.row[this.field.id] = value

        // 检查是否有新选项，如果有新选项加入到选项中
        const items = new Set(service.selectOptions.map(it => it.value))

        const list = this.field.isMulti ? value as string[] : [value as string]
        list.forEach(it => {
          if (it !== '' && !items.has(it)) {
            this.field.selectOptions?.push({
              value: it,
              // 默认无颜色
              color: '',
            })
          }
        })
      }} />
    } else {
      return <div>未知组件</div>
    }
  }
}
