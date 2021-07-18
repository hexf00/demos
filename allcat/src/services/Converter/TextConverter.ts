import { IRelationValue, ITextValue } from '@/types/EType'
import { IJSONRelationField, IJSONTextField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class TextConverter extends BaseConverter {

  constructor(public field: IJSONTextField) {
    super(field)
  }

  toText (value: ITextValue): ITextValue {
    return value
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