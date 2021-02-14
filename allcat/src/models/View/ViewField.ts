import { ITableField } from '../Table/TableField'

/** 视图字段配置 */
export interface IViewField {
  /** 表字段主键 */
  _id: string
  /** 表字段配置 */
  tableField: ITableField
  /** 视图是否显示该字段 */
  isShow: boolean
}