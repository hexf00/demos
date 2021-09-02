import { IJSONRow } from '@/types/IJSONRow'

export interface IApi {
  /** 添加行 */
  addRow (data: { app: string; tableId: string; row: IJSONRow }): Promise<boolean>
  /** 添加行 */
  findRow (data: { app: string; tableId: string; query: Partial<IJSONRow> }): Promise<IJSONRow | null>
}