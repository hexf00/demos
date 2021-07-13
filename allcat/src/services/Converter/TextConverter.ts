import { checkOptionsIsNotExistAdd } from '@/models/Table/fieldHelper'
import { IRelationValue, ISelectValue, ITextValue } from '@/types/EType'
import { IJSONRelationField, IJSONSelectField, IJSONTextField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class TextConverter extends BaseConverter {

  constructor(public field: IJSONTextField) {
    super(field)
  }

  toText (value: ITextValue): ITextValue {
    return value
  }

  toSelect (value: ITextValue, target: IJSONSelectField): ISelectValue | undefined {
    if (target.isMulti) {
      const newOptions = value.split(',').filter(it => it.length > 0)
      checkOptionsIsNotExistAdd(target, newOptions)
      return newOptions
    } else {
      checkOptionsIsNotExistAdd(target, [value])
      return value
    }
  }

  toRelation (value: ITextValue, target: IJSONRelationField): IRelationValue | undefined {
    if (target.isMulti) {
      // TODO: 获取id ，插入不存在的value到目标表
      return value.split(',')
    } else {
      return value
    }
  }

}