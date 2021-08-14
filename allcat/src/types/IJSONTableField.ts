import { ISelectOption } from '../models/Table/fieldHelper'
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
  /** 是否启用多选 */
  isMulti: boolean
  /** select 选项 */
  selectOptions: ISelectOption[]
}

/** 
 * 关联字段类型
 * 关联引用类型 本质上与 关联字段类型相同，数据结构相同，数据相同，交互相同，仅是序列化时节省控件
 * 所以删除了IJSONRelationReferenceField，考虑用其它方式来进行区分
 **/
export interface IJSONRelationField extends IJSONBase {
  type: EFieldType.relation
  /** 是否启用多选 */
  isMulti: boolean
  /** 映射表id */
  relationTableId: string
  /** 反向关联字段的id */
  relationFieldId?: string
}

export interface IJSONReverseRelationField extends IJSONBase {
  type: EFieldType.reverseRelation
  isMulti: true
  /** 关联表id */
  relationTableId: string
  /** 关联字段id */
  relationFieldId: string
}

// export interface IJSONScriptField extends IJSONBase {
//   type: EFieldType.script
// }

export type IJSONTableField = IJSONTextField | IJSONNumberField | IJSONSelectField | IJSONRelationField | IJSONReverseRelationField