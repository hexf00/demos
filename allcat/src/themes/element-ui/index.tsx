import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'

import '@/themes/element-ui/element-ui'
import ViewMenu from '@/themes/element-ui/components/ui/ViewMenu/ViewMenu'
import TableView from '@/themes/element-ui/components/ui/TableView'

import style from './index.module.scss'
import IndexService from './index.service'
import store from '@/store'
import { IJSONApp } from '@/models/appHelper'
import Header from './components/Header'
import { NLayout } from './types'

@Component
export default class extends Vue {

  $props!: {
    app: IJSONApp
  }

  @Prop() app!: IJSONApp

  service: NLayout.IView = new IndexService(this.app)

  store = store

  beforeDestroy () {
    this.service.destroy()
  }

  render (h: CreateElement) {
    const service = this.service
    const { currentTable, currentView } = this.store

    return <div class={style.bg}>
      <Header service={service.header} />
      <div class={style.editor}>
        <ViewMenu service={service.viewMenuService} class={style.left}></ViewMenu>

        <div class={style.right}>
          {
            currentTable && currentView
            && <TableView table={currentTable} view={currentView} />
          }
        </div>

      </div>
    </div>
  }
}
