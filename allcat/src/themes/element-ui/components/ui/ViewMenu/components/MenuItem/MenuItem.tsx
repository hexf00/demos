import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IViewMenuService } from '../../ViewMenu'
import style from './MenuItem.module.scss'
import tableModel from '@/models/Table/tableHelper'
import { IJSONTable } from '@/types/IJSONTable'
import viewModel, { IView } from '@/models/View/View'
import { Input, MessageBox } from 'element-ui'

const typeName = { table: '数据表', view: '视图' }

export interface IMenuItem {
  /** 唯一标识符,可能el-tree会用来判断dom复用 */
  id: string
  label: string
  table: IJSONTable
  view: IView
  type: 'table' | 'view'
}

@Component
export default class MenuItem extends Vue {
  $refs!: {
    input: Input
  }

  @Prop(Object) data!: IMenuItem
  @Prop(Object) viewMenuService!: IViewMenuService

  /** 是否需要保存 */
  isNeedSave = false
  /** 是否处于编辑模式 */
  isEdit = false
  /** 编辑内容 */
  label = ''

  @Watch('isEdit', { immediate: true })
  onEdit (value: boolean) {
    if (value === true) {
      // 重置是否需要保存为需要
      this.isNeedSave = true
      this.$nextTick(() => {
        this.$refs.input.select()
      })
    }
  }

  changeName () {
    const name = this.label
    const { label, table, view, type } = this.data

    if (name === label /** 内容未发生变化 */
      || !this.isNeedSave /** 取消保存 */) {
      return
    }

    //更新需要保存的状态为不需要
    this.isNeedSave = false

    let isExist
    if (type === 'table') {
      const { app } = this.viewMenuService
      isExist = tableModel.checkTableNameIsExist(app, name)
    } else if (type === 'view') {
      isExist = viewModel.checkViewNameIsExist(table, name)
    }

    if (isExist) {
      MessageBox.alert(`名称为 ${name} 的${typeName[type]}已存在，请输入其它名称`, '重命名失败')
      return
    }

    if (type === 'table') {
      table.name = name
    } else if (type === 'view') {
      view.name = name
    }
  }

  render (h: CreateElement) {
    const { label, table, view, type } = this.data
    const service = this.viewMenuService

    if (this.isEdit) {
      return <el-input ref="input" size="mini" type="text" vModel={this.label} on={{
        blur: () => {
          this.changeName()
          this.isEdit = false
        },
      }} nativeOn={{
        click: (e: Event) => {
          e.stopPropagation()
        },
        keyup: (e: KeyboardEvent) => {
          const { code } = e
          if (code === 'Escape') {
            // 取消保存
            this.isNeedSave = false
            this.isEdit = false
          } else if (code === 'Enter') {
            // 保存
            this.changeName()
            this.isEdit = false
          }
        },
      }} />
    } else {
      return <div class={style.treeItem}>
        {/* 重命名 */}
        <div class={style.name}>
          {label}
        </div>
        {/* 操作区+右键菜单 */}
        <div class={style.opera}>
          {type === 'table'
            && <el-button on={{
              click (event: Event) {
                service.createNewView(table)
                event.stopPropagation()
              },
            }} type="text" size="mini">
              <i class="el-icon-plus"></i>
            </el-button>}

          <el-dropdown size="mini" trigger="click" on={{
            command: (command: string) => {
              if (command === 'remove') {
                MessageBox.confirm(`确认要删除${typeName[type]} ${label} 吗?`, `删除${typeName[type]}`, {
                  confirmButtonClass: 'el-button--danger',
                  confirmButtonText: '删除',
                })
                  .then(() => {
                    if (type === 'table') {
                      service.removeTable(table)
                    } else if (type === 'view') {
                      service.removeView(table, view)
                    }
                  })
              } else if (command === 'rename') {
                this.isEdit = true
                this.label = label
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
              <el-dropdown-item command="rename">重命名</el-dropdown-item>
              {!(type === 'view' && table.viewsSorts.length === 1)
                && <el-dropdown-item command="remove" divided>删除</el-dropdown-item>}
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div >
    }
  }
}
