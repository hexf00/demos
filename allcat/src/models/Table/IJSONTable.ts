import { IView } from '../View/View'
import { IJSONTableField } from './IJSONTableField'
import { IJSONRow } from './IJSONRow'



export interface IJSONTable {
  /** 表主键 */
  id: string
  /** 表名称 */
  name: string
  /** 表描述 */
  description: string
  /** 表字段配置 */
  fields: Record<string, IJSONTableField>
  /** 表数据 */
  rows: Record<string, IJSONRow>
  /** 表视图 */
  views: Record<string, IView>
  /** 表视图排序 */
  viewsSorts: string[]
}
