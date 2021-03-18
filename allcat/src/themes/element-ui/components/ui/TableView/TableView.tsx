import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import JsonTable, { IJSONTable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'
import FieldPanel from '../Panel/FieldPanel/FieldPanel'
import style from './TableView.module.scss'
import Clickoutside from '@/directives/clickoutside'
import JsonRow from '@/models/Table/Row'


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
            || parent.classList.contains('el-message-box__wrapper') /** 信息框的模态框 */) {
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
          {this.isShowPopover && <FieldPanel table={table} view={view}
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
        <el-table data={this.list} row-key="id">
          {this.cols.map(it => (
            <el-table-column prop={it.id} label={it.name} width="180"></el-table-column>
          ))}
        </el-table>
      </div>
    </div >
  }
}