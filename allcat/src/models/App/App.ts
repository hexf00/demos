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
}


/** 获取表数据结构 */
function get(id = 'default_app'): IApp {
  if (store.app) {
    return store.app
  }

  const content = localStorage.getItem('app:' + id)
  if (content) {
    const app: IApp = JSON.parse(content)
    store.app = app
  } else {
    const app: IApp = create(id)
    store.app = app
  }

  return store.app
}

/** 获取新表数据结构 */
function create(id: string): IApp {
  return {
    _id: id,
    name: '新App',
    description: '',
    tables: {},
  }
}

/** 缓存表结构 */
function save() {
  if (!store.app) {
    return
  }
  const { _id } = store.app
  localStorage.setItem('app:' + _id, JSON.stringify(store.app))
}

const app = {
  get,
  create,
  save,
}

export default app