import { IJSONRelationField } from '@/types/IJSONTableField'
import BaseConverter from './BaseConverter'

export default class RelationConverter extends BaseConverter {

  constructor(public field: IJSONRelationField) {
    super(field)
  }

}