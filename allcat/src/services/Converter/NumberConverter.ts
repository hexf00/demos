import { checkOptionsIsNotExistAdd } from '@/models/Table/fieldHelper'
import { INumberValue, ISelectValue } from '@/types/EType'
import { IJSONNumberField, IJSONSelectField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class NumberConverter extends BaseConverter {

  constructor(public field: IJSONNumberField) {
    super(field)
  }

  toNumber (value: INumberValue, target: IJSONNumberField): INumberValue | undefined {
    return value
  }

  toSelect (value: INumberValue, target: IJSONSelectField): ISelectValue | undefined {
    const val = String(value)
    checkOptionsIsNotExistAdd(target, [val])
    return val
  }

}