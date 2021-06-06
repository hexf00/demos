import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockEditor, { IBlockEditorService } from '../BlockEditor/BlockEditor'
import BlockViewer, { IBlockViewerService } from '../BlockViewer/BlockViewer'
import style from './style.module.scss'
import classnames from 'classnames'
import { IDragInfo } from '@/types/dragInfo'
import { isParent } from '@/libs/TreeHelper'
import { getOffset } from '@/libs/domHelper'
export interface IBlockService extends IBlockViewerService, IBlockEditorService {
  /** 是否处于编辑模式 */
  isEdit: boolean

  /** 数据 */
  data: ITreeItem<IBlock>

  /** 获取拖拽数据 */
  getDragInfo: () => IDragInfo<IBlockService>
}

@Component
export default class Block extends Vue {
  // 配置JSX中属性类型检查
  $props!: {
    service: ITreeItem<IBlockService>
  }

  @Prop(Object) service!: ITreeItem<IBlockService>

  dragstart(e: DragEvent) {
    const dragInfo = this.service.getDragInfo()
    dragInfo.item = this.service
  }

  dragover(e: DragEvent) {
    // 说明：这两句必须在return前执行
    // 说明：没有这句drop事件将不会被触发
    e.preventDefault()
    // 说明：事件应停止冒泡，否则会递归通知到父级
    e.stopPropagation()
    const dragInfo = this.service.getDragInfo()

    const target = this.service
    const { item } = dragInfo

    // 说明：限制不能移动到自身、子节点上
    if (item && isParent(target, item)) {
      dragInfo.pos = undefined
      return
    }

    dragInfo.target = this.service
    dragInfo.pos = this.calDropPosition(e)
  }

  drop(e: DragEvent) {
    // 说明：事件应停止冒泡，否则会循环通知到父级
    e.stopPropagation()

    const dragInfo = this.service.getDragInfo()
    dragInfo.status = true
  }

  calDropPosition(e: DragEvent) {

    const findParent = (node: HTMLElement, condition: (node: HTMLElement) => boolean) => {
      let parent: HTMLElement | null = node

      while (parent && parent !== document.body) {
        if (condition(parent)) {
          return parent
        }
        parent = parent.parentElement
      }
    }

    const target = e.target as HTMLElement
    // 找到最近的可放置的父节点
    const li = findParent(target, (node) => !!node.getAttribute('droppable'))
    if (!li) {
      return
    }

    const { offsetTop, offsetLeft } = getOffset(li)
    const { offsetHeight } = li
    const { pageX, pageY } = e
    const gapHeight = 0.5 * offsetHeight

    // console.log(` offsetTop:${offsetTop}, offsetLeft:${offsetLeft}, offsetHeight:${offsetHeight}`, target, li)
    if (pageY < offsetTop + gapHeight) {

      //放在目标节点前面-同级
      return 'before'
    }
    if (pageX < offsetLeft + 30) {
      //放在目标节点后面-同级
      return 'after'
    }
    //放在目标节点里面-作为子节点
    return 'inner'
  }

  render(h: CreateElement) {
    const dragInfo = this.service.getDragInfo()
    const { item, target, pos } = dragInfo

    return <li droppable on={{
      dragover: this.dragover,
      drop: this.drop,
    }} class={classnames(style.li,
      item === this.service && style.ondrag,
      target === this.service && pos && style.ondrop + ' ' + style[pos])}>
      <span draggable class={style.draggable} on={{
        dragstart: this.dragstart,
      }}>O</span>
      <div class={style.container}>
        {
          this.service.isEdit ? <BlockEditor service={this.service} /> : <BlockViewer service={this.service} />
        }
        <ul>
          {this.service.children.map(item => <Block service={item}></Block>)}
        </ul>
      </div>
    </li>
  }
}
