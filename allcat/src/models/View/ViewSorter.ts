import { IJSONTableField } from '@/types/IJSONTableField'

/** 过滤器规则 */
export interface IJSONSortRule {
  /** 字段 */
  field: string
  /** 规则类型 */
  type: 'desc' | 'asc'
}

export interface ISortRule {
  /** 字段 */
  field: IJSONTableField
  /** 规则类型 */
  type: 'desc' | 'asc'
}

export interface IViewSorter {
  /** 是否自动排序 */
  isAutoSort: boolean
  /** 过滤器规则 */
  rules: IJSONSortRule[]
}
