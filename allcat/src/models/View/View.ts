import { IViewField } from './ViewField'
import { ITableRow } from '../Table/TableRow'
import { IViewFilter } from './ViewFilter'

export interface IView {
  /** 视图主键 */
  _id: string
  /** 视图类型 */
  type: 'table' | 'kanban'
  /** 视图名称 */
  name: string
  /** 视图描述 */
  description: string
  /** 视图字段配置 */
  fields: IViewField[]
  /** 视图数据 */
  data: ITableRow[]
  /** 过滤器 */
  filters: IViewFilter[]
}