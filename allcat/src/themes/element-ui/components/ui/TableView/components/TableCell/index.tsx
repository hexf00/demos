import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTableField } from '@/types/IJSONTableField'
import TextCell from '../TextCell'
import SelectCell from '../SelectCell'
import TextCellService from '../TextCell/service'
import SelectCellService from '../SelectCell/service'
import store from '@/store'
import RelationCellService from '../RelationCell/service'

@Component
export default class TableCell extends Vue {

  @Prop(Object) row!: IJSONRow
  @Prop(Object) field!: IJSONTableField
  @Prop(Number) width!: number

  render (h: CreateElement) {
    if (!this.field) {
      return '加载中...'
    }

    const field = this.field

    if (field.type === 'text') {
      const service = new TextCellService()
      return <TextCell value={this.row[this.field.id] as string} service={service} oninput={val => {
        this.$set(this.row, field.id, val)
      }} />
    } else if (field.type === 'select') {
      const service = new SelectCellService(field)
      service.selectOptions = field.selectOptions || []
      return <SelectCell value={this.row[this.field.id] as string[] | string} service={service} oninput={(val) => {
        // 赋值，因为有attr校验，所以不能使用v-model
        this.$set(this.row, field.id, val)

        // 检查是否有新选项，如果有新选项加入到选项中
        const items = new Set(service.selectOptions.map(it => it.value))

        const list = field.isMulti ? val as string[] : [val as string]
        list.forEach(it => {
          if (it !== '' && !items.has(it)) {
            field.selectOptions?.push({
              value: it,
              label: it,
              // 默认无颜色
              color: '',
            })
          }
        })
      }} />
    } else if (this.field.type === 'relation') {
      const service = new RelationCellService(this.field)
      // 关联与select 区别 是数据的来源有所不同

      const relationTable = store.currentApp?.tables[this.field.relationTo]
      service.selectOptions = relationTable ? Object.values(relationTable.rows).map(row => ({
        label: row[relationTable.primaryField] as string || '-',
        value: row.id,
        color: '',
      })) : []
      return <SelectCell value={this.row[this.field.id] as string[] | string} service={service} oninput={(val) => {
        // 赋值，因为有attr校验，所以不能使用v-model
        this.$set(this.row, field.id, val)
      }} />
    } else {
      return <div>未知组件{this.field.type}</div>
    }
  }
}
