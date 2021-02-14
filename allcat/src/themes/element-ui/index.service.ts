import app, { IApp } from '@/models/App/App'

export default class IndexService {
  app: IApp

  constructor() {
    this.app = app.get()

    window.onbeforeunload = function () {
      console.log('自动保存')
      app.save()
    }
  }

}