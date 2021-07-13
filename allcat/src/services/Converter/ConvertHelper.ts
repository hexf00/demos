// 字段类型转换

import { EFieldType } from '@/types/EType'
import { IJSONNumberField, IJSONRelationField, IJSONSelectField, IJSONTableField, IJSONTextField } from '@/types/IJSONTableField'
import NumberConverter from './NumberConverter'
import RelationConverter from './RelationConverter'
import SelectConverter from './SelectConverter'
import TextConverter from './TextConverter'

export function ConverterFactory (source: IJSONTextField): TextConverter
export function ConverterFactory (source: IJSONNumberField): NumberConverter
export function ConverterFactory (source: IJSONSelectField): SelectConverter
export function ConverterFactory (source: IJSONRelationField): RelationConverter
export function ConverterFactory (source: IJSONTableField): TextConverter | NumberConverter | SelectConverter | RelationConverter
export function ConverterFactory (source: IJSONTableField) {
  switch (source.type) {
    case EFieldType.text: return new TextConverter(source)
    case EFieldType.number: return new NumberConverter(source)
    case EFieldType.select: return new SelectConverter(source)
    case EFieldType.relation: return new RelationConverter(source)
  }
}

/** 判断是否需要转换 */
export function checkIsNeedConvert (oldField: IJSONTableField, field: IJSONTableField): boolean {
  // 文本和数字类型不变化的时候不需要转换
  if (oldField.type === field.type && (field.type === EFieldType.text || field.type === EFieldType.number)) {
    return false
  }
  return true
}
