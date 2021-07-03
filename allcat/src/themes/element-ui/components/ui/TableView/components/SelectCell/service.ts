import { TSelectOption } from '@/models/Table/fieldHelper'
import BaseCellService from '../BaseCell/service'

export default class SelectCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: TSelectOption[] = []

  constructor(field: { isMulti: boolean }) {
    super()
    this.isMulti = field.isMulti
  }

  toText (value: string) {
    return value
  }
}