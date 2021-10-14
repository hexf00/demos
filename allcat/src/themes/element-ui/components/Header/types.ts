export namespace NHeader {
  export type IData = {
    name: string
    description: string
  }

  export type ICallbacks = {
    validate: () => Promise<boolean>
  }

  export interface IView {
    export (): void
    /** 数据 */
    data: IData
  }

  export interface IService {
    callbacks: Partial<ICallbacks>
    /** 数据 */
    data: IData
  }
}
