import { ApiService } from './../Api/service'
import WsManager from '@/plugins/WsManager'
import { IWs } from './types'

export class WsService implements IWs {
  constructor (public wsManager: WsManager, public api: ApiService) {

  }

  unsetFn: (() => void)[] = []

  actionProxy (data: any) {
    const { action } = data
    if (action === 'addRow') {
      this.api.addRow(data.data)
    } else {
      console.warn('未知动作', data)
    }
  }

  init () {
    const fn = this.actionProxy.bind(this)
    this.wsManager.on('actionProxy', fn)

    this.unsetFn.push(() => {
      this.wsManager.off('actionProxy', fn)
    })
  }
  unset () {
    this.unsetFn.forEach(fn => fn())
    this.wsManager.unset()
  }
}