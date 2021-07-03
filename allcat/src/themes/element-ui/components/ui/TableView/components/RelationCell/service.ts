import { TSelectOption } from '@/models/Table/fieldHelper'
import store from '@/store'
import { IJSONRelationField } from '@/types/IJSONTableField'
import BaseCellService from '../BaseCell/service'

export default class RelationCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: TSelectOption[] = []

  constructor(public field: IJSONRelationField) {
    super()
    this.isMulti = field.isMulti
  }

  toText (value: string): string {
    const relationTable = store.currentApp!.tables[this.field.relationTo]
    return relationTable.rows[value][relationTable.primaryField] as string || '-'
  }
}