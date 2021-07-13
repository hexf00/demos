import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { ISelectOption } from '@/models/Table/fieldHelper'

import style from './index.module.scss'
import { Input } from 'element-ui'
import { TreeNode } from 'element-ui/types/tree'
import OptionItem from '../OptionItem/OptionItem'
import { IJSONSelectField } from '@/types/IJSONTableField'

@Component
export default class OptionList extends Vue {
  $refs!: {
    name: Input
  }

  @Prop(Object) field!: IJSONSelectField

  /** 判断拖拽是否允许放下 */
  isAllowDrop (raggingNode: TreeNode<string, ISelectOption>, dropNode: TreeNode<string, ISelectOption>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  removeOptions (option: ISelectOption) {
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
          const option: ISelectOption = {
            color: '',
            label: '',
            value: '',
          }
          selectOptions.push(option)
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
          default: ({ data }: { data: ISelectOption }) => {
            return <OptionItem props={{
              data,
              onRemove: (option) => this.removeOptions(option),
            }} />
          },
        }} />
    </div>
  }
}
