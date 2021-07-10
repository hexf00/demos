import { EFieldType, IFieldValue, INumberValue, IRelationValue, ISelectValue, ITextValue } from '@/types/EType'
import { IJSONNumberField, IJSONRelationField, IJSONSelectField, IJSONTableField, IJSONTextField } from '@/types/IJSONTableField'
// TODO 暂时不实现接口

export default class BaseConverter {

  constructor(public field: IJSONTableField) {

  }

  convert (value: IFieldValue, target: IJSONTextField): ITextValue | undefined
  convert (value: IFieldValue, target: IJSONNumberField): INumberValue | undefined
  convert (value: IFieldValue, target: IJSONSelectField): ISelectValue | undefined
  convert (value: IFieldValue, target: IJSONRelationField): IRelationValue | undefined
  convert (value: IFieldValue, target: IJSONTableField): IFieldValue | undefined
  convert (value: IFieldValue, target: IJSONTableField) {
    switch (target.type) {
      case EFieldType.text: return this.toText(value, target)
      case EFieldType.number: return this.toNumber(value, target)
      case EFieldType.select: return this.toSelect(value, target)
      case EFieldType.relation: return this.toRelation(value, target)
    }
  }

  toText (value: IFieldValue, target: IJSONTextField): ITextValue | undefined {
    return
  }

  toNumber (value: IFieldValue, target: IJSONNumberField): INumberValue | undefined {
    return
  }

  toSelect (value: IFieldValue, target: IJSONSelectField): ISelectValue | undefined {
    return
  }

  toRelation (value: IFieldValue, target: IJSONRelationField): IRelationValue | undefined {
    return
  }
}