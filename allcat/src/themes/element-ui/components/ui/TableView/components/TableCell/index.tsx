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
    const field = this.field

    if (field.type === 'text') {
      const service = new TextCellService()
      return <TextCell value={this.row[this.field.id] as string} service={service} oninput={val => { this.row[field.id] = val }} />
    } else if (field.type === 'select') {
      const service = new SelectCellService(field)
      service.selectOptions = field.selectOptions || []
      return <SelectCell value={this.row[this.field.id] as string[] | string} service={service} oninput={(value) => {
        // 赋值，因为有attr校验，所以不能使用v-model
        this.row[this.field.id] = value

        // 检查是否有新选项，如果有新选项加入到选项中
        const items = new Set(service.selectOptions.map(it => it.value))

        const list = field.isMulti ? value as string[] : [value as string]
        list.forEach(it => {
          if (it !== '' && !items.has(it)) {
            field.selectOptions?.push({
              value: it,
              // 默认无颜色
              color: '',
            })
          }
        })
      }} />
    } else if (this.field.type === 'relation') {
      const service = new SelectCellService(this.field)
      // 关联与select 区别 是数据的来源有所不同
      service.selectOptions = []
      return <SelectCell value={this.row[this.field.id] as string[] | string} service={service} oninput={(value) => {
        // 赋值，因为有attr校验，所以不能使用v-model
        this.row[this.field.id] = value
      }} />
    } else {
      return <div>未知组件{this.field.type}</div>
    }
  }
}
