import store from '@/store'
import { IJSONTable } from '../types/IJSONTable'

export interface IJSONApp {
  /** App主键 */
  id: string
  /** App名称 */
  name: string
  /** App描述 */
  description: string
  /** App表配置 */
  tables: Record<string, IJSONTable>
  /** App表排序 */
  tableSorts: string[]
}

/** 获取表数据结构 */
function get (appId = 'default_app'): IJSONApp {
  if (store.apps[appId]) {
    return store.apps[appId]
  }

  const content = localStorage.getItem('app:' + appId)
  if (content) {
    const app: IJSONApp = JSON.parse(content)
    store.apps[appId] = app
  } else {
    const app: IJSONApp = {
      id: appId,
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
function save (appId = 'default_app') {
  if (!store.apps[appId]) {
    return
  }
  const { id: _id } = store.apps[appId]
  localStorage.setItem('app:' + _id, JSON.stringify(store.apps[appId]))
}

const JsonApp = {
  get,
  save,
}

export default JsonApp