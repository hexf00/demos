import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { ISelectOption } from '@/models/Table/fieldHelper'

import style from './index.module.scss'
import { TreeNode } from 'element-ui/types/tree'
import OptionItem from '../OptionItem/OptionItem'
import SelectManager from '@/services/SelectManager'

@Component
export default class OptionList extends Vue {
  $props!: {
    service: SelectManager
  }

  @Prop(Object) service!: SelectManager

  /** 判断拖拽是否允许放下 */
  isAllowDrop (raggingNode: TreeNode<string, ISelectOption>, dropNode: TreeNode<string, ISelectOption>, pos: 'prev' | 'inner' | 'next') {
    if (pos === 'inner') {
      return false
    }

    return true
  }

  render (h: CreateElement) {
    return <div>
      <el-button size="mini" on={{
        click: () => this.service.addOption(),
      }}>添加一个选项</el-button>
      <p>提示:选项具有唯一性，相同会被合并，颜色保留第一项。</p>
      <el-tree
        props={{
          data: this.service.options,
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
              onRemove: (option) => this.service.removeOption(option),
            }} />
          },
        }} />
    </div>
  }
}
