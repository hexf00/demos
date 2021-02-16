import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'

import '@/themes/element-ui/element-ui'
import ViewMenu from '@/themes/element-ui/components/ui/ViewMenu/ViewMenu'
import TableView from '@/themes/element-ui/components/ui/TableView/TableView'

import style from './index.module.scss'
import IndexService from './index.service'
import { IApp } from '@/models/App/App'
import store from '@/store'

@Component
export default class extends Vue {
  service: { app: IApp } = new IndexService()
  store = store

  render(h: CreateElement) {
    const { name, description } = this.service.app
    const { currentTable, currentView } = this.store

    return <div class={style.bg}>
      <div class={style.top}>{name} {description}</div>
      <div class={style.editor}>
        <ViewMenu class={style.left}></ViewMenu>

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
