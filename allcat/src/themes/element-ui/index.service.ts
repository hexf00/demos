import JsonApp, { IJSONApp } from '@/models/App/App'
import JsonRow from '@/models/Table/Row'
import store from '@/store'
import qs from 'qs'
import papaparse from 'papaparse'

export default class IndexService {
  app: IJSONApp

  constructor() {
    this.app = JsonApp.get()
    store.currentApp = this.app
    this.routerInit();
    (window as unknown as { app: IJSONApp }).app = this.app


    window.onbeforeunload = function () {
      console.log('自动保存')
      JsonApp.save()
    }
    window.addEventListener('paste', this.onPaste)
  }

  /** 粘贴处理 */
  onPaste(e: Event) {
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
        const row = JsonRow.addRow(currentTable)
        currentView.fields.forEach((field, index) => {
          row[field.id] = csvRow[index] || ''
        })
      })
    }
  }

  destroy() {
    window.onbeforeunload = null
    window.removeEventListener('paste', this.onPaste)
  }

  routerInit() {
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