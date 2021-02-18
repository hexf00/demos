import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './FieldPanel.module.scss'
import { TreeNode } from 'element-ui/types/tree'
import FieldItem, { IFieldItem } from './components/FieldItem/FieldItem'
import store from '@/store'
import { IApp } from '@/models/App/App'
import { ITable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'
import tableField from '@/models/Table/TableField'



@Component
export default class extends Vue {
  @Prop(Object) table!: ITable
  @Prop(Object) view!: IView

  get list(): IFieldItem[] {
    console.count('list')
    const { table, view } = this

    return view.fields.map(viewField => {
      const field = table.fields[viewField._id]
      return {
        id: viewField._id,
        label: field.name,
        table,
        field,
        view,
      }
    })
  }


  /** 判断拖拽是否允许放下 */
  isAllowDrop(raggingNode: TreeNode<string, IFieldItem>, dropNode: TreeNode<string, IFieldItem>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  /** 拖拽成功时候触发 */
  dropSuccess(raggingNode: TreeNode<string, IFieldItem>, dropNode: TreeNode<string, IFieldItem>, pos: 'before' | 'after') {
    // const { id } = raggingNode.data
    // const targetId = dropNode.data.id
    // const sorts = store.currentApp.tableSorts

    // const index = sorts.indexOf(id)
    // let tragetIndex = sorts.indexOf(targetId)

    // tragetIndex = pos === 'before' ? tragetIndex : tragetIndex + 1

    // sorts.splice(index, 1)
    // sorts.splice(tragetIndex, 0, id)
  }

  addField() {
    tableField.addField(this.table)
  }

  render(h: CreateElement) {
    const { list } = this

    return <div>
      <el-tree data={list}
        draggable={true} allow-drop={this.isAllowDrop}
        on={{
          'node-drop': this.dropSuccess,
        }}
        node-key="id" class={style.tree} default-expand-all scopedSlots={{
          default: ({ data }: { data: IFieldItem }) => {
            return <FieldItem data={data}></FieldItem>
          },
        }} />
      <el-button size="mini" on={{ click: () => this.addField() }}>新建字段</el-button>
    </div >
  }
}
