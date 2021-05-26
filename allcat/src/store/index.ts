import { IApp } from '@/models/App/App'
import { ITable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'

export interface IStore {
  apps: Record<string, IApp>
  currentApp: IApp | null
  currentTable: ITable | null
  currentView: IView | null
  search: {
    tableId?: string
    viewId?: string
  }
}

const store: IStore = {
  apps: {},
  currentApp: null,
  currentTable: null,
  currentView: null,
  search: {},
}

export default store