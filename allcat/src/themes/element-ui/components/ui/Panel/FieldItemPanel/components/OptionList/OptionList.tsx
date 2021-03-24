import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IJSONTableField, TSelectOption } from '@/models/Table/TableField'
import style from './index.module.scss'
import { Input } from 'element-ui'
import { TreeNode } from 'element-ui/types/tree'
import Icon from '@/themes/element-ui/components/base/Icon/Icon'
import OptionItem from '../OptionItem/OptionItem'
import { debug } from 'webpack'


@Component
export default class OptionList extends Vue {
  $refs!: {
    name: Input
  }

  @Prop(Object) field!: IJSONTableField

  /** 判断拖拽是否允许放下 */
  isAllowDrop(raggingNode: TreeNode<string, TSelectOption>, dropNode: TreeNode<string, TSelectOption>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  render(h: CreateElement) {
    const list = this.field.selectOptions
    return <el-tree
      props={{
        data: list,
        draggable: true,
        allowDrop: this.isAllowDrop,
        nodeKey: 'id',
        class: style.tree,
        defaultExpandAll: true,
      }}
      scopedSlots={{
        default: ({ data }: { data: TSelectOption }) => {
          return <OptionItem data={data} />
        },
      }} />
  }
}
