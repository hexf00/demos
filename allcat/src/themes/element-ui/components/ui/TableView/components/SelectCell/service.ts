import { TSelectOption } from '@/models/Table/fieldHelper'
import BaseCellService from '../BaseCell/service'

export default class SelectCellService extends BaseCellService {
  /** 是否多选 */
  isMulti = false

  /** 选项 */
  selectOptions: TSelectOption[] = []
}