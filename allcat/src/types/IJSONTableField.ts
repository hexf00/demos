import { TSelectOption } from '../models/Table/fieldHelper'
import { EFieldType } from './EType'
export interface IJSONBase {
  /** 字段主键 */
  id: string
  /** 字段名称 */
  name: string
  /** 字段描述 */
  description: string
  /** 类型 */
  type: EFieldType
}

/**
 * 文本类型
 * 
 */
export interface IJSONTextField extends IJSONBase {
  type: EFieldType.text
}

/**
 * 数字类型
 */
export interface IJSONNumberField extends IJSONBase {
  type: EFieldType.number
}

/**
 * 下拉框类型
 */
export interface IJSONSelectField extends IJSONBase {
  type: EFieldType.select
  /** 启用多选, 对select relation 有效 */
  isMulti: boolean
  /** select 选项 */
  selectOptions?: TSelectOption[]
}

/** 关联字段类型 */
export interface IJSONRelationField extends IJSONBase {
  type: EFieldType.relation
  /** 启用多选, 对select relation 有效 */
  isMulti: boolean
  /** 映射表id */
  relationTo: string
}

/** 
 * 关联引用类型
 * 关联类型联动建立，不可删除，不可编辑
 * 说明 其id非随机， relationFieldId + _reference
 */
export interface IJSONRelationReferenceField extends IJSONBase {
  type: EFieldType.relationReference
  /** 固定支持多选 */
  isMulti: true
  /** 映射表id */
  relationTo: string
}

export interface IJSONScriptField extends IJSONBase {
  type: EFieldType.script
}

export type IJSONTableField = IJSONTextField | IJSONNumberField | IJSONSelectField | IJSONRelationField | IJSONScriptField | IJSONRelationReferenceField