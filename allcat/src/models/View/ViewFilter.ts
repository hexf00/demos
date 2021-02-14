
/** 过滤器规则 */
export interface IRuleItem {
  /** 规则应用字段，字段id */
  field: string
  /** 规则类型 */
  type: 'eq' | 'neq' | 'contain' | 'ncontain'
}

export interface IViewFilter {
  /** 过滤器类型 */
  type: "simple"
  /** 过滤器规则 */
  rules: IRuleItem[]
}