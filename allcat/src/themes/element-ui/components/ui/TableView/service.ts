import { IView } from '@/models/View/View'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTable } from '@/types/IJSONTable'

export default class TableViewService {

  selected: IJSONRow[] = []

  /** 正在被编辑的行 */
  inEditRow: IJSONRow | null = null

  constructor(public table: IJSONTable, public view: IView) {

  }
}