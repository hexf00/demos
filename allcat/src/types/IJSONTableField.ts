import { TSelectOption } from '../models/Table/fieldHelper'

export interface IJSONTableField {
  /** 字段主键 */
  id: string
  /** 字段名称 */
  name: string
  /** 字段描述 */
  description: string
  /** 字段数据类型 */
  type: 'text' | 'number' | 'select' | 'script' | 'relation'
  /** 启用多选, 对select relation 有效 */
  isMulti?: boolean
  /** select 选项 */
  selectOptions?: TSelectOption[]

}
