import { TSelectOption } from '../models/Table/fieldHelper'

export interface IJSONBase {
  /** 字段主键 */
  id: string
  /** 字段名称 */
  name: string
  /** 字段描述 */
  description: string
}

/**
 * 文本类型
 * 
 */
export interface IJSONTextField extends IJSONBase {
  type: 'text'
}

/**
 * 数字类型
 */
export interface IJSONNumberField extends IJSONBase {
  type: 'number'
}

/**
 * 下拉框类型
 */
export interface IJSONSelectField extends IJSONBase {
  type: 'select'
  /** 启用多选, 对select relation 有效 */
  isMulti: boolean
  /** select 选项 */
  selectOptions?: TSelectOption[]
}

/** 关联字段类型 */
export interface IJSONRelationField extends IJSONBase {
  type: 'relation'
  /** 启用多选, 对select relation 有效 */
  isMulti: boolean
  /** 映射表id */
  relationTo: string
}

export interface IJSONScriptField extends IJSONBase {
  type: 'script'
}

export type IJSONTableField = IJSONTextField | IJSONNumberField | IJSONSelectField | IJSONRelationField | IJSONScriptField