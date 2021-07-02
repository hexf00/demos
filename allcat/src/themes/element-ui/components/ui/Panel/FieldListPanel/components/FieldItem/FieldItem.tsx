import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './FieldItem.module.scss'
import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'
import EyeSwitch from '@/themes/element-ui/components/base/EyeSwitch/EyeSwitch'
import { MessageBox } from 'element-ui'
import fieldHelper from '@/models/Table/fieldHelper'
import { IJSONTableField } from '@/types/IJSONTableField'
import { IJSONViewField } from '@/models/View/ViewField'
import Icon from '@/themes/element-ui/components/base/Icon/Icon'

export interface IFieldItem {
  /** 唯一标识符,可能el-tree会用来判断dom复用 */
  id: string
  viewField: IJSONViewField
  label: string
  table: IJSONTable
  view: IView
  field: IJSONTableField
}

@Component
export default class FieldItem extends Vue {
  @Prop(Object) data!: IFieldItem

  created () {
    console.log('hmr count created', this.data.label)
  }

  destroyed () {
    console.log('hmr count destroyed', this.data.label)
  }

  render (h: CreateElement) {

    const { label, viewField, table, field } = this.data

    return <div class={style.treeItem}>
      {/* 重命名 */}

      <Icon value={field.type}></Icon>
      <div class={style.name}>
        {label}
      </div>
      {/* 操作区+右键菜单 */}
      <div class={style.opera}>



        <EyeSwitch vModel={viewField.isShow} />
        <el-dropdown size="mini" trigger="click" on={{
          command: (command: string) => {
            if (command === 'remove') {
              MessageBox.confirm(`确认要删除字段 ${field.name} 吗? 字段删除后,所有记录对应的值将被一起删除`, '删除字段', {
                confirmButtonClass: 'el-button--danger',
                confirmButtonText: '确认删除',
              })
                .then(() => {
                  fieldHelper.removeField(table, field)
                })
            } else if (command === 'edit') {
              this.$emit('showFieldItemPanel', field)
            }
          },
        }}>
          <el-button on={{
            click (event: Event) {
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
