import { IJSONApp } from '@/models/appHelper'
import tableHelper from '@/models/Table/tableHelper'
import { IJSONTable } from '@/types/IJSONTable'
import JsonView, { IView } from '@/models/View/View'
import { IViewMenuService } from './ViewMenu'

export default class ViewMenuService implements IViewMenuService {
  constructor(public app: IJSONApp) {
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
