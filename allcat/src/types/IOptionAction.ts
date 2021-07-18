import { ISingleValue } from './EType'

interface IOptionEditAction {
  type: 'edit'
  value: ISingleValue
  newValue: string
}

interface IOptionDeleteAction {
  type: 'delete'
  value: ISingleValue
}

/** 转换过程中的选项动作，没有新增，是因为新增不会影响到已有数据 */
export type IOptionAction = IOptionEditAction | IOptionDeleteAction