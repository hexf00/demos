import JsonApp, { IJSONApp } from '@/models/App/App'
import JsonTable, { IJSONTable } from '@/models/Table/Table'
import JsonView, { IView } from '@/models/View/View'
import store from '@/store'
import { IViewMenuService } from './ViewMenu'

export default class ViewMenuService implements IViewMenuService {
  app: IJSONApp

  constructor() {
    this.app = store.currentApp as IJSONApp
  }

  createNewTable() {
    JsonTable.addTable(this.app)
  }

  createNewView(table: IJSONTable) {
    JsonView.addView(table)
  }

  removeTable(tb: IJSONTable) {
    JsonTable.removeTable(this.app, tb)
  }

  removeView(tb: IJSONTable, v: IView) {
    JsonView.removeView(tb, v)
  }
}
