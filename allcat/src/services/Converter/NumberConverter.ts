import { IJSONApp } from '@/models/appHelper'
import { INumberValue } from '@/types/EType'
import { IJSONNumberField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class NumberConverter extends BaseConverter {

  constructor(public app: IJSONApp, public field: IJSONNumberField) {
    super(app, field)
  }

  toNumber (value: INumberValue, target: IJSONNumberField): INumberValue | undefined {
    return value
  }

}