import { IJSONTableField, IJSONTextField } from '@/types/IJSONTableField'

export interface IConverterFactory {
  new(source: IJSONTableField): IConverter
}

export interface IConverter {
  // constructor: (field: IJSONTableField) => void
  field: IJSONTableField
  /** 执行初始化 */
  init: () => void
  /** 转换为文字类型 */
  toText: (target: IJSONTextField) => void
}
