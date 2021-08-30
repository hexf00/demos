import { IView } from '@/models/View/View'
import { IJSONRow } from '@/types/IJSONRow'
import { IJSONTable } from '@/types/IJSONTable'

export interface ITableView {
  table: IJSONTable
  view: IView
  /** 正在被编辑的行 */
  inEditRow: IJSONRow | null
  bindScrollToRow (arg0: (row: IJSONRow) => void): void
  bindScrollTo (arg0: (y: number) => void): void
  selected: IJSONRow[]

}