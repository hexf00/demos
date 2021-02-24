import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import table, { ITable } from '@/models/Table/Table'
import { IView } from '@/models/View/View'
import FieldPanel from '../Panel/FieldPanel/FieldPanel'
import style from './TableView.module.scss'
import Clickoutside from '@/directives/clickoutside'


@Component({
  directives: { Clickoutside },
})
export default class extends Vue {
  @Prop(Object) table!: ITable
  @Prop(Object) view!: IView

  mounted() {
  }

  isShowPopover = false

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
          <FieldPanel table={table} view={view}
            {...{ directives }}
          // 下面写法无效
          // directives={[{
          //   name: 'Clickoutside',
          //   value: () => {
          //     this.isShowPopover = false
          //   },
          // }]}
          />
          <el-button slot="reference" on={{
            click: () => {
              this.isShowPopover = !this.isShowPopover
            },
          }}>Field Config</el-button>
        </el-popover>

        <el-button on={{
          click: () => {

          },
        }}>add Row</el-button>
      </div>
      <div>
        <el-table data={this.list}>
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </div>
    </div >
  }
}