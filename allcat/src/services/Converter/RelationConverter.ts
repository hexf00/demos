import { IJSONApp } from '@/models/appHelper'
import { IFieldValue, INumberValue, ITextValue } from '@/types/EType'
import { IJSONNumberField, IJSONRelationField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class RelationConverter extends BaseConverter {

  constructor(public app: IJSONApp, public field: IJSONRelationField) {
    super(app, field)
  }

  toText (value: IFieldValue): ITextValue {
    return String(value)
  }

  toNumber (value: IFieldValue, target: IJSONNumberField): INumberValue | undefined {
    const newValue = Number(value)
    return isNaN(newValue) ? undefined : newValue
  }
}