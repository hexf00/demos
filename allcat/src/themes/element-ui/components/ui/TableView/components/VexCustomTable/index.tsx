import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import style from './index.module.scss'
import { IJSONRow } from '@/types/IJSONRow'
import Icon from '../../../../base/Icon/Icon'
import TableCell from '../TableCell'
import TableViewService from '../../service'
import { TableColumn } from 'element-ui/types/table-column'
import { sortFun } from '@/libs/sort'
import { findParent } from '@/libs/domHelper'

@Component
export default class VexCustomTable extends Vue {
  $refs!: {
    xTable1: any
  }
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
    console.log('发生重新排序')
    if (this.view?.sort?.rules) {
      const rules = this.view.sort.rules.filter(it => it.field).map(it => {
        return {
          ...it,
          field: this.table.fields[it.field],
        }
      })
      const data = this.view.rowsSorts.map(it => this.table.rows[it])

      data.sort(sortFun(rules))

      return data
    }
    return this.view.rowsSorts.map(it => this.table.rows[it])
  }

  rows: IJSONRow[] = []

  /** 上次的排序缓存 */
  sortCache: IJSONRow[] = []
  /** 是否需要刷新排序 */
  isNeedSort = false

  /** 
   * 需要手动控制排序渲染的时机，所以computed后还需要再判断处理
   */
  @Watch('list', { immediate: true })
  onSort (rows: IJSONRow[], oldRows: IJSONRow[] | undefined) {

    let oldIndex
    const inEditRow = this.service.inEditRow

    console.log('编辑中', inEditRow)
    if (inEditRow && oldRows) {
      oldIndex = oldRows.indexOf(inEditRow)
    }

    if (oldIndex !== undefined && inEditRow) {
      const newIndex = rows.indexOf(inEditRow)

      if (newIndex !== oldIndex) {
        console.log('排序发生变化，但是进行缓存')
        this.sortCache = rows
        this.isNeedSort = true
        return
      }
    }

    this.rows = rows
  }

  onclick (e: MouseEvent) {
    type VueHTMLElement = HTMLElement & { __vue__?: Vue; parentElement?: VueHTMLElement | null | undefined }
    const li = findParent({
      node: e.target as VueHTMLElement,
      parentKey: 'parentElement',
      findCondition: (node) => {
        // 对于组件直接返回组件，dom __vue__ 只能存储一个vue组件，所以这里判断并不准确

        // 主要目的是找到 行数据
        return node.__vue__?.$options.name === 'TableCell'
      },
      breakCondition: (node) => node === document.body,
    })

    const row = li?.__vue__?.$props.row
    console.log('onclick', JSON.stringify(row))

    //切换编辑中状态
    if (row !== this.service.inEditRow) {
      this.service.inEditRow = null

      if (this.isNeedSort) {
        console.log('isNeedSort 重新pai')
        this.isNeedSort = false
        this.rows = this.sortCache
      }
    }

    //触发 单元格失去焦点事件 取消编辑状态
    document.dispatchEvent(new CustomEvent('rowBlur'))
  }

  mounted () {
    // this.$refs.xTable1.loadData(this.list)
    (this.$refs.xTable1.$el as HTMLElement).addEventListener('click', this.onclick)

    this.service.bindScrollToRow((row: IJSONRow) => {
      setTimeout(() => {
        this.$refs.xTable1.scrollToRow(row)
      }, 0)
    })
    this.service.bindScrollTo((y: number) => {
      setTimeout(() => {
        this.$refs.xTable1.scrollTo(undefined, y)
      }, 0)
    })

  }

  beforeDestroy () {
    (this.$refs.xTable1.$el as HTMLElement).removeEventListener('click', this.onclick)
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
          data: this.rows,
          'row-key': true,
          'row-id': 'id',
          // 'scroll-x': { gt: 10 },
          /** 虚拟滚动 */
          'scroll-y': { gt: 10 },
          /** 可调整宽度 */
          resizable: true,
          'row-class-name': ({ row }: { row: IJSONRow }): string => {
            if (row === this.service.inEditRow && this.isNeedSort) {
              return style.inEdit
            } else {
              return ''
            }
          },

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
              return <TableCell service={this.service} row={row} field={field} width={this.colsWidth[it.id]}></TableCell>
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

        </vxe-table-column>
      ))}
    </vxe-table>
  }
}