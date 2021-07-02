import { Vue, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import ViewMenuService from './ViewMenu.service'
import { IJSONApp } from '@/models/App/App'
import style from './ViewMenu.module.scss'
import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'
import MenuItem, { IMenuItem } from './components/MenuItem/MenuItem'
import { TreeNode } from 'element-ui/types/tree'
import store from '@/store'
import qs from 'qs'

export interface IViewMenuService {
  app: IJSONApp
  createNewTable: () => void
  createNewView: (table: IJSONTable) => void
  removeTable: (table: IJSONTable) => void
  removeView: (table: IJSONTable, view: IView) => void
}

export interface ITreeNode {
  id: string
  label: string
  table: IJSONTable
  type: 'table' | 'view'
  view?: IView
  children?: ITreeNode[]
}
@Component
export default class extends Vue {
  service: IViewMenuService = new ViewMenuService()

  expandedTableIds = []

  get list (): ITreeNode[] {
    console.count('list')
    const { app } = this.service

    return app.tableSorts.map(tableId => {
      const table = app.tables[tableId]
      return {
        id: table.id,
        label: table.name,
        table: table,
        type: 'table',
        children: table.viewsSorts.map(viewId => {
          const view = table.views[viewId]
          return {
            id: view.id,
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
  isAllowDrop (raggingNode: TreeNode<string, ITreeNode>, dropNode: TreeNode<string, ITreeNode>, pos: 'prev' | 'inner' | 'next') {
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
  dropSuccess (raggingNode: TreeNode<string, ITreeNode>, dropNode: TreeNode<string, ITreeNode>, pos: 'before' | 'after') {
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

    if (index < tragetIndex) {
      tragetIndex--
    }

    sorts.splice(index, 1)
    sorts.splice(tragetIndex, 0, id)
  }

  /** 树节点被点击 */
  nodeClick (nodeData: ITreeNode) {
    const { table, view, type } = nodeData
    if (type === 'view') {
      store.currentTable = table
      store.currentView = view as IView
      const title = `${view?.name} - ${table.name}`

      const search = qs.stringify({
        tableId: table.id,
        viewId: view?.id,
      })
      history.replaceState('', title, `/?${search}`)
    }
  }

  render (h: CreateElement) {
    const { list, service, expandedTableIds } = this
    const currentNodeKey = store.currentView?.id
    return <div>
      <el-tree
        props={{
          data: list,
          defaultExpandedKeys: expandedTableIds,
          draggable: true,
          allowDrop: this.isAllowDrop,
          nodeKey: 'id',
          class: style.tree,
          defaultExpandAll: true,
          currentNodeKey: currentNodeKey,
        }}
        on={{
          'node-drop': this.dropSuccess,
          'node-click': this.nodeClick,
        }}
        scopedSlots={{
          default: ({ data }: { data: IMenuItem }) => {
            return <MenuItem data={data} viewMenuService={service} ></MenuItem>
          },
        }} />
      <el-button size="mini" on={{ click: () => service.createNewTable() }}>新建数据表</el-button>
    </div >
  }
}
