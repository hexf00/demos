import app, { IJSONApp } from '@/models/App/App'
import table, { IJSONTable } from '@/models/Table/Table'
import view, { IView } from '@/models/View/View'
import store from '@/store'
import { IViewMenuService } from './ViewMenu'

export default class ViewMenuService implements IViewMenuService {
  app: IJSONApp

  constructor() {
    this.app = store.currentApp as IJSONApp
  }

  createNewTable() {
    table.addTable(this.app)
  }

  createNewView(table: IJSONTable) {
    view.addView(table)
  }

  deleteTable(tb: IJSONTable) {
    table.removeTable(this.app, tb)
  }

  deleteView(tb: IJSONTable, v: IView) {
    view.removeView(tb, v)
  }
}
