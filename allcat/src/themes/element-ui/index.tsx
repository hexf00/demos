import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'

import '@/themes/element-ui/element-ui'
import ViewMenu from '@/themes/element-ui/components/ui/ViewMenu/ViewMenu'
import TableView from '@/themes/element-ui/components/ui/TableView'

import style from './index.module.scss'
import IndexService from './index.service'
import store from '@/store'
import { IJSONApp } from '@/models/appHelper'

@Component
export default class extends Vue {

  $props!: {
    app: IJSONApp
  }

  @Prop() app!: IJSONApp

  service = new IndexService(this.app)

  store = store

  beforeDestroy () {
    this.service.destroy()
  }

  render (h: CreateElement) {
    const { name, description } = this.service.app
    const { currentTable, currentView } = this.store

    return <div class={style.bg}>
      <div class={style.top}>{name} {description}
        <el-button>导入</el-button>
        <el-button onclick={() => this.service.export()}>导出</el-button>
      </div>
      <div class={style.editor}>
        <ViewMenu service={this.service.viewMenuService} class={style.left}></ViewMenu>

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
