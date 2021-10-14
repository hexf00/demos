import store from '@/store'
import { NHeader } from './types'

export default class HeaderService implements NHeader.IView, NHeader.IService {
  data!: NHeader.IData

  /** 动态注册的函数 */
  callbacks: Partial<NHeader.ICallbacks> = {}

  constructor (data?: Partial<NHeader.IData>) {
    this.setData(data === undefined ? {} : data)
  }

  /** 获取默认数据 */
  private getDefaultData (): NHeader.IData {
    return {
      name: 'App',
      description: 'app描述',
    }
  }

  /** 获取数据 */
  getData () {
    return this.data
  }

  /** 设置数据 */
  setData (data: Partial<NHeader.IData>) {
    this.data = { ...this.getDefaultData(), ...data }
  }

  export () {
    const app = store.currentApp

    const link = document.createElement('a')
    const body = document.querySelector('body')!

    link.href = 'data:application/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(app, null, 1))
    link.download = 'app.json'

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)
  }
}
