import { TSelectOption } from '@/models/Table/fieldHelper'
import { EFieldType, IFieldValue, INumberValue, IRelationValue, ISelectValue, ISingleValue, ITextValue } from '@/types/EType'
import { IJSONTable } from '@/types/IJSONTable'
import { IJSONNumberField, IJSONRelationField, IJSONSelectField, IJSONTableField, IJSONTextField } from '@/types/IJSONTableField'
// TODO 暂时不实现接口

export default class BaseConverter {

  constructor(public field: IJSONTableField) {

  }

  convert (value: IFieldValue, target: IJSONTextField): ITextValue
  convert (value: IFieldValue, target: IJSONNumberField): INumberValue | undefined
  convert (value: IFieldValue, target: IJSONSelectField): ISelectValue | undefined
  convert (value: IFieldValue, target: IJSONRelationField): IRelationValue | undefined
  convert (value: IFieldValue, target: IJSONTableField): IFieldValue | undefined
  convert (value: IFieldValue, target: IJSONTableField) {
    switch (target.type) {
      case EFieldType.text: return this.toText(value)
      case EFieldType.number: return this.toNumber(value, target)
      case EFieldType.select: return this.toSelect(value, target)
      case EFieldType.relation: return this.toRelation(value, target)
    }
  }

  toText (value: IFieldValue): ITextValue {
    return String(value)
  }

  toNumber (value: IFieldValue, target: IJSONNumberField): INumberValue | undefined {
    const newValue = Number(value)
    return isNaN(newValue) ? undefined : newValue

  }

  // 转化为选项
  // 转换规则是名称匹配，不存在的就新增
  toSelect (value: IFieldValue, target: IJSONSelectField): ISelectValue | undefined {
    return
  }

  // 转换为关联类型
  // 转换规则是名称匹配，名称存在就变成id
  // 对于关联表名称不存在的，有两种处理方式，1关联表插入新行后存储id，2不处理
  // 暂时不考虑不处理的清空，默认按1处理
  toRelation (value: IFieldValue, target: IJSONRelationField): IRelationValue | undefined {
    return
  }

  /** 
   * 获取所有的选项  用于选项类型面板中的选项预览
   * Base中只考虑string情况
   */
  getSelectOptions (table: IJSONTable, target: IJSONSelectField): TSelectOption[] {
    const { id: fieldId } = this.field
    const optionsMap: Set<string> = new Set()

    for (const key in table.rows) {
      const value = table.rows[key][fieldId]
      if (value !== undefined) {

        const text = this.toText(value)
        if (target.isMulti) {
          text.split(',').forEach(it => {
            optionsMap.add(it)
          })
        } else {
          optionsMap.add(value as ISingleValue)
        }
      }
    }

    return Array.from(optionsMap).map(it => ({
      color: '',
      value: it,
    }))
  }
}