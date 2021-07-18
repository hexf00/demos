import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import { TreeNode } from 'element-ui/types/tree'
import FieldItem, { IFieldItem } from './components/FieldItem/FieldItem'
import store from '@/store'
import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'
import fieldHelper from '@/models/Table/fieldHelper'
import { IJSONTableField } from '@/types/IJSONTableField'
import FieldItemPanel from '../FieldItemPanel/FieldItemPanel'
import { checkIsNeedConvert, ConverterFactory } from '@/services/Converter/ConvertHelper'
import FieldListPanelService from './service'
import { EFieldType, ISelectValue } from '@/types/EType'
import { IOptionAction } from '@/types/IOptionAction'
import libs from '@/libs'
import SelectManager from '@/services/SelectManager'
@Component
export default class FieldListPanel extends Vue {
  $props!: {
    service: FieldListPanelService
    table: IJSONTable
    view: IView
  }
  @Prop(Object) service!: FieldListPanelService
  @Prop(Object) table!: IJSONTable
  @Prop(Object) view!: IView

  /** 当前编辑状态的字段Model */
  fieldFormModel: IJSONTableField | null = null

  /** 当前编辑状态的字段 */
  currentField: IJSONTableField | null = null

  get list (): IFieldItem[] {
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
  isAllowDrop (raggingNode: TreeNode<string, IFieldItem>, dropNode: TreeNode<string, IFieldItem>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  /** 拖拽成功时候触发 */
  dropSuccess (raggingNode: TreeNode<string, IFieldItem>, dropNode: TreeNode<string, IFieldItem>, pos: 'before' | 'after') {
    const { id } = raggingNode.data
    const targetId = dropNode.data.id
    const fields = store.currentView?.fields

    if (fields) {
      const current = fields.find(it => it.id === id)
      if (!current) return
      const index = fields.indexOf(current)
      let tragetIndex = fields.findIndex(it => it.id === targetId)

      tragetIndex = pos === 'before' ? tragetIndex : tragetIndex + 1

      if (index < tragetIndex) {
        tragetIndex--
      }

      fields.splice(index, 1)
      fields.splice(tragetIndex, 0, current)
    }
  }

  addField () {
    fieldHelper.addField(this.table)
  }

  render (h: CreateElement) {
    console.count('hmr count render FieldPanel')
    const { list } = this
    return <div class={style.fieldPanel}>
      <el-popover
        value={this.service.isShowFieldItemPanel}
        trigger="manual"
        placement="right-start"
        visible-arrow={false}
        width="280">
        {this.fieldFormModel && <FieldItemPanel on={{
          submit: (field: IJSONTableField) => {
            const oldField = this.currentField!

            if (checkIsNeedConvert(oldField, field)) {

              if (field.type === EFieldType.select) {

                const oldOptions = oldField.type === EFieldType.select ? oldField.selectOptions : []
                const converter = ConverterFactory(oldField)

                // 通过对比新老option的 label 和 value  分析改动
                const actions: Record<string, IOptionAction> = SelectManager.diff(oldOptions, field.selectOptions)

                // 选项唯一处理，需要在diff之后，在数据转换之前
                libs.arrUniq(field.selectOptions, (a, b) => a.label === b.label)
                  .forEach(it => {
                    // value同步为label，保持数据完整性
                    it.value = it.label
                  })

                // 数据转换
                Object.values(this.table.rows).forEach(row => {
                  const oldVal = row[oldField.id]
                  if (oldVal !== undefined) {
                    row[oldField.id] = converter.toSelect(oldVal as ISelectValue, field, actions)
                  }
                })
              } else {
                const converter = ConverterFactory(oldField)
                // 数据转换
                Object.values(this.table.rows).forEach(row => {
                  const oldVal = row[oldField.id]
                  if (oldVal !== undefined) {
                    row[oldField.id] = converter.convert(oldVal, field)
                  }
                })
              }
            }

            Object.assign(this.currentField, this.fieldFormModel)
            this.service.isShowFieldItemPanel = false
            this.fieldFormModel = null
            this.currentField = null
          },
          cancel: () => {
            this.service.isShowFieldItemPanel = false
            this.fieldFormModel = null
            this.currentField = null
          },
          'update:field': (field: IJSONTableField) => {
            this.fieldFormModel = field
          },
        }} field={this.fieldFormModel} table={this.table} ></FieldItemPanel>}
        <div slot="reference"></div>
      </el-popover>
      <el-tree
        props={{
          data: list,
          draggable: true,
          allowDrop: this.isAllowDrop,
          nodeKey: 'id',
          class: style.tree,
          defaultExpandAll: true,
        }}
        on={{
          'node-drop': this.dropSuccess,
        }}
        scopedSlots={{
          default: ({ data }: { data: IFieldItem }) => {
            return <FieldItem on={{
              showFieldItemPanel: (field: IJSONTableField) => {
                this.service.isShowFieldItemPanel = true
                this.currentField = field
                this.fieldFormModel = JSON.parse(JSON.stringify(field))
              },
            }} data={data}></FieldItem>
          },
        }} />
      <el-button size="mini" on={{ click: () => this.addField() }}>新建字段</el-button>
    </div >
  }
}
