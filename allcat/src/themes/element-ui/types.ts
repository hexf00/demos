import { NHeader } from './components/Header/types'
import { IViewMenuService } from './components/ui/ViewMenu/ViewMenu'

export namespace NLayout {
  export type IData = {
    //TODO:
  }

  export type ICallbacks = {
    validate: () => Promise<boolean>
  }

  export interface IView {
    /** 数据 */
    data: IData

    header: NHeader.IView

    viewMenuService: IViewMenuService

    destroy (): void
  }

  export interface IService {
    callbacks: Partial<ICallbacks>
    /** 数据 */
    data: IData
  }
}
