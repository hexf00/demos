import { INumberValue } from '@/types/EType'
import { IJSONNumberField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class NumberConverter extends BaseConverter {

  constructor(public field: IJSONNumberField) {
    super(field)
  }

  toNumber (value: INumberValue, target: IJSONNumberField): INumberValue | undefined {
    return value
  }

}