import { Vue, Prop, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from '../../index.module.scss'
import { IJSONRow } from '@/types/IJSONRow'
import Icon from '../../../../base/Icon/Icon'
import TableCell from '../TableCell'
import TableViewService from '../../service'
import { TableColumn } from 'element-ui/types/table-column'
import { sortFun } from '@/libs/sort'

@Component
export default class SimpleTable extends Vue {
  $props!: {
    service: TableViewService
  }

  @Prop(Object) service!: TableViewService

  get table () {
    return this.service.table
  }

  get view () {
    return this.service.view
  }

  get colsWidth () {
    const result: Record<string, number> = {}
    this.view.fields.forEach(it => {
      result[it.id] = it.width || 180
    })
    return result
  }
  get cols () {
    return this.view.fields.filter(it => it.isShow).map(it => this.table.fields[it.id])
  }
  get list () {
    if (this.view?.sort?.rules) {
      const rules = this.view.sort.rules.filter(it => it.field)

      const data = this.view.rowsSorts.map(it => this.table.rows[it])

      data.sort(sortFun(rules))
      return data
    }

    return this.view.rowsSorts.map(it => this.table.rows[it])

  }

  render (h: CreateElement) {
    const { table } = this

    return <el-table
      {...{
        props: {
          data: this.list,
          'row-key': 'id',
          border: true,
          'max-height': '470', //流体高度
        },
        on: {
          /** 右键点击 */
          'row-contextmenu': (row: IJSONRow, column: TableColumn, event: MouseEvent) => {
            event.preventDefault() //屏蔽系统右键菜单
          },
          /** 选中项变化 */
          'selection-change': (rows: IJSONRow[]) => {
            this.service.selected = rows
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
              // console.log(args.column.property)
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

  }
}