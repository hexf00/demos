import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONTable } from '@/types/IJSONTable'
import { IView } from '@/models/View/View'
import FieldListPanel from '../Panel/FieldListPanel/FieldListPanel'
import style from './index.module.scss'
import Clickoutside from '@/directives/clickoutside'
import rowHelper from '@/models/Table/rowHelper'
import SortPanel from '../Panel/SorterPanel/SortPanel'
import SortPanelService from '../Panel/SorterPanel/SortPanel.service'
import { IViewSorter } from '@/models/View/ViewSorter'
import FieldListPanelService from '../Panel/FieldListPanel/service'
import SimpleTable from './components/Table'
import TableViewService from './service'
const isShowJSON = localStorage.getItem('isShowJSON')

@Component({
  directives: { Clickoutside },
})
export default class TableView extends Vue {
  @Prop(Object) table!: IJSONTable
  @Prop(Object) view!: IView

  service = new TableViewService(this.table, this.view)

  mounted () {
  }

  fieldListPanelService = new FieldListPanelService()

  /** 是否显示排序面板 */
  isShowSortPanelPopover = false

  /** 排序面板 */
  sortPanelService: SortPanelService | null = null

  constructor() {
    super()
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

  @Watch('table', { immediate: true })
  tableChange (table: IJSONTable) {
    this.service.table = table
  }
  @Watch('view', { immediate: true })
  change (view: IView) {
    this.service.view = view
  }

  render (h: CreateElement) {
    const { table, view } = this

    const directives = [{
      name: 'Clickoutside',
      value: ({ mouseup, mousedown }: { mouseup: MouseEvent; mousedown: MouseEvent }) => {

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

        this.fieldListPanelService.close()

        this.isShowSortPanelPopover = false
      },
    }]

    return <div>
      <div>{table.name} {view.name}</div>
      <div>
        <el-button size="mini" on={{
          click: () => {
            rowHelper.addRow(this.table)
          },
        }}>新增行</el-button>

        <el-button  {...{
          class: style.btn,
          props: {
            size: 'mini',
            disabled: this.service.selected.length === 0,
          },
          on: {
            click: () => {
              rowHelper.removeRow(this.table, this.service.selected)
            },
          },
        }}>删除行</el-button>

        <el-popover
          value={this.fieldListPanelService.isShow}
          popper-class={style.popperClass}
          placement="bottom-start"
          width="280"
          trigger="manual">
          {
            this.fieldListPanelService.isShow &&
            <FieldListPanel service={this.fieldListPanelService} table={table} view={view} {...{ directives }} />
          }
          <el-button class={style.btn} size="mini" slot="reference" on={{
            click: () => {
              this.fieldListPanelService.open()
            },
          }}>列配置</el-button>
        </el-popover>

        <el-popover
          value={this.isShowSortPanelPopover}
          popper-class={style.popperClass}
          placement="bottom-start"
          width="280"
          trigger="manual">
          {
            this.isShowSortPanelPopover
            && <SortPanel service={this.sortPanelService} {...{ directives }} />
          }
          <el-button class={style.btn} size="mini" slot="reference" on={{
            click: () => {
              // 初始化排序数据
              const sortPanelService = new SortPanelService(
                this.view.sort || { isAutoSort: false, rules: [] },
                this.view,
                this.table
              )
              sortPanelService.bindSave((sort: IViewSorter) => {
                this.view.sort = sort
              })
              this.sortPanelService = sortPanelService

              this.isShowSortPanelPopover = !this.isShowSortPanelPopover
            },
          }}>排序</el-button>
        </el-popover>

      </div>
      <div>
        <SimpleTable service={this.service}></SimpleTable>
      </div>
      {isShowJSON && <div class={style.log}>
        <pre>{JSON.stringify(table, null, 2)}</pre>
      </div>}
    </div >
  }
}