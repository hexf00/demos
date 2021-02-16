import store from '@/store'
import { ITable } from '../Table/Table'

export interface IApp {
  /** App主键 */
  _id: string
  /** App名称 */
  name: string
  /** App描述 */
  description: string
  /** App表配置 */
  tables: Record<string, ITable>
  /** App表排序 */
  tableSorts: string[]
}

/** 获取表数据结构 */
function get(appId = 'default_app'): IApp {
  if (store.apps[appId]) {
    return store.apps[appId]
  }

  const content = localStorage.getItem('app:' + appId)
  if (content) {
    const app: IApp = JSON.parse(content)
    store.apps[appId] = app
  } else {
    const app: IApp = {
      _id: appId,
      name: '新App',
      description: '',
      tables: {},
      tableSorts: [],
    }
    store.apps[appId] = app
  }

  return store.apps[appId]
}



/** 缓存表结构 */
function save(appId = 'default_app') {
  if (!store.apps[appId]) {
    return
  }
  const { _id } = store.apps[appId]
  localStorage.setItem('app:' + _id, JSON.stringify(store.apps[appId]))
}

const app = {
  get,
  save,
}

export default app