import { IJSONApp } from '@/models/appHelper'
import { ITextValue } from '@/types/EType'
import { IJSONTextField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class TextConverter extends BaseConverter {

  constructor(public app: IJSONApp, public field: IJSONTextField) {
    super(app, field)
  }

  toText (value: ITextValue): ITextValue {
    return value
  }

}