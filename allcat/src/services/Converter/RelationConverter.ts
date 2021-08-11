import { IJSONApp } from '@/models/appHelper'
import { IMultiValue, INumberValue, IRelationValue, ISingleValue, ITextValue } from '@/types/EType'
import { IJSONNumberField, IJSONRelationField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class RelationConverter extends BaseConverter {

  constructor(public app: IJSONApp, public field: IJSONRelationField) {
    super(app, field)
  }

  /** 转换为文本类型，使用primaryField */
  toText (value: IRelationValue): ITextValue {
    const targetTable = this.app.tables[this.field.relationTableId]

    if (this.field.isMulti) {
      const newOptions = (value as IMultiValue).reduce((dict: IMultiValue, it) => {
        dict.push(targetTable.rows[it as ISingleValue][targetTable.primaryField]! as string)
        return dict
      }, [])
      return newOptions.join(',')
    } else {
      return targetTable.rows[value as ISingleValue][targetTable.primaryField]! as string
    }
  }

  /** 转换为数字，保留第一项 */
  toNumber (value: IRelationValue, target: IJSONNumberField): INumberValue | undefined {
    const targetTable = this.app.tables[this.field.relationTableId]
    let val: ISingleValue
    if (this.field.isMulti) {
      val = (value as IMultiValue)[0]
    } else {
      val = value as ISingleValue
    }

    const newValue = Number(targetTable.rows[val][targetTable.primaryField]!)
    return isNaN(newValue) ? undefined : newValue
  }

  toRelation (value: IRelationValue, target: IJSONRelationField): IRelationValue | undefined {
    if (this.field.relationTableId === target.relationTableId) {
      if (this.field.isMulti === target.isMulti) {
        return value
      }

      if (target.isMulti) {
        // 单转多
        return [value as ISingleValue]
      } else {
        // 多转单
        return (value as IMultiValue)[0]
      }
    } else {
      // 改变了引射表，使用通用转换
      if (this.field.isMulti && !target.isMulti) {
        // 多转单，只保留一项
        return super.toRelation(value.slice(0, 1), target)
      } else {
        return super.toRelation(value, target)
      }
    }
  }
}