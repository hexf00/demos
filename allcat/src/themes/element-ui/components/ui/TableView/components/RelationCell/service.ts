import { ISelectOption } from '@/models/Table/fieldHelper'
import store from '@/store'
import { EFieldType } from '@/types/EType'
import { IJSONRelationField, IJSONReverseRelationField } from '@/types/IJSONTableField'
import BaseCellService from '../BaseCell/service'

export default class RelationCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: ISelectOption[] = []

  constructor(public field: IJSONRelationField | IJSONReverseRelationField) {
    super()
    if (field.type === EFieldType.relation) {
      this.isMulti = field.isMulti
    } else {
      /** 反向映射类型 */
      this.isMulti = true
    }
  }

  toText (value: string): string {

    let relationTable
    if (this.field.type === EFieldType.relation) {
      relationTable = store.currentApp!.tables[this.field.relationTo]
    } else {
      relationTable = store.currentApp!.tables[this.field.relationTableId]
    }

    const row = relationTable.rows[value]
    !row && console.warn('失效引用', value)
    // 删除数据需要联动删除，否则这里会报错
    // 表被删除
    // 行被删除
    return (row && row[relationTable.primaryField] as string) || '-'
  }
}