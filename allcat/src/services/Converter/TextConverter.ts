import { IJSONTextField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class TextConverter extends BaseConverter {

  constructor(public field: IJSONTextField) {
    super(field)
  }

}