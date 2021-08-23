import { Vue, Prop, Component } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import { IJSONRow } from '@/types/IJSONRow'
import Icon from '../../../../base/Icon/Icon'
import TableCell from '../TableCell'
import TableViewService from '../../service'
import { TableColumn } from 'element-ui/types/table-column'

@Component
export default class VexCustomTable extends Vue {
  $props!: {
    service: TableViewService
  }

  $refs!: {
    xTable1: any
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

      data.sort((itemA, itemB) => {
        const result = rules.reduce((result, rule, index) => {
          const { field, type } = rule
          const [a, b] = type === 'asc' ? [itemA, itemB] : [itemB, itemA]
          if (typeof a === 'number' && typeof b === 'number') {
            // TODO:确认规则是否准确
            result += (rules.length - index) * (a > b ? 1 : -1)
          } else {
            result += (rules.length - index) * (String(a[field]).localeCompare(String(b[field])))
          }
          return result
        }, 0)

        return result
      })

      return data
    }

    return this.view.rowsSorts.map(it => this.table.rows[it])

  }

  mounted () {
    // this.$refs.xTable1.loadData(this.list)
  }

  render (h: CreateElement) {
    const { table } = this.service

    return <vxe-table
      ref="xTable1"
      {...{
        props: {
          size: 'mini',
          border: true,
          'show-overflow': true,
          'highlight-hover-row': true,
          height: 470,
          data: this.list,
          'row-key': true,
          'row-id': 'id',
          // 'scroll-x': { gt: 10 },
          /** 虚拟滚动 */
          'scroll-y': { gt: 10 },
          /** 可调整宽度 */
          resizable: true,

        },
        on: {
          'checkbox-all': ({ records }: { records: IJSONRow[] }) => {
            this.service.selected = records
          },
          /** 选中项变化 */
          'checkbox-change': ({ records }: { records: IJSONRow[] }) => {
            this.service.selected = records
          },
          /** 列宽度改变 */
          'resizable-change': (args: { column: { property: string }; cell: HTMLElement }) => {
            const viewField = this.view.fields.find(it => it.id === args.column.property)
            console.log(args)
            if (viewField) {
              viewField.width = Math.ceil(args.cell.offsetWidth)
            }
          },
        },
      }}
    >
      <vxe-table-column
        type="checkbox"
        width="36">
      </vxe-table-column>
      <vxe-table-column type="seq" width="50"></vxe-table-column>
      {this.cols.map(it => (
        <vxe-table-column
          props={{
            field: it.id,
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

        </vxe-table-column>
      ))}
    </vxe-table>
  }
}