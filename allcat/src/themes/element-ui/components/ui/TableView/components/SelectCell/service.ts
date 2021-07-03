import { TSelectOption } from '@/models/Table/fieldHelper'
import { IJSONTableField } from '@/types/IJSONTableField'
import BaseCellService from '../BaseCell/service'

export default class SelectCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: TSelectOption[] = []

  constructor(field: IJSONTableField) {
    super(field)
    this.isMulti = !!field.isMulti
  }
}