import { ISelectOption } from '@/models/Table/fieldHelper'
import { IMultiValue, INumberValue, ISelectValue, ISingleValue, ITextValue } from '@/types/EType'
import { IJSONTable } from '@/types/IJSONTable'
import { IJSONNumberField, IJSONSelectField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class SelectConverter extends BaseConverter {

  constructor(public field: IJSONSelectField) {
    super(field)
  }

  toText (value: ISelectValue): ITextValue {
    if (this.field.isMulti) {
      const val = value as IMultiValue
      return val.join(',')
    } else {
      const val = value as ISingleValue
      return val
    }
  }

  toNumber (value: ISelectValue, target: IJSONNumberField): INumberValue | undefined {
    let val: ISingleValue
    if (this.field.isMulti) {
      val = (value as IMultiValue)[0]
    } else {
      val = value as ISingleValue
    }

    const newValue = Number(val)
    return isNaN(newValue) ? undefined : newValue
  }

  toSelect (value: ISelectValue, target: IJSONSelectField): ISelectValue | undefined {
    if (this.field.isMulti === target.isMulti) {
      return value
    }

    if (this.field.isMulti) {
      // 多转单
      return (value as IMultiValue)[0]
    } else {
      // 单转多
      return [value as ISingleValue]
    }
  }

  /** 
   * 获取选项用于选项类型 选项预览
   * Base中只考虑string情况
   */
  getSelectOptions (table: IJSONTable, target: IJSONSelectField): ISelectOption[] {
    return target.selectOptions
  }
}