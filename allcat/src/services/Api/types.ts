import { IJSONRow } from '@/types/IJSONRow'

export interface IApi {
  /** 添加行 */
  addRow (app: string, table: string, row: IJSONRow): Promise<boolean>
}