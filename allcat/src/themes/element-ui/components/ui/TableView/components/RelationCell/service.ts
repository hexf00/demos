import { ISelectOption } from '@/models/Table/fieldHelper'
import store from '@/store'
import { IJSONRelationField } from '@/types/IJSONTableField'
import BaseCellService from '../BaseCell/service'

export default class RelationCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: ISelectOption[] = []

  constructor(public field: IJSONRelationField) {
    super()
    this.isMulti = field.isMulti
  }

  toText (value: string): string {
    const relationTable = store.currentApp!.tables[this.field.relationTo]
    const row = relationTable.rows[value]
    !row && console.warn('失效引用', value)
    // 删除数据需要联动删除，否则这里会报错
    // 表被删除
    // 行被删除
    return (row && row[relationTable.primaryField] as string) || '-'
  }
}