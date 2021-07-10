export enum EFieldType {
  /** 文本类型 */
  text = 'text',
  /** 数字类型 */
  number = 'number',
  /** 选项类型 */
  select = 'select',
  /** 关联类型 */
  relation = 'relation',
  /** 脚本类型 */
  // script = 'script'
}

/** 单个 值 */
export type ISingleValue = string
/** 多个 值 */
export type IMultiValue = string[]

/** 文本 值 */
export type ITextValue = ISingleValue
/** 数字 值 */
export type INumberValue = number
/** 下拉框 值 */
export type ISelectValue = ISingleValue | IMultiValue
/** 关联 值 */
export type IRelationValue = ISingleValue | IMultiValue

/** 字段 值 */
export type IFieldValue = ITextValue | INumberValue | ISelectValue | IRelationValue