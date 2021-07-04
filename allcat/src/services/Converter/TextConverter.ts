import { IConverter } from '@/types/IConverterFactory'
import { IJSONTextField } from '@/types/IJSONTableField'

export default class TextConverter implements IConverter {

  constructor(public field: IJSONTextField) {

  }

  init () {

  }

  toText (target: IJSONTextField) {

  }
}