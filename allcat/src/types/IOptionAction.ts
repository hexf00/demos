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

//用于比对两个数组
export namespace NItemAction {
  export enum Type {
    Add = 'add',
    Delete = 'delete'
  }
  export interface Add {
    type: Type.Add
    value: ISingleValue
  }
  export interface Delete {
    type: Type.Delete
    value: ISingleValue
  }
}
export type IItemAction = NItemAction.Add | NItemAction.Delete