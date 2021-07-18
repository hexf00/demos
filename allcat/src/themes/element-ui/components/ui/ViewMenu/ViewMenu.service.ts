import { IJSONApp } from '@/models/appHelper'
import tableHelper from '@/models/Table/tableHelper'
import { IJSONTable } from '@/types/IJSONTable'
import JsonView, { IView } from '@/models/View/View'
import store from '@/store'
import { IViewMenuService } from './ViewMenu'

export default class ViewMenuService implements IViewMenuService {
  app: IJSONApp

  constructor() {
    this.app = store.currentApp as IJSONApp
  }

  createNewTable () {
    tableHelper.addTable(this.app)
  }

  createNewView (table: IJSONTable) {
    JsonView.addView(table)
  }

  removeTable (tb: IJSONTable) {
    tableHelper.removeTable(this.app, tb)
  }

  removeView (tb: IJSONTable, v: IView) {
    JsonView.removeView(tb, v)
  }
}
