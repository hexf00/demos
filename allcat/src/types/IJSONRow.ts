import { IFieldValue } from './EType'

export interface IJSONRow {
  /** 行主键 */
  id: string
  [key: string]: IFieldValue | undefined
}
