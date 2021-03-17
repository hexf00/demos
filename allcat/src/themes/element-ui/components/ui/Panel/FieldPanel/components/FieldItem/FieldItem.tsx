import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './FieldItem.module.scss'
import tableModel, { IJSONTable } from '@/models/Table/Table'
import viewModel, { IView } from '@/models/View/View'
import EyeSwitch from '@/themes/element-ui/components/base/EyeSwitch/EyeSwitch'
import { MessageBox } from 'element-ui'
import JsonField, { IJSONTableField } from '@/models/Table/TableField'

export interface IFieldItem {
  /** 唯一标识符,可能el-tree会用来判断dom复用 */
  id: string
  label: string
  table: IJSONTable
  view: IView
  field: IJSONTableField
}

@Component
export default class FieldItem extends Vue {
  @Prop(Object) data!: IFieldItem

  created() {
    console.log('hmr count created', this.data.label)
  }

  destroyed() {
    console.log('hmr count destroyed', this.data.label)
  }

  render(h: CreateElement) {
    const { label, table, field } = this.data


    return <div class={style.treeItem}>
      {/* 重命名 */}
      <div class={style.name}>
        {label}
      </div>
      {/* 操作区+右键菜单 */}
      <div class={style.opera}>



        <EyeSwitch />
        <el-dropdown size="mini" trigger="click" on={{
          command: (command: string) => {
            if (command === 'remove') {
              MessageBox.confirm(`确认要删除字段 ${field.name} 吗? 字段删除后,所有记录对应的值将被一起删除`, '删除字段', {
                confirmButtonClass: 'el-button--danger',
                confirmButtonText: '确认删除',
              })
                .then(() => {
                  JsonField.removeField(table, field)
                })
            }
          },
        }}>
          <el-button on={{
            click(event: Event) {
              event.stopPropagation()
            },
          }} type="text" size="mini">
            <i class="el-icon-more"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
            <el-dropdown-item command="remove" divided>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div >
  }
}
