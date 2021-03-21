import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import JsonTable, { IJSONTable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'
import FieldListPanel from '../Panel/FieldListPanel/FieldListPanel'
import style from './TableView.module.scss'
import Clickoutside from '@/directives/clickoutside'
import JsonRow, { IJSONRow } from '@/models/Table/Row'
import Icon from '../../base/Icon/Icon'
import TableCell from './components/TableCell/TableCell'
import { TableColumn } from 'element-ui/types/table-column'


@Component({
  directives: { Clickoutside },
})
export default class extends Vue {
  @Prop(Object) table!: IJSONTable
  @Prop(Object) view!: IView

  mounted() {
  }

  isShowPopover = false
  get cols() {
    return this.view.fields.filter(it => it.isShow).map(it => this.table.fields[it.id])
  }
  get list() {
    return this.view.rowsSorts.map(it => this.table.rows[it])
  }

  render(h: CreateElement) {
    const { table, view } = this


    const directives = [{
      name: 'Clickoutside',
      value: ({ mouseup, mousedown }: { mouseup: MouseEvent; mousedown: MouseEvent }) => {
        if (!this.isShowPopover /** 未显示 */) {
          return
        }

        let parent: null | HTMLElement = mouseup.target as HTMLElement
        while (parent) {
          if (parent.classList.contains('el-dropdown-menu') /** 下拉框 */
            || parent.classList.contains('el-message-box__wrapper') /** 信息框的模态框 */
            || parent.classList.contains('el-popper') /** 字段配置面板 */
          ) {
            //下拉菜单的点击不关闭弹层
            return
          }

          // console.log('Clickoutside', parent.classList)
          parent = parent.parentElement
        }
        this.isShowPopover = false
      },
    }]

    return <div>
      <div>{table.name} {view.name}</div>
      <div>
        <el-popover
          value={this.isShowPopover}
          popper-class={style.popperClass}
          placement="bottom-start"
          width="280"
          trigger="manual">
          {this.isShowPopover && <FieldListPanel table={table} view={view}
            {...{ directives }}
          // 下面写法无效
          // directives={[{
          //   name: 'Clickoutside',
          //   value: () => {
          //     this.isShowPopover = false
          //   },
          // }]}
          />}
          <el-button slot="reference" on={{
            click: () => {
              this.isShowPopover = !this.isShowPopover
            },
          }}>Field Config</el-button>
        </el-popover>

        <el-button on={{
          click: () => {
            JsonRow.addRow(this.table)
          },
        }}>add Row</el-button>
      </div>
      <div>
        <el-table class={style.table} data={this.list} row-key="id" border={true}>
          {this.cols.map(it => (
            // 添加固定key 或者 slot都会导致排序失效、响应丢失
            // 随机key会导致其他值的变化也刷新dom
            <el-table-column prop={it.id} label={it.name} key={it.id + Math.random()} width="180"
              {...{
                scopedSlots: {
                  default: ({ column, row }: { column: TableColumn; row: IJSONRow }) => {
                    const field = table.fields[column.property]
                    return <TableCell row={row} field={field}></TableCell>
                  },
                  header: () => {
                    return <div class={style.th}>
                      <Icon value={it.type}></Icon>
                      {it.name}
                    </div>
                  },
                },
              }}
            >

            </el-table-column>
          ))}
        </el-table>
      </div>
    </div >
  }
}