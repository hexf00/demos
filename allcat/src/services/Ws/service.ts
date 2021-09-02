import { ApiService } from './../Api/service'
import WsManager from '@/plugins/WsManager'
import { IWs } from './types'

export class WsService implements IWs {
  constructor (public wsManager: WsManager, public api: ApiService) {

  }
  init () {
    this.wsManager.on('addRow', this.api.addRow)

    console.log('WsService init ')
    console.log(this.wsManager, this.api)
  }
  unset () {
    this.wsManager.off('addRow', this.api.addRow)
    console.log('WsService unset11124')
    console.log(this.wsManager, this.api)

    this.wsManager.unset()
  }
}