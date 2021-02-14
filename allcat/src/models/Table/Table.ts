import { IView } from '../View/View'
import { ITableField } from './TableField'
import { ITableRow } from './TableRow'

export interface ITable {
  /** 表主键 */
  _id: string
  /** 表名称 */
  name: string
  /** 表描述 */
  description: string
  /** 表字段配置 */
  fields: Record<string, ITableField>
  /** 表数据 */
  data: Record<string, ITableRow>
  /** 视图 */
  views: IView
}