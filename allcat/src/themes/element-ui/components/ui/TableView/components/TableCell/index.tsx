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
import { EFieldType, IFieldValue, IMultiValue, ISelectValue, ISingleValue } from '@/types/EType'
import { checkOptionsIsNotExistAdd } from '@/models/Table/fieldHelper'
import { ITableView } from './types'

@Component
export default class TableCell extends Vue {
  $props!: {
    service: ITableView
    row: IJSONRow
    field: IJSONTableField
    width: number
  }

  @Prop(Object) service!: ITableView

  @Prop(Object) row!: IJSONRow
  @Prop(Object) field!: IJSONTableField
  @Prop(Number) width!: number

  onClick () {
    console.log('不在行内点击')
  }

  render (h: CreateElement) {
    if (!this.field) {
      return '加载中...'
    }

    const field = this.field

    if (field.type === EFieldType.text) {
      const service = new TextCellService()
      return <TextCell value={this.row[this.field.id] as string} service={service} on={{
        enterEdit: () => {
          this.service.inEditRow = this.row
        },
      }} oninput={val => {
        this.$set(this.row, field.id, val || undefined)
      }} />
    } else if (field.type === EFieldType.number) {
      const service = new TextCellService()
      return <TextCell value={this.row[this.field.id] as string} service={service} oninput={val => {
        if (typeof val === 'number') {
          this.$set(this.row, field.id, val)
        } else if (typeof val === 'string') {
          this.$set(this.row, field.id, val.trim().length > 0 ? Number(val.trim()) : undefined)
        } else {
          this.$set(this.row, field.id, undefined)
        }
      }} />
    } else if (field.type === EFieldType.select) {
      const service = new SelectCellService(field)
      service.selectOptions = field.selectOptions || []
      return <SelectCell value={this.row[this.field.id] as ISelectValue} service={service} oninput={(val) => {

        // 赋值，因为有attr校验，所以不能使用v-model
        let value
        if (field.isMulti) {
          value = (val as string[]).length > 0 ? val : undefined
        } else {
          value = (val as string) || undefined
        }

        this.$set(this.row, field.id, value)
        if (value !== undefined) {
          const list = field.isMulti ? val as IMultiValue : [val as ISingleValue]
          // 添加不存在的选项
          checkOptionsIsNotExistAdd(field, list)
        }
      }} />
    } else if (this.field.type === EFieldType.relation) {
      const service = new RelationCellService(this.field)
      // 关联与select 区别 是数据的来源有所不同

      const relationTable = store.currentApp?.tables[this.field.relationTableId]
      service.selectOptions = relationTable ? Object.values(relationTable.rows).map(row => ({
        label: row[relationTable.primaryField] as string || '-',
        value: row.id,
        color: '',
      })) : []
      return <SelectCell value={this.row[this.field.id] as IFieldValue} service={service} oninput={(val) => {
        service.setValue(val, field, this.row)
      }} />
    } else if (this.field.type === EFieldType.reverseRelation) {
      const field = this.field

      const service = new RelationCellService(field)
      // 关联与select 区别 是数据的来源有所不同

      const app = store.currentApp!
      const relationTable = app.tables[field.relationTableId]

      //目标表一定存在
      service.selectOptions = Object.values(relationTable.rows).map(row => ({
        label: row[relationTable.primaryField] as string || '-',
        value: row.id,
        color: '',
      }))

      return <SelectCell value={this.row[this.field.id] as IMultiValue} service={service} oninput={(val) => {
        service.setValue(val, field, this.row)
      }} />
    } else {
      return <div>未知组件{this.field.type}</div>
    }
  }
}
