import libs from '@/libs'
import { IJSONApp } from '@/models/appHelper'
import { ISelectOption } from '@/models/Table/fieldHelper'
import { IMultiValue, INumberValue, ISelectValue, ISingleValue, ITextValue } from '@/types/EType'
import { IJSONTable } from '@/types/IJSONTable'
import { IJSONNumberField, IJSONSelectField } from '@/types/IJSONTableField'
import { IOptionAction } from '@/types/IOptionAction'
import BaseConverter from './BaseConverter'

export default class SelectConverter extends BaseConverter {

  constructor(public app: IJSONApp, public field: IJSONSelectField) {
    super(app, field)
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

  toSelect (value: ISelectValue, target: IJSONSelectField, optionActions: Record<ISingleValue, IOptionAction>): ISelectValue | undefined {
    // 选项修改会进入此逻辑

    console.log(this.field, target, optionActions)

    const mapFn = (option: ISingleValue): ISingleValue | undefined => {
      // 如果原选项删除，但又添加了相同字面量，则选项等同于不删除，这一动作已经在外部处理
      const action = optionActions[option]
      if (!action) {
        // 无动作
        return option
      }

      if (action.type === 'delete') {
        return
      } else if (action.type === 'edit') {
        return action.newValue
      } else {
        // 其它情况，不存在
        return
      }
    }

    if (this.field.isMulti) {
      const reduceFn = (dict: IMultiValue, option: ISingleValue) => {
        const r = mapFn(option)
        if (r !== undefined) {
          dict.push(r)
        }
        return dict
      }

      const r = libs.arrUniq((value as IMultiValue).reduce(reduceFn, []), (a, b) => a === b)

      if (this.field.isMulti === target.isMulti) {
        // 去重
        return r.length > 0 ? r : undefined
      } else {
        // 多转单，保留第一项
        return r.length > 0 ? r[0] : undefined
      }
    } else {
      const r = mapFn(value as ISingleValue)
      if (this.field.isMulti === target.isMulti) {
        return r
      } else {
        // 单转多
        return r && [r]
      }
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