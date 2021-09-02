import WsManager from '@/plugins/WsManager'
import { ApiService } from '@/services/Api/service'
import { WsService } from '@/services/Ws/service'
import { IWs } from '@/services/Ws/types'
import { IApp, IAppData } from './types'

export default class AppService implements IApp {
  data!: IAppData

  /** 动态注册的函数 */
  callbacks = {}

  wsManager = new WsManager('ws://127.0.0.1:5920/message')
  apiService = new ApiService()
  wsService: IWs = new WsService(this.wsManager, this.apiService)

  constructor (data?: Partial<IAppData>) {
    this.setData(data === undefined ? {} : data)

  }

  /** 获取默认数据 */
  private getDefaultData (): IAppData {
    return {}
  }

  getData () {
    return this.data
  }

  setData (data: Partial<IAppData>) {
    this.data = { ...this.getDefaultData(), ...data }
  }
}
