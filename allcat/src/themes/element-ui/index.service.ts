import app, { IApp } from '@/models/App/App'
import store from '@/store'

export default class IndexService {
  app: IApp

  constructor() {
    this.app = app.get()
    store.currentApp = this.app;
    (window as unknown as { app: IApp }).app = this.app

    window.onbeforeunload = function () {
      console.log('自动保存')
      app.save()
    }
  }

}