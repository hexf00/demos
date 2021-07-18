import { IJSONApp } from '@/models/appHelper'
import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'
import Vue from 'vue'

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

Vue.observable(store)

export default store