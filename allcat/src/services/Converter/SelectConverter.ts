import { IJSONSelectField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class SelectConverter extends BaseConverter {

  constructor(public field: IJSONSelectField) {
    super(field)
  }

}