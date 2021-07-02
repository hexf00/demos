import { Vue, Component, Prop } from 'vue-property-decorator'
import { IJSONTableField } from '@/models/Table/TableField'
import { ISortRule, IViewSorter } from '@/models/View/ViewSorter'
import { CreateElement } from 'vue'
import style from './SortPanel.module.scss'
import { TreeNode } from 'element-ui/types/tree'
export interface ISortPanel {
  data: IViewSorter
  save: (sort: IViewSorter) => void
  getFields (fieldId: string): IJSONTableField[]
}

@Component
export default class FieldListPanel extends Vue {
  @Prop(Object) service!: ISortPanel

  /** 判断拖拽是否允许放下 */
  isAllowDrop (raggingNode: TreeNode<string, ISortRule>, dropNode: TreeNode<string, ISortRule>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  render (h: CreateElement) {
    const service = this.service

    return <div class={style.box}>
      <el-tree
        props={{
          data: service.data.rules,
          draggable: true,
          allowDrop: this.isAllowDrop,
          // nodeKey: 'id',
          class: style.tree,
          defaultExpandAll: true,
        }
        }
        scopedSlots={{
          default: ({ data }: { data: ISortRule }) => {
            const rule = data
            return <div class={style.row}>
              <el-select class={style.select} size="mini" vModel={rule.field}>
                {service.getFields(rule.field).map(field => <el-option key={field.id} label={field.name} value={field.id}></el-option>)}
              </el-select>
              <el-radio-group size="mini" vModel={rule.type}>
                <el-radio-button label="asc">升序</el-radio-button>
                <el-radio-button label="desc">降序</el-radio-button>
              </el-radio-group>
              <i class="el-icon-close" on={{
                click () {
                  const rules = service.data.rules
                  const index = rules.indexOf(rule)
                  index !== -1 && rules.splice(index, 1)
                },
              }}></i>

            </div>
          },
        }} />
      <div>
        <el-button size="mini" on={{
          click () {
            service.data.rules.push({ field: '', type: 'asc' })
          },
        }}>添加</el-button>

        <el-button size="mini" on={{
          click () {
            service.save(service.data)
          },
        }}>保存</el-button>
      </div>
    </div>
  }
}
