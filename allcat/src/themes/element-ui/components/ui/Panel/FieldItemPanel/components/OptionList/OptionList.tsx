import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { TSelectOption } from '@/models/Table/fieldHelper'

import style from './index.module.scss'
import { Input } from 'element-ui'
import { TreeNode } from 'element-ui/types/tree'
import OptionItem from '../OptionItem/OptionItem'
import { IJSONTableField } from '@/models/Table/IJSONTableField'


@Component
export default class OptionList extends Vue {
  $refs!: {
    name: Input
  }

  @Prop(Object) field!: IJSONTableField

  /** 判断拖拽是否允许放下 */
  isAllowDrop (raggingNode: TreeNode<string, TSelectOption>, dropNode: TreeNode<string, TSelectOption>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  removeOptions (option: TSelectOption) {
    const { selectOptions } = this.field
    if (selectOptions) {
      const index = selectOptions.indexOf(option)
      if (index !== -1) {
        selectOptions.splice(index, 1)
      }
    }
  }

  render (h: CreateElement) {
    const list = this.field.selectOptions
    return <div>
      <el-button size="mini" on={{
        click: () => {
          const { selectOptions } = this.field
          selectOptions?.push({
            color: '',
            value: '',
          })
        },
      }}>添加一个选项</el-button>
      <el-tree
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
            return <OptionItem props={{
              data,
              onRemove: (option) => this.removeOptions(option),
            }} />
          },
        }} />
    </div>
  }
}
