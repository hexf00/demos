import { IFieldValue } from './EType'

export interface IJSONRow {
  /** 行主键 */
  id: string
  /** 创建时间 */
  createdAt: number
  // updatedAt: number
  [key: string]: IFieldValue | undefined
}
