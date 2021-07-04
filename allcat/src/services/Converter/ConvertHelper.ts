// 字段类型转换

import { EFieldType } from '@/types/EType'
import { IJSONTableField } from '@/types/IJSONTableField'
import { IConverterFactory } from '@/types/IConverterFactory'
import TextConverter from './TextConverter'

// 类型中心
// 每添加一种类型 都要实现到其它类型的转换方法
export default class ConvertHelper {
  // static registry: Partial<Record<EFieldType, IConverterFactory>> = {}
  static registry: Partial<{
    [EFieldType.text]: typeof TextConverter
    [EFieldType.number]: IConverterFactory
    [EFieldType.select]: IConverterFactory
    [EFieldType.relation]: IConverterFactory
    [EFieldType.relationReference]: IConverterFactory
    [EFieldType.script]: IConverterFactory
  }>
    = {
      [EFieldType.text]: TextConverter,
    }

  // static registerType (type: EFieldType, Convert: IConverterFactory) {
  //   this.registry[type] = Convert
  // }

  static factory (source: IJSONTableField) {

    if (source.type === 'text') {
      const ConverterFactory = this.registry[source.type]

      if (ConverterFactory) {
        // 可以考虑直接写在这个地方
        // 但是这样不能实现动态的工厂函数  TODO 如何实现动态呢
        return new ConverterFactory(source)
      }
    } else {
      const ConverterFactory = this.registry[source.type]
      if (ConverterFactory) {
        return new ConverterFactory(source)
      }
    }
    return undefined
  }

  static convert<T extends IJSONTableField> (source: T, target: IJSONTableField) {
    const converter = this.factory(source)
    if (!converter) {
      return
    }

    if (target.type === 'text') {
      converter.toText(target)
    }
  }

  static init (field: IJSONTableField) {
    const converter = this.factory(field)
    if (!converter) {
      return
    }
    converter.init()
  }
}

// ConvertHelper.registerType()