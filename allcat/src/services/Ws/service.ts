import { ApiService } from './../Api/service'
import WsManager from '@/plugins/WsManager'
import { IWs } from './types'

export class WsService implements IWs {
  constructor (public wsManager: WsManager, public api: ApiService) {

  }

  unsetFn: (() => void)[] = []

  async actionProxy (data: any) {
    const { action, _reqId } = data
    if (action === 'addRow') {
      const result = await this.api.addRow(data.data)
      this.wsManager.emit('message', { _reqId, result, code: 200 })
    } else if (action === 'findRow') {
      const result = await this.api.findRow(data.data)
      this.wsManager.emit('message', { _reqId, result, code: 200 })
    } else {
      console.warn('未知动作', data)
      this.wsManager.emit('message', { _reqId, result: null, code: 404 })
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