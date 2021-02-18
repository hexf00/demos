import app, { IApp } from '@/models/App/App'
import store from '@/store'
import qs from 'qs'
export default class IndexService {
  app: IApp

  constructor() {
    this.app = app.get()
    store.currentApp = this.app
    this.routerInit();
    (window as unknown as { app: IApp }).app = this.app


    window.onbeforeunload = function () {
      console.log('自动保存')
      app.save()
    }
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