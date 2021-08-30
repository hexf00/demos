import { IJSONRow } from '@/types/IJSONRow'

export interface ITableView {
  /** 正在被编辑的行 */
  inEditRow: IJSONRow | null
}