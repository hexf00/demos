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

  selected: IJSONRow[] = []
  mounted() {
  }

  isShowPopover = false

  get colsWidth() {
    const result: Record<string, number> = {}
    this.view.fields.forEach(it => {
      result[it.id] = it.width || 180
    })
    return result
  }
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
        <el-button size="mini" on={{
          click: () => {
            JsonRow.addRow(this.table)
          },
        }}>Add Row</el-button>

        <el-button  {...{
          class: style.btn,
          props: {
            size: 'mini',
            disabled: this.selected.length === 0,
          },
          on: {
            click: () => {
              JsonRow.removeRow(this.table, this.selected)
            },
          },
        }}>Remove Rows</el-button>

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
          <el-button size="mini" slot="reference" on={{
            click: () => {
              this.isShowPopover = !this.isShowPopover
            },
          }}>Field Config</el-button>
        </el-popover>
      </div>
      <div>
        <el-table
          {...{
            props: {
              data: this.list,
              'row-key': 'id',
              border: true,
              'max-height': '400', //流体高度
            },
            on: {
              /** 右键点击 */
              'row-contextmenu': (row: IJSONRow, column: TableColumn, event: MouseEvent) => {
                event.preventDefault() //屏蔽系统右键菜单
              },
              /** 选中项变化 */
              'selection-change': (rows: IJSONRow[]) => {
                this.selected = rows
              },
              /** 列宽度改变 */
              'header-dragend': (newWidth: number, oldWidth: number, column: TableColumn, event: MouseEvent) => {
                // console.log(column.property, newWidth)
                const viewField = this.view.fields.find(it => it.id === column.property)
                if (viewField) {
                  viewField.width = Math.ceil(newWidth)
                }
              },
            },
          }}
        >
          <el-table-column
            type="selection"
            width="36">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          {this.cols.map(it => (
            <el-table-column
              props={{
                prop: it.id,
                label: it.name,
                width: this.colsWidth[it.id],
              }}
              scopedSlots={{
                default: (args: { column: TableColumn; row: IJSONRow }) => {
                  const { column, row } = args
                  const field = table.fields[column.property]
                  return <TableCell row={row} field={field} width={this.colsWidth[it.id]}></TableCell>
                },
                header: (args: { column: TableColumn }) => {
                  // TODO 添加getter
                  console.log(args.column.property)
                  return <div class={style.th}>
                    <Icon value={it.type}></Icon>
                    {it.name}
                  </div>
                },
              }}
            >

            </el-table-column>
          ))}
        </el-table>
      </div>
      <div class={style.log}>
        <pre>{JSON.stringify(table, null, 2)}</pre>
      </div>
    </div >
  }
}