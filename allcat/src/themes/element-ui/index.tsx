import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenu from './components/ui/ViewMenu/ViewMenu'
import TableView from './components/ui/TableView/TableView'

import style from './index.module.scss'

@Component
export default class extends Vue {
  mounted() {

  }

  render(h: CreateElement) {
    return <div class={style.editor}>
      <ViewMenu class={style.left}></ViewMenu>
      <TableView></TableView>
    </div>
  }
}
