import { IControl } from '../Control/Control'

export interface ITableField {
  /** 字段主键 */
  _id: string
  /** 字段名称 */
  name: string
  /** 字段描述 */
  description: string
  /** 字段数据类型 */
  type: 'string' | 'number' | 'select' | 'script'
  /** 字段控件配置 */
  control: IControl
}