import app, { IApp } from '@/models/App/App'
import table, { ITable } from '@/models/Table/Table'
import view, { IView } from '@/models/View/View'
import store from '@/store'
import { IViewMenuService } from './ViewMenu'

export default class ViewMenuService implements IViewMenuService {
  app: IApp

  constructor() {
    this.app = store.currentApp as IApp
  }

  createNewTable() {
    table.addTable(this.app)
  }

  createNewView(table: ITable) {
    view.addView(table)
  }

  deleteTable(tb: ITable) {
    table.removeTable(this.app, tb)
  }

  deleteView(tb: ITable, v: IView) {
    view.removeView(tb, v)
  }
}
