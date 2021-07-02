import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'
import { IViewSorter } from '@/models/View/ViewSorter'
import { ISortPanel } from './SortPanel'

export default class SortPanelService implements ISortPanel {
  constructor(public data: IViewSorter, public view: IView, public table: IJSONTable) {

  }

  getFields (field: string) {
    return this.view.fields
      .filter(it => !this.data.rules.find(rule => rule.field === it.id) || field === it.id)
      .map(field => this.table.fields[field.id])
  }

  bindSave (fn: (sort: IViewSorter) => void) {
    this.save = fn
  }

  save (sort: IViewSorter) {

  }
}
