import { Vue, Component, Prop } from 'vue-property-decorator'
import { CreateElement } from 'vue'
import { IBlock } from '@/types/block'
import BlockEditor, { IBlockEditorService } from '../BlockEditor/BlockEditor'
import BlockViewer, { IBlockViewerService } from '../BlockViewer/BlockViewer'
import style from './style.module.scss'
import classnames from 'classnames'
import { IDragInfo } from '@/types/dragInfo'
import { isParent } from '@/libs/TreeHelper'
import { findParent, getOffset } from '@/libs/domHelper'
import Logger from '@/libs/Logger'

const console = Logger.use('block').enabled()

export interface IBlockService extends IBlockViewerService, IBlockEditorService {
  /** 是否处于编辑模式 */
  isEdit: boolean

  /** 是否出于被拖拽的状态 */
  isDrag: boolean

  /** 是否出于可放置的状态 */
  isDrop: boolean

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

  /** 开始拖拽，更新被拖拽节点 */
  dragstart(e: DragEvent) {
    // 说明：事件应停止冒泡，否则会递归通知到父级
    e.stopPropagation()

    console.log('dragstart', e)
    const dragInfo = this.service.getDragInfo()
    dragInfo.item = this.service
    dragInfo.item.isDrag = true
  }

  /** 拖拽结束 */
  dragend(e: DragEvent) {
    console.log('dragend', e)
    this.service.isDrag = false
  }

  /** 拖拽中，更新欲放置的位置 */
  dragover(e: DragEvent) {
    console.log('dragover', e)
    // 说明：这两句必须在return前执行
    // 说明：没有这句drop事件将不会被触发
    e.preventDefault()
    // 说明：事件应停止冒泡，否则会递归通知到父级
    e.stopPropagation()
    const dragInfo = this.service.getDragInfo()

    const target = this.service
    const { item } = dragInfo

    if (!item) {
      return
    }

    // 说明：限制不能移动到自身、子节点上
    // 说明：以上条件也适用于引用节点中
    if (isParent(target.data, item.data)) {
      dragInfo.pos = undefined
      return
    }

    this.service.isDrop = true
    dragInfo.target = this.service
    dragInfo.pos = this.calDropPosition(e)
  }

  /** 本次拖拽事件有效，将会执行 */
  drop(e: DragEvent) {
    console.log('drop', e)
    // 说明：事件应停止冒泡，否则会循环通知到父级
    e.stopPropagation()

    this.service.isDrop = false

    const dragInfo = this.service.getDragInfo()
    dragInfo.status = true
  }

  /** 拖拽结束时间 */
  dragleave(e: DragEvent) {
    e.preventDefault()
    // 说明：事件应停止冒泡，否则会递归通知到父级
    e.stopPropagation()

    console.log('dragleave', e)

    this.service.isDrop = false
  }

  /** 根据光标相对于节点DOM位置计算要放置具体位置 */
  calDropPosition(e: DragEvent) {
    const target = e.target as HTMLElement
    // 找到最近的可放置的父节点
    const li = findParent({
      node: target,
      parentKey: 'parentElement',
      findCondition: (node) => !!node.getAttribute('droppable'),
      breakCondition: (node) => node === document.body,
    })
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
    console.count('render')
    // const { pos } = dragInfo
    const pos = 'after'
    return <li droppable
      on={{ dragover: this.dragover, drop: this.drop, dragleave: this.dragleave }}
      class={classnames(style.li,
        this.service.isDrag && style.ondrag,
        this.service.isDrop && style.ondrop + ' ' + style[pos])}>
      <span draggable class={style.draggable} on={{ dragstart: this.dragstart, dragend: this.dragend }}>O</span>
      {this.service.data.useRefs.length > 0
        && <span class="useRefs">{this.service.data.useRefs.length}</span>}
      <div class={style.container}>
        {this.service.isEdit
          ? <BlockEditor service={this.service} />
          : <BlockViewer service={this.service} />}
        <ul>
          {this.service.children.map(item => <Block key={this.service.data.id} service={item}></Block>)}
        </ul>
      </div>
    </li>
  }
}
