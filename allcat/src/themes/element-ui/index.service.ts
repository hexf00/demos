import appHelper, { IJSONApp } from '@/models/appHelper'
import rowHelper from '@/models/Table/rowHelper'
import store from '@/store'
import qs from 'qs'
import papaparse from 'papaparse'
import ViewMenuService from './components/ui/ViewMenu/ViewMenu.service'

export default class IndexService {
  app: IJSONApp
  viewMenuService: ViewMenuService

  constructor() {
    this.app = appHelper.get()
    store.currentApp = this.app

    this.viewMenuService = new ViewMenuService(store.currentApp)
    this.routerInit()

    window.onbeforeunload = function () {
      console.log('自动保存')
      appHelper.save()
    }
    window.addEventListener('paste', this.onPaste)
  }

  record () {
    appHelper.record()
  }

  reset () {
    this.app = appHelper.get('record')

    store.currentApp = this.app
    this.viewMenuService = new ViewMenuService(store.currentApp)
    this.routerInit()
  }

  /** 粘贴处理 */
  onPaste (e: Event) {
    const event = e as ClipboardEvent
    const csvText = event.clipboardData?.getData('Text')
    const currentTable = store.currentTable
    const currentView = store.currentView
    if (!currentTable) {
      return
    }
    if (!currentView) {
      return
    }

    if (csvText) {
      const result: papaparse.ParseResult<string[]> = papaparse.parse(csvText)
      const csvRows = result.data
      csvRows.forEach(csvRow => {
        const row = rowHelper.addRow(currentTable)
        currentView.fields.forEach((field, index) => {
          row[field.id] = csvRow[index] || ''
        })
      })
    }
  }

  destroy () {
    window.onbeforeunload = null
    window.removeEventListener('paste', this.onPaste)
  }

  routerInit () {
    store.search = qs.parse(location.search.substr(1)) as Record<string, string>
    const { tableId, viewId } = store.search
    if (tableId) {
      const table = this.app.tables[tableId]
      store.currentTable = table
      if (viewId) {
        store.currentView = table.views[viewId]
      }
    }
  }

}