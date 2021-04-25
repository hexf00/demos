import { IJSONTableField } from '@/models/Table/TableField'
import { IViewSorter } from '@/models/View/ViewSorter'
import { CreateElement, RenderContext } from 'vue'
import style from './SortPanel.module.scss'

export interface ISortPanel {
  data: IViewSorter
  bindSave: (fn: (sort: IViewSorter) => void) => void
  save: (sort: IViewSorter) => void
  getFields(fieldId: string): IJSONTableField[]
}

type Props = {
  service: ISortPanel

}

const SortPanel = {
  props: {
    service: Object,
  },
  functional: true,
  render(h: CreateElement, context: RenderContext<Props>) {
    console.log(context)
    const { props, parent, data } = context
    const { service } = props
    // // 通过缓存 可以减少get的调用次数，但是render会频繁调用
    // const fields = service.fields
    return <div>
      设置排序条件
      {
        service.data.rules.map((rule, index) => {
          return <div class={style.row} key={index}>
            <el-select class={style.select} size="mini" vModel={rule.field}>
              {service.getFields(rule.field).map(field => <el-option key={field.id} label={field.name} value={field.id}></el-option>)}
            </el-select>
            <el-radio-group size="mini" vModel={rule.type}>
              <el-radio-button label="升序"></el-radio-button>
              <el-radio-button label="降序"></el-radio-button>
            </el-radio-group>
          </div>
        })
      }
      <div>
        <el-button size="mini" on={{
          click() {
            service.data.rules.push({ field: '', type: 'asc' })
          },
        }}>添加</el-button>

        <el-button size="mini" on={{
          click() {
            service.save(service.data)
          },
        }}>保存</el-button>
      </div>
    </div>
  },
} as unknown as FunctionalComponent<Props>

export default SortPanel