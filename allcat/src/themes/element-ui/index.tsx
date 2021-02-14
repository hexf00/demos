import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenu from './components/ui/ViewMenu/ViewMenu'
import TableView from './components/ui/TableView/TableView'

import style from './index.module.scss'
import IndexService from './index.service'
import { IApp } from '@/models/App/App'

@Component
export default class extends Vue {
  service: { app: IApp } = new IndexService()

  render(h: CreateElement) {
    const { name, description } = this.service.app
    return <div>
      <div>{name} {description}</div>
      <div class={style.editor}>
        <ViewMenu class={style.left}></ViewMenu>
        <TableView class={style.right}></TableView>
      </div>
    </div>
  }
}
