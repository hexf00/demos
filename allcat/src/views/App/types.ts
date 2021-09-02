import { IJSONApp } from './../../models/appHelper'
import { IWs } from './../../services/Ws/types'
export type IAppData = {
  // TODO: 添加数据定义
}

/** 组件接口 */
export interface IApp {
  /** 数据 */
  data: IAppData

  app: IJSONApp

  wsService: IWs

  /** 设置数据 */
  setData (data: Partial<IAppData>): void
}
