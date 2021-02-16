import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenuService from './ViewMenu.service'
import { IApp } from '@/models/App/App'
import style from './ViewMenu.module.scss'
import { ITable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'
import MenuItem, { IMenuItem } from './components/MenuItem/MenuItem'
import { TreeNode } from 'element-ui/types/tree'

export interface IViewMenuService {
  app: IApp
  createNewTable: () => void
  createNewView: (table: ITable) => void
  deleteTable: (table: ITable) => void
  deleteView: (table: ITable, view: IView) => void
}

export interface ITreeNode {
  id: string
  label: string
  table: ITable
  type: 'table' | 'view'
  view?: IView
  children?: ITreeNode[]
}
@Component
export default class extends Vue {
  service: IViewMenuService = new ViewMenuService()

  expandedTableIds = []

  get list(): ITreeNode[] {
    console.count('list')
    const { app } = this.service

    return app.tableSorts.map(tableId => {
      const table = app.tables[tableId]
      return {
        id: table._id,
        label: table.name,
        table: table,
        type: 'table',
        children: table.viewsSorts.map(viewId => {
          const view = table.views[viewId]
          return {
            id: view._id,
            label: view.name,
            table: table,
            view: view,
            type: 'view',
          }
        }),
      }
    })
  }


  /** 判断拖拽是否允许放下 */
  isAllowDrop(raggingNode: TreeNode<string, ITreeNode>, dropNode: TreeNode<string, ITreeNode>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }
    if (raggingNode.data.type !== dropNode.data.type) {
      return false
    }

    if (raggingNode.data.type === 'view') {
      if (raggingNode.data.table !== dropNode.data.table) {
        return false
      }
    }
    return true
  }

  /** 拖拽成功时候触发 */
  dropSuccess(raggingNode: TreeNode<string, ITreeNode>, dropNode: TreeNode<string, ITreeNode>, pos: 'before' | 'after') {
    const { id, table, type } = raggingNode.data
    const targetId = dropNode.data.id
    let sorts
    if (type === 'table') {
      sorts = this.service.app.tableSorts
    } else {
      sorts = table.viewsSorts
    }

    const index = sorts.indexOf(id)
    let tragetIndex = sorts.indexOf(targetId)

    tragetIndex = pos === 'before' ? tragetIndex : tragetIndex + 1

    sorts.splice(index, 1)
    sorts.splice(tragetIndex, 0, id)
  }

  render(h: CreateElement) {
    const { list, service, expandedTableIds } = this

    return <div>
      <el-tree data={list} default-expanded-keys={expandedTableIds}
        draggable={true} allow-drop={this.isAllowDrop}
        on={{
          'node-drop': this.dropSuccess,
        }}
        node-key="id" class={style.tree} default-expand-all scopedSlots={{
          default: ({ data }: { data: IMenuItem }) => {
            return <MenuItem data={data} viewMenuService={service} ></MenuItem>
          },
        }} />
      <el-button size="mini" on={{ click: () => service.createNewTable() }}>新建数据表</el-button>
    </div >
  }
}
