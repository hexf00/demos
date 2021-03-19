import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import { TreeNode } from 'element-ui/types/tree'
import FieldItem, { IFieldItem } from './components/FieldItem/FieldItem'
import store from '@/store'
import { IJSONApp } from '@/models/App/App'
import { IJSONTable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'
import JsonField, { IJSONTableField } from '@/models/Table/TableField'
import FieldItemPanel from '../FieldItemPanel/FieldItemPanel'



@Component
export default class FieldListPanel extends Vue {
  @Prop(Object) table!: IJSONTable
  @Prop(Object) view!: IView

  /** 是否显示字段配置面板 */
  showFieldItemPanel = false

  /** 当前编辑状态的字段Model */
  fieldFormModel: IJSONTableField | null = null

  /** 当前编辑状态的字段 */
  currentField: IJSONTableField | null = null

  get list(): IFieldItem[] {
    console.count('list')
    const { table, view } = this

    return view.fields.map(viewField => {
      const field = table.fields[viewField.id]
      return {
        id: field.id,
        label: field.name,
        table,
        field,
        view,
        viewField: viewField,
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
    const { id } = raggingNode.data
    const targetId = dropNode.data.id
    const fields = store.currentView?.fields

    if (fields) {
      const current = fields.find(it => it.id === id)
      if (!current) return
      const index = fields.indexOf(current)
      let tragetIndex = fields.findIndex(it => it.id === targetId)

      tragetIndex = pos === 'before' ? tragetIndex : tragetIndex + 1

      fields.splice(index, 1)
      fields.splice(tragetIndex, 0, current)
    }
  }

  addField() {
    JsonField.addField(this.table)
  }

  render(h: CreateElement) {
    console.count('hmr count render FieldPanel')
    const { list } = this
    const scopedSlots = {
      default: ({ data }: { data: IFieldItem }) => {
        return <FieldItem on={{
          showFieldItemPanel: (field: IJSONTableField) => {
            this.showFieldItemPanel = true
            this.currentField = field
            this.fieldFormModel = { ...field }
          },
        }} data={data}></FieldItem>
      },
    }

    return <div class={style.fieldPanel}>
      <el-popover
        value={this.showFieldItemPanel}
        trigger="manual"
        placement="right-start"
        visible-arrow={false}
        width="280">
        {this.fieldFormModel && <FieldItemPanel on={{
          submit: (field: IJSONTableField) => {
            Object.assign(this.currentField, this.fieldFormModel)
            this.showFieldItemPanel = false
            this.fieldFormModel = null
            this.currentField = null
          },
          cancel: () => {
            this.showFieldItemPanel = false
            this.fieldFormModel = null
            this.currentField = null
          },
        }} field={this.fieldFormModel} ></FieldItemPanel>}
        <div slot="reference"></div>
      </el-popover>
      <el-tree data={list}
        draggable={true} allow-drop={this.isAllowDrop}
        on={{
          'node-drop': this.dropSuccess,
        }}
        {...{ scopedSlots }}
        node-key="id" class={style.tree} default-expand-all />
      <el-button size="mini" on={{ click: () => this.addField() }}>新建字段</el-button>
    </div >
  }
}
