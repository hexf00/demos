import { IJSONApp } from '@/models/App'
import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'

export interface IStore {
  apps: Record<string, IJSONApp>
  currentApp: IJSONApp | null
  currentTable: IJSONTable | null
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