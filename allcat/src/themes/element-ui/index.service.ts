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
    // 文本框激活时不触发行粘贴
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return
    }

    if (csvText) {
      const result: papaparse.ParseResult<string[]> = papaparse.parse(csvText)
      const csvRows = result.data
      csvRows.forEach(csvRow => {
        const row = rowHelper.addRow(currentTable)
        currentView.fields.forEach((field, index) => {
          row[field.id] = csvRow[index] || undefined
        })
      })
    }
  }

  destroy () {
    window.onbeforeunload = null
    window.removeEventListener('paste', this.onPaste)
  }

  // TODO:可删除
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

  export () {
    const link = document.createElement('a')
    const body = document.querySelector('body')!

    link.href = 'data:application/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.app, null, 1))
    link.download = 'app.json'

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)
  }

}